
import { useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContentViewerProps {
  content: {
    id: string;
    title: string;
    description?: string;
    type: "video" | "audio" | "document" | "presentation" | "spreadsheet" | "scorm" | "other";
    thumbnailUrl?: string;
    fileUrl?: string;
    fileSize?: number;
    duration?: number;
    category?: string;
    tags?: string[];
    author?: string;
    uploadDate: Date;
    lastModified?: Date;
    views?: number;
    downloads?: number;
  };
}

const ContentViewer = ({ content }: ContentViewerProps) => {
  const { currentLanguage, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  
  // In a real app, we would use the actual file URL
  // For this demo, we'll use a placeholder based on content type
  const getPreviewElement = () => {
    const handleLoad = () => {
      setIsLoading(false);
    };
    
    switch (content.type) {
      case 'video':
        return (
          <video 
            className="w-full aspect-video bg-black" 
            controls 
            autoPlay={false}
            onCanPlay={handleLoad}
          >
            <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <div className="p-6 bg-muted/20 rounded-md flex flex-col items-center justify-center">
            <div className="w-full max-w-xl">
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 aspect-[3/1] rounded-lg flex items-center justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
              </div>
              <audio 
                className="w-full" 
                controls 
                onCanPlay={handleLoad}
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        );
      case 'document':
        return (
          <div className="p-6 bg-muted/20 rounded-md min-h-[400px] flex flex-col items-center justify-center">
            <img 
              src={content.thumbnailUrl || "https://images.unsplash.com/photo-1568125779263-5d327f739422?auto=format&fit=crop&q=80&w=500"}
              alt={content.title}
              className="max-h-[300px] object-contain mb-4 rounded"
              onLoad={handleLoad}
            />
            <p className="text-muted-foreground text-sm mb-2">
              This document preview is not available directly in the browser.
            </p>
            <div className="flex gap-2">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                {t("common.download")}
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in new tab
              </Button>
            </div>
          </div>
        );
      case 'presentation':
      case 'spreadsheet':
        return (
          <div className="p-6 bg-muted/20 rounded-md min-h-[400px] flex flex-col items-center justify-center">
            <img 
              src={content.thumbnailUrl || "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?auto=format&fit=crop&q=80&w=500"}
              alt={content.title}
              className="max-h-[300px] object-contain mb-4 rounded"
              onLoad={handleLoad}
            />
            <p className="text-muted-foreground text-sm mb-2">
              This file type requires a special viewer or download to view.
            </p>
            <div className="flex gap-2">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                {t("common.download")}
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-12 bg-muted/20 rounded-md min-h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">
              Preview not available for this content type.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview area */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
            <div className="animate-pulse">Loading preview...</div>
          </div>
        )}
        {getPreviewElement()}
      </div>
      
      {/* Content info */}
      <div className="flex flex-col md:flex-row gap-4 py-2">
        <div className="flex-1">
          <h3 className="text-lg font-medium">{content.title}</h3>
          {content.description && (
            <p className="text-muted-foreground mt-1">
              {content.description}
            </p>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-4">
            {content.author && (
              <div>
                <p className="text-xs text-muted-foreground">{t("content.author")}</p>
                <p className="text-sm">{content.author}</p>
              </div>
            )}
            
            <div>
              <p className="text-xs text-muted-foreground">{t("content.uploadDate")}</p>
              <p className="text-sm">{new Date(content.uploadDate).toLocaleDateString()}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">{t("content.type")}</p>
              <p className="text-sm capitalize">{content.type}</p>
            </div>
            
            {content.fileSize !== undefined && (
              <div>
                <p className="text-xs text-muted-foreground">{t("content.fileSize")}</p>
                <p className="text-sm">{formatFileSize(content.fileSize, currentLanguage as any)}</p>
              </div>
            )}
            
            {content.duration !== undefined && (
              <div>
                <p className="text-xs text-muted-foreground">{t("content.duration")}</p>
                <p className="text-sm">
                  {Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}
                </p>
              </div>
            )}
            
            {content.views !== undefined && (
              <div>
                <p className="text-xs text-muted-foreground">{t("content.views")}</p>
                <p className="text-sm">{content.views}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 min-w-[120px]">
          <Button>
            <Download className="h-4 w-4 mr-2" />
            {t("content.actions.download")}
          </Button>
          <Button variant="outline">
            {t("content.actions.share")}
          </Button>
        </div>
      </div>
      
      {content.tags && content.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2 border-t">
          {content.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentViewer;
