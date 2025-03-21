
import { useState } from "react";
import { ContentWithDetails, ContentType } from "@/types/content";

export const useContentFilters = (contentItems: ContentWithDetails[] | undefined) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("any");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
    setDateFilter("any");
    setSearchQuery("");
  };

  const handleTypeCheckboxChange = (type: ContentType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  const handleCategoryCheckboxChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const filterContent = (content: ContentWithDetails[]): ContentWithDetails[] => {
    if (!content) return [];
    
    return content.filter(item => {
      const textMatch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const typeMatch = activeTab === "all" 
        ? true
        : (activeTab === "videos" && item.type === "video") ||
          (activeTab === "documents" && item.type === "document") ||
          (activeTab === "audio" && item.type === "audio") || 
          (activeTab === "other" && !["video", "document", "audio"].includes(item.type));
      
      const advancedTypeMatch = selectedTypes.length === 0 || selectedTypes.includes(item.type);
      
      const advancedCategoryMatch = selectedCategories.length === 0 || 
        (item.category_id && selectedCategories.includes(item.category_id));
      
      let dateMatch = true;
      const now = new Date();
      const uploadDate = new Date(item.upload_date);
      
      if (dateFilter === "week") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateMatch = uploadDate >= oneWeekAgo;
      } else if (dateFilter === "month") {
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateMatch = uploadDate >= oneMonthAgo;
      } else if (dateFilter === "year") {
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateMatch = uploadDate >= oneYearAgo;
      }
      
      return textMatch && typeMatch && advancedTypeMatch && advancedCategoryMatch && dateMatch;
    });
  };
  
  const sortContent = (content: ContentWithDetails[]): ContentWithDetails[] => {
    if (!content) return [];
    
    return [...content].sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime();
        case "oldest":
          return new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime();
        case "titleAZ":
          return a.title.localeCompare(b.title);
        case "titleZA":
          return b.title.localeCompare(a.title);
        case "mostViewed":
          return b.views - a.views;
        case "mostDownloaded":
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });
  };

  const filteredContent = sortContent(filterContent(contentItems || []));

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    selectedTypes,
    setSelectedTypes,
    selectedCategories,
    setSelectedCategories,
    dateFilter,
    setDateFilter,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    clearFilters,
    handleTypeCheckboxChange,
    handleCategoryCheckboxChange,
    filteredContent
  };
};
