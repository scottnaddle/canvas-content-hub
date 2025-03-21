
import { useState, useEffect } from "react";
import { Search, Filter, UploadCloud, Grid, List, FileText, Video, Music, File, Play, Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import ContentCard from "@/components/content/ContentCard";
import ContentUploader from "@/components/content/ContentUploader";
import { useAuth } from "@/hooks/useAuth";
import { useContentItems, useCategories } from "@/hooks/content";
import { ContentType, ContentWithDetails } from "@/types/content";

const ContentLibrary = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user, isAdmin, isInstructor } = useAuth();
  const { data: contentItems, isLoading: isContentLoading } = useContentItems();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("any");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  
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
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'presentation':
      case 'spreadsheet':
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
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
  
  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
    setDateFilter("any");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 pt-32">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t("library.title")}</h1>
              <p className="text-muted-foreground">학습 콘텐츠를 찾아보고, 검색하고, 관리하세요</p>
            </div>
            <div className="mt-4 md:mt-0">
              {(isAdmin || isInstructor) && (
                <Button 
                  onClick={() => setIsUploaderOpen(true)}
                  className="animate-fade-in flex items-center gap-2"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>{t("library.uploadNew")}</span>
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("library.searchPlaceholder")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{t("library.filter.title")}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{t("library.filter.title")}</SheetTitle>
                    <SheetDescription>
                      유형, 카테고리 등으로 콘텐츠 필터링
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-6 space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{t("library.filter.contentType")}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {["video", "audio", "document", "presentation", "spreadsheet", "scorm", "other"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`type-${type}`} 
                              checked={selectedTypes.includes(type as ContentType)}
                              onCheckedChange={() => handleTypeCheckboxChange(type as ContentType)}
                            />
                            <Label htmlFor={`type-${type}`} className="text-sm font-normal capitalize">
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{t("library.filter.category")}</h4>
                      <div className="space-y-2">
                        {isCategoriesLoading ? (
                          <p className="text-sm text-muted-foreground">로딩 중...</p>
                        ) : categories && categories.length > 0 ? (
                          categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`category-${category.id}`} 
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={() => handleCategoryCheckboxChange(category.id)}
                              />
                              <Label htmlFor={`category-${category.id}`} className="text-sm font-normal">
                                {category.name}
                              </Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">카테고리 없음</p>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{t("library.filter.date")}</h4>
                      <RadioGroup value={dateFilter} onValueChange={setDateFilter}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="any" id="date-any" />
                          <Label htmlFor="date-any" className="text-sm font-normal">모든 기간</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="week" id="date-week" />
                          <Label htmlFor="date-week" className="text-sm font-normal">지난 주</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="month" id="date-month" />
                          <Label htmlFor="date-month" className="text-sm font-normal">지난 달</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="year" id="date-year" />
                          <Label htmlFor="date-year" className="text-sm font-normal">지난 해</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={clearFilters}>
                        {t("library.filter.clearAll")}
                      </Button>
                      <Button onClick={() => document.body.click()}>
                        {t("library.filter.apply")}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("library.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("library.sortOptions.newest")}</SelectItem>
                  <SelectItem value="oldest">{t("library.sortOptions.oldest")}</SelectItem>
                  <SelectItem value="titleAZ">{t("library.sortOptions.titleAZ")}</SelectItem>
                  <SelectItem value="titleZA">{t("library.sortOptions.titleZA")}</SelectItem>
                  <SelectItem value="mostViewed">{t("library.sortOptions.mostViewed")}</SelectItem>
                  <SelectItem value="mostDownloaded">{t("library.sortOptions.mostDownloaded")}</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {(selectedTypes.length > 0 || selectedCategories.length > 0 || searchQuery || dateFilter !== "any") && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTypes.map(type => (
                <Badge key={type} variant="outline" className="bg-background flex items-center gap-1">
                  {type}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => handleTypeCheckboxChange(type)}
                  >
                    ×
                  </Button>
                </Badge>
              ))}
              
              {selectedCategories.map(categoryId => {
                const category = categories?.find(c => c.id === categoryId);
                return category ? (
                  <Badge key={categoryId} variant="outline" className="bg-background flex items-center gap-1">
                    {category.name}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleCategoryCheckboxChange(categoryId)}
                    >
                      ×
                    </Button>
                  </Badge>
                ) : null;
              })}
              
              {dateFilter !== "any" && (
                <Badge variant="outline" className="bg-background flex items-center gap-1">
                  {dateFilter === "week" ? "지난 주" : 
                   dateFilter === "month" ? "지난 달" : 
                   dateFilter === "year" ? "지난 해" : dateFilter}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setDateFilter("any")}
                  >
                    ×
                  </Button>
                </Badge>
              )}
              
              {searchQuery && (
                <Badge variant="outline" className="bg-background flex items-center gap-1">
                  검색: {searchQuery}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setSearchQuery("")}
                  >
                    ×
                  </Button>
                </Badge>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7"
                onClick={clearFilters}
              >
                모든 필터 지우기
              </Button>
            </div>
          )}
          
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <TabsList>
              <TabsTrigger value="all">{t("library.allContent")}</TabsTrigger>
              <TabsTrigger value="videos">비디오</TabsTrigger>
              <TabsTrigger value="documents">문서</TabsTrigger>
              <TabsTrigger value="audio">오디오</TabsTrigger>
              <TabsTrigger value="other">기타</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {isContentLoading ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="aspect-video bg-muted rounded-t-md"></div>
                        <CardContent className="p-4">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="flex p-4">
                          <div className="w-20 h-16 bg-muted rounded-md mr-4"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-3/4"></div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )
              ) : filteredContent.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContent.map((content) => (
                      <ContentCard key={content.id} content={content} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredContent.map((content) => (
                      <Card key={content.id} className="hover-elevate overflow-hidden">
                        <div className="flex p-4">
                          <div className="w-24 h-16 bg-muted rounded-md mr-4 flex-shrink-0 overflow-hidden">
                            {content.thumbnail_url ? (
                              <img 
                                src={content.thumbnail_url} 
                                alt={content.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-secondary">
                                {getTypeIcon(content.type)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                {getTypeIcon(content.type)}
                                <span className="capitalize">{content.type}</span>
                              </span>
                              {content.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="font-semibold text-base truncate">{content.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{content.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{new Date(content.upload_date).toLocaleDateString()}</span>
                              <span className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                {content.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {content.downloads}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center ml-4">
                            <Button size="sm" variant="outline" className="mr-2">
                              <Play className="h-4 w-4 mr-1" />
                              {t("content.actions.view")}
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <File className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">{t("library.noContentFound")}</h3>
                  <p className="text-muted-foreground mb-4">
                    검색어나 필터를 조정해보세요
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    필터 초기화
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="videos" className="mt-6">
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
            </TabsContent>
            
            <TabsContent value="audio" className="mt-6">
            </TabsContent>
            
            <TabsContent value="other" className="mt-6">
            </TabsContent>
          </Tabs>
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
