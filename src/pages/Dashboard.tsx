
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, FileUp, Grid3X3, FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import ContentCard from "@/components/content/ContentCard";

const Dashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Placeholder data
  const recentContent = [
    {
      id: "1",
      title: "Introduction to Canvas LMS",
      type: "video" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxlYXJuaW5nJTIwb25saW5lfGVufDB8fDB8fHww",
      views: 248,
      uploadDate: new Date("2023-11-10")
    },
    {
      id: "2",
      title: "Best Practices for Online Teaching",
      type: "document" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3VtZW50fGVufDB8fDB8fHww",
      views: 186,
      uploadDate: new Date("2023-12-05")
    },
    {
      id: "3",
      title: "Educational Assessment Techniques",
      type: "presentation" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJlc2VudGF0aW9ufGVufDB8fDB8fHww",
      views: 124,
      uploadDate: new Date("2024-01-15")
    }
  ];
  
  const statsCards = [
    {
      title: t("dashboard.totalContent"),
      value: "42",
      description: "Content items",
      icon: <FileSpreadsheet className="h-6 w-6 text-primary" />,
    },
    {
      title: t("dashboard.totalViews"),
      value: "1,284",
      description: "Last 30 days",
      icon: <Grid3X3 className="h-6 w-6 text-primary" />,
    },
    {
      title: t("dashboard.completionRate"),
      value: "68%",
      description: "Average completion",
      progress: 68,
      icon: <Upload className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 pt-32">
        <div className="container px-4 mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.welcome", { name: "User" })}</h1>
              <p className="text-muted-foreground">Here's an overview of your content and activities</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Link to="/content-library">
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>{t("content.upload.title")}</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {statsCards.map((card, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                  {card.progress && (
                    <Progress
                      value={card.progress}
                      className="h-2 mt-2"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Main Dashboard Content */}
          <div className="grid gap-4 md:grid-cols-7">
            {/* Content tabs section - wider */}
            <Tabs defaultValue="recent" className="md:col-span-5">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="drafts">Drafts</TabsTrigger>
                </TabsList>
                <Link to="/content-library" className="text-sm text-primary hover:underline">
                  View all →
                </Link>
              </div>
              
              <TabsContent value="recent" className="m-0">
                {isLoading ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
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
                  <div className="grid gap-4 md:grid-cols-3">
                    {recentContent.map((content) => (
                      <ContentCard key={content.id} content={content} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular" className="m-0">
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Placeholder content for other tabs */}
                  <Card className="relative group overflow-hidden">
                    <div className="aspect-video bg-muted rounded-t-md flex items-center justify-center text-muted-foreground">
                      Popular content will appear here
                    </div>
                    <CardContent className="p-4">
                      <div className="h-4 rounded w-3/4 mb-2 bg-muted"></div>
                      <div className="h-3 rounded w-1/2 bg-muted"></div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="drafts" className="m-0">
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Placeholder content for other tabs */}
                  <Card className="relative group overflow-hidden">
                    <div className="aspect-video bg-muted rounded-t-md flex items-center justify-center text-muted-foreground">
                      Draft content will appear here
                    </div>
                    <CardContent className="p-4">
                      <div className="h-4 rounded w-3/4 mb-2 bg-muted"></div>
                      <div className="h-3 rounded w-1/2 bg-muted"></div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Activity sidebar - narrower */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("dashboard.recentActivity")}</CardTitle>
                  <CardDescription>Latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted"></div>
                          <div className="space-y-1 flex-1">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-primary flex items-center justify-center">
                          <FileUp className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">You uploaded "Introduction to Canvas LMS"</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <Grid3X3 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">28 new views on your content</p>
                          <p className="text-xs text-muted-foreground">Today</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                          <FileUp className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">You updated "Best Practices for Online Teaching"</p>
                          <p className="text-xs text-muted-foreground">Yesterday</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                          <FileSpreadsheet className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">12 downloads of your documents</p>
                          <p className="text-xs text-muted-foreground">This week</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button variant="outline" className="w-full" size="sm">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
