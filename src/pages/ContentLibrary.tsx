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

const ContentLibrary = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Placeholder data
  const contentItems = [
    {
      id: "1",
      title: "Introduction to Canvas LMS",
      description: "A comprehensive guide to getting started with Canvas LMS, covering the basics and advanced features.",
      type: "video" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxlYXJuaW5nJTIwb25saW5lfGVufDB8fDB8fHww",
      fileSize: 25600000,
      duration: 1560,
      category: "Tutorials",
      tags: ["Canvas", "LMS", "Getting Started"],
      author: "John Doe",
      uploadDate: new Date("2023-11-10"),
      lastModified: new Date("2023-11-15"),
      views: 248,
      downloads: 56,
      completionRate: 72,
    },
    {
      id: "2",
      title: "Best Practices for Online Teaching",
      description: "Learn about effective strategies for online teaching and engaging students in virtual classrooms.",
      type: "document" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3VtZW50fGVufDB8fDB8fHww",
      fileSize: 3500000,
      category: "Best Practices",
      tags: ["Online Teaching", "Engagement", "Virtual Classroom"],
      author: "Jane Smith",
      uploadDate: new Date("2023-12-05"),
      lastModified: new Date("2023-12-05"),
      views: 186,
      downloads: 92,
    },
    {
      id: "3",
      title: "Educational Assessment Techniques",
      description: "A presentation on different assessment methods and how to implement them effectively in your courses.",
      type: "presentation" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJlc2VudGF0aW9ufGVufDB8fDB8fHww",
      fileSize: 8200000,
      category: "Assessment",
      tags: ["Evaluation", "Grading", "Feedback"],
      author: "Robert Johnson",
      uploadDate: new Date("2024-01-15"),
      lastModified: new Date("2024-01-20"),
      views: 124,
      downloads: 67,
    },
    {
      id: "4",
      title: "Course Design Principles",
      description: "Learn about instructional design principles for creating effective and engaging online courses.",
      type: "document" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9jdW1lbnR8ZW58MHx8MHx8fDA%3D",
      fileSize: 4800000,
      category: "Design",
      tags: ["Course Design", "Instructional Design", "eLearning"],
      author: "Sarah Wilson",
      uploadDate: new Date("2024-01-28"),
      lastModified: new Date("2024-01-28"),
      views: 98,
      downloads: 45,
    },
    {
      id: "5",
      title: "Student Engagement Strategies",
      description: "Audio lecture discussing various strategies to increase student engagement in online and hybrid courses.",
      type: "audio" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1590602846037-3a93ae6f05b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXVkaW98ZW58MHx8MHx8fDA%3D",
      fileSize: 12500000,
      duration: 2580,
      category: "Engagement",
      tags: ["Student Engagement", "Motivation", "Active Learning"],
      author: "Michael Brown",
      uploadDate: new Date("2024-02-10"),
      lastModified: new Date("2024-02-12"),
      views: 76,
      downloads: 32,
    },
    {
      id: "6",
      title: "Canvas Quiz Creation Tutorial",
      description: "Step-by-step video tutorial on creating effective quizzes in Canvas LMS with various question types.",
      type: "video" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1602526215608-1e9aa040c87e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHZpZGVvJTIwdHV0b3JpYWx8ZW58MHx8MHx8fDA%3D",
      fileSize: 32000000,
      duration: 1860,
      category: "Tutorials",
      tags: ["Canvas", "Quiz", "Assessment"],
      author: "David Lee",
      uploadDate: new Date("2024-02-15"),
      lastModified: new Date("2024-02-15"),
      views: 112,
      downloads: 28,
      completionRate: 65,
    }
  ];
  
  // Filter function
  const filteredContent = contentItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Type icon function
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'presentation':
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 pt-32">
        <div className="container px-4 mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t("library.title")}</h1>
              <p className="text-muted-foreground">Browse, search and manage your learning content</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                onClick={() => setIsUploaderOpen(true)}
                className="animate-fade-in flex items-center gap-2"
              >
                <UploadCloud className="h-4 w-4" />
                <span>{t("library.uploadNew")}</span>
              </Button>
            </div>
          </div>
          
          {/* Search and Filter Bar */}
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
                      Filter content by type, category, and more
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-6 space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{t("library.filter.contentType")}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {["video", "audio", "document", "presentation", "spreadsheet", "scorm"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox id={`type-${type}`} />
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
                        {["Tutorials", "Best Practices", "Assessment", "Design", "Engagement"].map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox id={`category-${category}`} />
                            <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{t("library.filter.date")}</h4>
                      <RadioGroup defaultValue="any">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="any" id="date-any" />
                          <Label htmlFor="date-any" className="text-sm font-normal">Any time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="week" id="date-week" />
                          <Label htmlFor="date-week" className="text-sm font-normal">Past week</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="month" id="date-month" />
                          <Label htmlFor="date-month" className="text-sm font-normal">Past month</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="year" id="date-year" />
                          <Label htmlFor="date-year" className="text-sm font-normal">Past year</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline">{t("library.filter.clearAll")}</Button>
                      <Button>{t("library.filter.apply")}</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Select defaultValue="newest">
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
          
          {/* Content Tabs */}
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">{t("library.allContent")}</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="bg-background flex items-center gap-1">
                {t("common.allCategories")}
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">×</Button>
              </Badge>
              
              <Badge variant="outline" className="bg-background flex items-center gap-1">
                Tutorials
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">×</Button>
              </Badge>
            </div>
            
            {/* Content Grid/List */}
            <TabsContent value="all" className="mt-6">
              {isLoading ? (
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
                            {content.thumbnailUrl ? (
                              <img 
                                src={content.thumbnailUrl} 
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
                              <span>{new Date(content.uploadDate).toLocaleDateString()}</span>
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
                    Try adjusting your search or filters
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Other tabs would follow the same pattern */}
            <TabsContent value="videos" className="mt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Video content filter will be available soon
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Document content filter will be available soon
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="audio" className="mt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Audio content filter will be available soon
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="other" className="mt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Other content filter will be available soon
                </p>
              </div>
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
