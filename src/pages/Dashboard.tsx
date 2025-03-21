import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "@/hooks/useAuth";
import { useRecentContent, usePopularContent } from "@/hooks/useContent";
import ContentUploader from "@/components/content/ContentUploader";

const Dashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  
  const { data: recentContent, isLoading: isRecentLoading } = useRecentContent(3);
  const { data: popularContent, isLoading: isPopularLoading } = usePopularContent(3);
  
  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({
        title: "인증 필요",
        description: "대시보드를 보려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, isAuthLoading, navigate, toast]);
  
  const isLoading = isAuthLoading || isRecentLoading;
  
  const statsCards = [
    {
      title: t("dashboard.totalContent"),
      value: recentContent ? recentContent.length.toString() : "0",
      description: "Content items",
      icon: <FileSpreadsheet className="h-6 w-6 text-primary" />,
    },
    {
      title: t("dashboard.totalViews"),
      value: recentContent 
        ? recentContent.reduce((sum, item) => sum + item.views, 0).toString() 
        : "0",
      description: "Total views",
      icon: <Grid3X3 className="h-6 w-6 text-primary" />,
    },
    {
      title: t("dashboard.completionRate"),
      value: recentContent && recentContent.some(item => item.completion_rate !== null)
        ? `${Math.round(recentContent.reduce((sum, item) => 
            sum + (item.completion_rate || 0), 0) / 
            recentContent.filter(item => item.completion_rate !== null).length)}%`
        : "N/A",
      description: "Average completion",
      progress: recentContent && recentContent.some(item => item.completion_rate !== null)
        ? Math.round(recentContent.reduce((sum, item) => 
            sum + (item.completion_rate || 0), 0) / 
            recentContent.filter(item => item.completion_rate !== null).length)
        : 0,
      icon: <Upload className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 pt-32">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t("dashboard.welcome", { name: profile?.name || "사용자" })}
              </h1>
              <p className="text-muted-foreground">콘텐츠와 활동에 대한 개요입니다</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button className="flex items-center gap-2" onClick={() => setIsUploaderOpen(true)}>
                <PlusCircle className="h-4 w-4" />
                <span>{t("content.upload.title")}</span>
              </Button>
            </div>
          </div>
          
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
                  {card.progress !== undefined && (
                    <Progress
                      value={card.progress}
                      className="h-2 mt-2"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid gap-4 md:grid-cols-7">
            <Tabs defaultValue="recent" className="md:col-span-5">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="recent">최근</TabsTrigger>
                  <TabsTrigger value="popular">인기</TabsTrigger>
                  <TabsTrigger value="drafts">임시 저장</TabsTrigger>
                </TabsList>
                <Link to="/content-library" className="text-sm text-primary hover:underline">
                  모두 보기 →
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
                ) : recentContent && recentContent.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {recentContent.map((content) => (
                      <ContentCard 
                        key={content.id} 
                        content={content} 
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">아직 업로드한 콘텐츠가 없습니다.</p>
                    <Button onClick={() => setIsUploaderOpen(true)}>
                      첫 번째 콘텐츠 업로드
                    </Button>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="popular" className="m-0">
                {isPopularLoading ? (
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
                ) : popularContent && popularContent.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {popularContent.map((content) => (
                      <ContentCard 
                        key={content.id} 
                        content={content} 
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                      인기 콘텐츠가 아직 없습니다. 더 많은 콘텐츠를 업로드하세요.
                    </p>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="drafts" className="m-0">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="relative group overflow-hidden">
                    <div className="aspect-video bg-muted rounded-t-md flex items-center justify-center text-muted-foreground">
                      임시 저장 기능은 곧 제공됩니다
                    </div>
                    <CardContent className="p-4">
                      <div className="h-4 rounded w-3/4 mb-2 bg-muted"></div>
                      <div className="h-3 rounded w-1/2 bg-muted"></div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("dashboard.recentActivity")}</CardTitle>
                  <CardDescription>최신 활동 및 업데이트</CardDescription>
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
                  ) : recentContent && recentContent.length > 0 ? (
                    <div className="space-y-4">
                      {recentContent.map((content, index) => (
                        <div key={content.id} className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-primary flex items-center justify-center">
                            <FileUp className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {index === 0 ? "새 콘텐츠를 업로드했습니다" : "콘텐츠를 업로드했습니다"}: "{content.title}"
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(content.upload_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {recentContent.length > 0 && (
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                            <Grid3X3 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              콘텐츠에 {recentContent.reduce((sum, item) => sum + item.views, 0)}회의 새로운 조회수가 있습니다
                            </p>
                            <p className="text-xs text-muted-foreground">최근 활동</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      아직 활동이 없습니다. 콘텐츠를 업로드해보세요!
                    </p>
                  )}
                  
                  <Button variant="outline" className="w-full" size="sm">
                    모든 활동 보기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
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

export default Dashboard;
