
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContentUploader from "@/components/content/ContentUploader";
import { useAuth } from "@/hooks/useAuth";
import { useContentItems, useCategories } from "@/hooks/content";
import { useContentFilters } from "@/components/content-library/ContentLibraryFilters";
import ContentLibraryHeader from "@/components/content-library/ContentLibraryHeader";
import SearchAndViewControls from "@/components/content-library/SearchAndViewControls";
import FilterBadges from "@/components/content-library/FilterBadges";
import ContentTabs from "@/components/content-library/ContentTabs";

const ContentLibrary = () => {
  const { user, isAdmin, isInstructor } = useAuth();
  const { data: contentItems, isLoading: isContentLoading } = useContentItems();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  
  const {
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
  } = useContentFilters(contentItems);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 pt-32">
        <div className="container px-4 mx-auto">
          <ContentLibraryHeader 
            isAdmin={isAdmin} 
            isInstructor={isInstructor} 
            setIsUploaderOpen={setIsUploaderOpen} 
          />
          
          <SearchAndViewControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
            clearFilters={clearFilters}
          />
          
          <FilterBadges
            selectedTypes={selectedTypes}
            selectedCategories={selectedCategories}
            dateFilter={dateFilter}
            searchQuery={searchQuery}
            categories={categories}
            handleTypeCheckboxChange={handleTypeCheckboxChange}
            handleCategoryCheckboxChange={handleCategoryCheckboxChange}
            setDateFilter={setDateFilter}
            setSearchQuery={setSearchQuery}
            clearFilters={clearFilters}
          />
          
          <ContentTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isContentLoading={isContentLoading}
            filteredContent={filteredContent}
            viewMode={viewMode}
            clearFilters={clearFilters}
          />
        </div>
      </main>
      
      <ContentUploader 
        isOpen={isUploaderOpen} 
        onClose={() => setIsUploaderOpen(false)} 
      />
      
      <Footer />
    </div>
  );
};

export default ContentLibrary;
