
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import ContentGrid from "./ContentGrid";
import { ContentWithDetails } from "@/types/content";

interface ContentTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isContentLoading: boolean;
  filteredContent: ContentWithDetails[];
  viewMode: "grid" | "list";
  clearFilters: () => void;
}

const ContentTabs = ({
  activeTab,
  setActiveTab,
  isContentLoading,
  filteredContent,
  viewMode,
  clearFilters,
}: ContentTabsProps) => {
  const { t } = useLanguage();

  return (
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
        <ContentGrid 
          isLoading={isContentLoading} 
          filteredContent={filteredContent} 
          viewMode={viewMode}
          clearFilters={clearFilters}
        />
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
  );
};

export default ContentTabs;
