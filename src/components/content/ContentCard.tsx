
import { useState } from "react";
import { FileText, Video, Music, File, Play, Download, Clock, Eye, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContentViewer from "./ContentViewer";
import { formatFileSize } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { ContentWithDetails } from "@/types/content";

interface ContentCardProps {
  content: ContentWithDetails;
}

const ContentCard = ({ content }: ContentCardProps) => {
  const { currentLanguage, t } = useLanguage();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Get icon based on content type
  const getTypeIcon = () => {
    switch (content.type) {
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
  
  const handlePreview = () => {
    setIsPreviewOpen(true);
  };
  
  const handleDownload = () => {
    // In a real app, this would trigger a download of the file
    console.log("Downloading:", content.title);
  };

  return (
    <>
      <Card className="hover-elevate overflow-hidden">
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden">
          {content.thumbnail_url ? (
            <img 
              src={content.thumbnail_url} 
              alt={content.title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              {getTypeIcon()}
            </div>
          )}
          
          {/* Badges and stats overlay */}
          <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
            <Badge variant="secondary" className="capitalize">
              {content.type}
            </Badge>
            
            {content.duration && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(content.duration)}
              </Badge>
            )}
          </div>
          
          {/* Play button overlay */}
          {(content.type === 'video' || content.type === 'audio') && (
            <div 
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/30"
              onClick={handlePreview}
            >
              <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-colors">
                <Play className="h-6 w-6" />
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-base line-clamp-1" title={content.title}>
            {content.title}
          </h3>
          
          {content.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {content.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>{new Date(content.upload_date).toLocaleDateString()}</span>
            
            {content.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {content.views}
              </span>
            )}
            
            {content.file_size !== undefined && (
              <span>
                {formatFileSize(content.file_size, currentLanguage as any)}
              </span>
            )}
          </div>
          
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {content.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {content.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{content.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button 
            size="sm" 
            variant="default" 
            className="flex-1 mr-2"
            onClick={handlePreview}
          >
            {t("content.actions.view")}
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="flex-none"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
            <DialogDescription>
              {content.description}
            </DialogDescription>
          </DialogHeader>
          
          <ContentViewer content={{
            id: content.id,
            title: content.title,
            description: content.description,
            type: content.type,
            thumbnailUrl: content.thumbnail_url,
            fileUrl: content.file_url,
            fileSize: content.file_size,
            duration: content.duration,
            uploadDate: new Date(content.upload_date),
            views: content.views,
            downloads: content.downloads,
            tags: content.tags,
          }} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentCard;
