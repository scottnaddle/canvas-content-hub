
import { Card, CardContent } from "@/components/ui/card";
import ContentCard from "@/components/content/ContentCard";
import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ContentWithDetails } from "@/types/content";

interface ContentGridProps {
  isLoading: boolean;
  filteredContent: ContentWithDetails[];
  viewMode: "grid" | "list";
  clearFilters: () => void;
}

const ContentGrid = ({
  isLoading,
  filteredContent,
  viewMode,
  clearFilters,
}: ContentGridProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    if (viewMode === "grid") {
      return (
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
      );
    } else {
      return (
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
      );
    }
  }

  if (filteredContent.length === 0) {
    return (
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
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>
    );
  }

  return <ContentListView filteredContent={filteredContent} />;
};

export default ContentGrid;

// Separate component for list view
const ContentListView = ({ filteredContent }: { filteredContent: ContentWithDetails[] }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      {filteredContent.map((content) => (
        <ContentListItem key={content.id} content={content} t={t} />
      ))}
    </div>
  );
};

// List item component
const ContentListItem = ({ content, t }: { content: ContentWithDetails, t: any }) => {
  return (
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
  );
};

// Helper imports and functions
import { Badge } from "@/components/ui/badge";
import { Play, Download, FileText, Video, Music, File as FileIcon, FileSpreadsheet } from "lucide-react";

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
      return <FileIcon className="h-4 w-4" />;
  }
};
