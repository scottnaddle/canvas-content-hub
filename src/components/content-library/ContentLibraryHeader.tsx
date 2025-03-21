
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContentLibraryHeaderProps {
  isAdmin: boolean;
  isInstructor: boolean;
  setIsUploaderOpen: (isOpen: boolean) => void;
}

const ContentLibraryHeader = ({
  isAdmin,
  isInstructor,
  setIsUploaderOpen,
}: ContentLibraryHeaderProps) => {
  const { t } = useLanguage();

  return (
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
  );
};

export default ContentLibraryHeader;
