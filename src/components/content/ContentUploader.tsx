
import { useState } from "react";
import { Upload, X, File, FileText, Video, Music, FileSpreadsheet, Image } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { formatFileSize } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useStorage } from "@/hooks/useStorage";
import { useAddContentItem, useCategories } from "@/hooks/content";
import { ContentType } from "@/types/content";
import { v4 as uuidv4 } from "uuid";

interface ContentUploaderProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContentUploader = ({ isOpen, onClose }: ContentUploaderProps) => {
  const { currentLanguage, t } = useLanguage();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { uploadFile, uploadThumbnail, isUploading: isFileUploading } = useStorage();
  const { mutateAsync: addContentItem, isPending: isAddingContent } = useAddContentItem();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  
  const [step, setStep] = useState<"upload" | "details">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [contentDetails, setContentDetails] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
  });
  
  const isUploading = isFileUploading || isAddingContent;
  
  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const supportedFormats = [
    "video/mp4", "video/webm", 
    "audio/mp3", "audio/mpeg", "audio/wav", 
    "application/pdf", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];
  
  const getContentTypeFromMimeType = (mimeType: string): ContentType => {
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType === "application/pdf") return "document";
    if (mimeType.includes("spreadsheet")) return "spreadsheet";
    if (mimeType.includes("presentation")) return "presentation";
    if (mimeType.includes("document")) return "document";
    return "other";
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };
  
  const handleThumbnailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setThumbnailFile(file);
        const objectUrl = URL.createObjectURL(file);
        setThumbnailPreview(objectUrl);
      } else {
        toast({
          title: "잘못된 파일 형식",
          description: "썸네일은 이미지 파일이어야 합니다.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      // Check file size
      if (file.size > maxFileSize) {
        toast({
          title: "파일이 너무 큽니다",
          description: `${file.name}은(는) 최대 파일 크기인 ${formatFileSize(maxFileSize, currentLanguage as any)}를 초과합니다`,
          variant: "destructive",
        });
        return false;
      }
      
      // Check file type
      if (!supportedFormats.includes(file.type)) {
        toast({
          title: "지원되지 않는 파일 형식",
          description: `${file.name}은(는) 지원되지 않는 파일 형식입니다`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    if (selectedFileIndex >= newFiles.length) {
      setSelectedFileIndex(Math.max(0, newFiles.length - 1));
    }
  };
  
  const removeThumbnail = () => {
    setThumbnailFile(null);
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(null);
    }
  };
  
  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith("video/")) {
      return <Video className="h-5 w-5" />;
    } else if (file.type.startsWith("audio/")) {
      return <Music className="h-5 w-5" />;
    } else if (file.type === "application/pdf") {
      return <FileText className="h-5 w-5" />;
    } else if (file.type.includes("spreadsheet") || file.type.includes("presentation")) {
      return <FileSpreadsheet className="h-5 w-5" />;
    } else {
      return <File className="h-5 w-5" />;
    }
  };
  
  const handleContinue = () => {
    if (files.length === 0) {
      toast({
        title: "파일이 선택되지 않았습니다",
        description: "계속하려면 최소 하나의 파일을 업로드하세요",
        variant: "destructive",
      });
      return;
    }
    
    setStep("details");
    
    // Pre-fill title with filename (without extension)
    const fileName = files[selectedFileIndex].name;
    const titleFromFileName = fileName.substring(0, fileName.lastIndexOf("."));
    setContentDetails(prev => ({
      ...prev,
      title: titleFromFileName,
    }));
  };
  
  const handleUpload = async () => {
    if (!user || !profile) {
      toast({
        title: "인증 오류",
        description: "콘텐츠를 업로드하려면 로그인해야 합니다.",
        variant: "destructive",
      });
      return;
    }
    
    if (!contentDetails.title) {
      toast({
        title: "제목이 필요합니다",
        description: "콘텐츠 제목을 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setUploadProgress(10);
      
      // 1. Upload the main file
      const file = files[selectedFileIndex];
      const contentType = getContentTypeFromMimeType(file.type);
      
      setUploadProgress(20);
      
      const uploadedFile = await uploadFile(file, {
        contentType,
        onProgress: (progress) => {
          setUploadProgress(20 + Math.floor(progress * 0.6)); // 20% to 80%
        }
      });
      
      if (!uploadedFile) {
        throw new Error("파일 업로드에 실패했습니다");
      }
      
      setUploadProgress(80);
      
      // 2. Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const uploadedThumbnail = await uploadThumbnail(thumbnailFile);
        thumbnailUrl = uploadedThumbnail?.url || null;
      }
      
      setUploadProgress(90);
      
      // 3. Create content item in database
      const tagsArray = contentDetails.tags
        ? contentDetails.tags.split(',').map(tag => tag.trim())
        : [];
        
      await addContentItem({
        id: uuidv4(),
        title: contentDetails.title,
        description: contentDetails.description || null,
        type: contentType,
        file_url: uploadedFile.url,
        thumbnail_url: thumbnailUrl,
        file_size: uploadedFile.size,
        category_id: contentDetails.category || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        author_id: profile.id,
      });
      
      setUploadProgress(100);
      
      toast({
        title: t("content.upload.success"),
        description: `"${contentDetails.title}" 업로드가 성공적으로 완료되었습니다.`,
      });
      
      // Reset and close
      setFiles([]);
      setThumbnailFile(null);
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
        setThumbnailPreview(null);
      }
      setStep("upload");
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "업로드 오류",
        description: error instanceof Error ? error.message : "업로드 중 오류가 발생했습니다",
        variant: "destructive",
      });
      setUploadProgress(0);
    }
  };
  
  const handleBack = () => {
    setStep("upload");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setFiles([]);
        setThumbnailFile(null);
        if (thumbnailPreview) {
          URL.revokeObjectURL(thumbnailPreview);
          setThumbnailPreview(null);
        }
        setStep("upload");
        setUploadProgress(0);
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("content.upload.title")}</DialogTitle>
          <DialogDescription>
            학습 콘텐츠를 업로드하고 관리하세요
          </DialogDescription>
        </DialogHeader>
        
        {uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>업로드 중...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {step === "upload" ? (
          <div className="space-y-4">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("content.upload.dragDrop")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("content.upload.maxFileSize", { size: "100MB" })}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {t("content.upload.supportedFormats", { formats: "MP4, MP3, PDF, DOCX, PPTX, XLSX" })}
              </p>
              <Button 
                variant="outline" 
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                파일 찾아보기
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
                accept=".mp4,.webm,.mp3,.wav,.pdf,.docx,.pptx,.xlsx"
              />
            </div>
            
            {/* File List */}
            {files.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/40 px-4 py-2 font-medium text-sm">
                  선택된 파일 ({files.length})
                </div>
                <div className="divide-y">
                  {files.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`}
                      className={`px-4 py-3 flex items-center justify-between ${
                        index === selectedFileIndex ? "bg-muted/20" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {getFileTypeIcon(file)}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size, currentLanguage as any)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleContinue}>
                계속
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Content Details Form */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("content.title")} *</Label>
                <Input
                  id="title"
                  value={contentDetails.title}
                  onChange={(e) => setContentDetails({ ...contentDetails, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{t("content.description")}</Label>
                <Textarea
                  id="description"
                  value={contentDetails.description}
                  onChange={(e) => setContentDetails({ ...contentDetails, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">{t("content.category")}</Label>
                  <Select
                    value={contentDetails.category}
                    onValueChange={(value) => setContentDetails({ ...contentDetails, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {isCategoriesLoading ? (
                        <SelectItem value="loading" disabled>로딩 중...</SelectItem>
                      ) : categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>카테고리 없음</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">{t("content.tags")}</Label>
                  <Input
                    id="tags"
                    placeholder="쉼표로 구분된 태그 입력"
                    value={contentDetails.tags}
                    onChange={(e) => setContentDetails({ ...contentDetails, tags: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail">썸네일 이미지 (선택 사항)</Label>
                <div className="flex items-start gap-4">
                  <div 
                    className="w-32 h-24 border rounded-md flex items-center justify-center overflow-hidden bg-muted/30 relative"
                  >
                    {thumbnailPreview ? (
                      <>
                        <img 
                          src={thumbnailPreview} 
                          alt="썸네일 미리보기" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 bg-background/80 rounded-full"
                          onClick={removeThumbnail}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <Image className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Button 
                      variant="outline" 
                      className="mb-2"
                      onClick={() => document.getElementById("thumbnail-upload")?.click()}
                    >
                      썸네일 업로드
                    </Button>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      className="hidden"
                      onChange={handleThumbnailInput}
                      accept="image/*"
                    />
                    <p className="text-xs text-muted-foreground">
                      썸네일 이미지는 콘텐츠를 더 잘 식별하는 데 도움이 됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-muted/20">
              <h4 className="font-medium mb-2">파일 정보</h4>
              <div className="flex items-start gap-3">
                {files.length > 0 && getFileTypeIcon(files[selectedFileIndex])}
                <div>
                  {files.length > 0 && (
                    <>
                      <p className="font-medium text-sm">{files[selectedFileIndex].name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(files[selectedFileIndex].size, currentLanguage as any)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={isUploading}>
                뒤로
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "업로드 중..." : "업로드"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContentUploader;
