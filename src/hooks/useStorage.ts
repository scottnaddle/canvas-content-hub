
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ContentType } from "@/types/content";

interface UploadOptions {
  onProgress?: (progress: number) => void;
  contentType?: ContentType;
}

interface UploadResult {
  path: string;
  url: string;
  size?: number;
}

export const useStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file: File, options?: UploadOptions): Promise<UploadResult | null> => {
    if (!file) return null;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Determine bucket based on file type
      const bucket = "content";
      
      // Create a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${options?.contentType || 'other'}/${fileName}`;
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Changed to true to allow overwriting existing files
        });
      
      if (error) {
        console.error("Upload error:", error.message);
        throw error;
      }
      
      // Update progress
      if (options?.onProgress) {
        options.onProgress(100);
      }
      setUploadProgress(100);
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return {
        path: data.path,
        url: publicUrl,
        size: file.size
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadProgress(0);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const uploadThumbnail = async (file: File): Promise<UploadResult | null> => {
    if (!file) return null;
    
    setIsUploading(true);
    
    try {
      const bucket = "thumbnails";
      
      // Create a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = fileName;
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Changed to true to allow overwriting existing files
        });
      
      if (error) {
        console.error("Thumbnail upload error:", error.message);
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return {
        path: data.path,
        url: publicUrl
      };
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadFile,
    uploadThumbnail,
    isUploading,
    uploadProgress
  };
};
