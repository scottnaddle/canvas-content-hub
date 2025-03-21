
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ContentType } from "@/types/content";

interface UploadOptions {
  onProgress?: (progress: number) => void;
  contentType?: ContentType;
}

export const useStorage = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, options?: UploadOptions) => {
    if (!file) return null;
    
    setIsUploading(true);
    
    try {
      // Determine bucket based on file type
      let bucket = "content";
      
      // Create a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${options?.contentType || 'other'}/${fileName}`;
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) {
        throw error;
      }
      
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
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const uploadThumbnail = async (file: File) => {
    if (!file) return null;
    
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
          upsert: false,
        });
      
      if (error) {
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
    }
  };
  
  return {
    uploadFile,
    uploadThumbnail,
    isUploading
  };
};
