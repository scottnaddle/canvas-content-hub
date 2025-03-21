
import { useState } from "react";
import { Upload, X, File, FileText, Video, Music, FileSpreadsheet } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { formatFileSize } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContentUploaderProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContentUploader = ({ isOpen, onClose }: ContentUploaderProps) => {
  const { currentLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<"upload" | "details">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [contentDetails, setContentDetails] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
  });
  
  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const supportedFormats = [
    "video/mp4", "video/webm", 
    "audio/mp3", "audio/mpeg", "audio/wav", 
    "application/pdf", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];
  
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
  
  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      // Check file size
      if (file.size > maxFileSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum file size of ${formatFileSize(maxFileSize, currentLanguage as any)}`,
          variant: "destructive",
        });
        return false;
      }
      
      // Check file type
      if (!supportedFormats.includes(file.type)) {
        toast({
          title: "Unsupported file format",
          description: `${file.name} is not a supported file type`,
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
        title: "No files selected",
        description: "Please upload at least one file to continue",
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
  
  const handleUpload = () => {
    if (!contentDetails.title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your content",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: t("content.upload.success"),
        description: `"${contentDetails.title}" has been uploaded successfully.`,
      });
      
      // Reset and close
      setFiles([]);
      setStep("upload");
      onClose();
    }, 2000);
  };
  
  const handleBack = () => {
    setStep("upload");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setFiles([]);
        setStep("upload");
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("content.upload.title")}</DialogTitle>
          <DialogDescription>
            Upload and manage your learning content
          </DialogDescription>
        </DialogHeader>
        
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
                Browse Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
                accept=".mp4,.webm,.mp3,.wav,.pdf,.docx,.pptx,.xlsx,.scorm"
              />
            </div>
            
            {/* File List */}
            {files.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/40 px-4 py-2 font-medium text-sm">
                  Selected Files ({files.length})
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
                Continue
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
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tutorials">Tutorials</SelectItem>
                      <SelectItem value="lectures">Lectures</SelectItem>
                      <SelectItem value="assessments">Assessments</SelectItem>
                      <SelectItem value="resources">Resources</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">{t("content.tags")}</Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags separated by commas"
                    value={contentDetails.tags}
                    onChange={(e) => setContentDetails({ ...contentDetails, tags: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-muted/20">
              <h4 className="font-medium mb-2">File Information</h4>
              <div className="flex items-start gap-3">
                {getFileTypeIcon(files[selectedFileIndex])}
                <div>
                  <p className="font-medium text-sm">{files[selectedFileIndex].name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(files[selectedFileIndex].size, currentLanguage as any)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? t("content.upload.uploading") : t("common.upload")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContentUploader;
