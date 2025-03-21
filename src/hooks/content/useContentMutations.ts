
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { NewContentItem } from "@/types/content";

export const useAddContentItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentItem: NewContentItem) => {
      const { data, error } = await supabase
        .from("content_items")
        .insert(contentItem)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error adding content",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentItems"] });
      queryClient.invalidateQueries({ queryKey: ["recentContent"] });
      toast({
        title: "Content added successfully",
        description: "Your content has been uploaded and is now available.",
      });
    },
  });
};

export const useIncrementViews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.rpc('increment_content_views', { 
        content_id: id 
      });
      
      if (error) {
        console.error("Error incrementing views:", error);
        // Don't show toast for this - it's a background operation
        throw error;
      }
      
      return data;
    },
    onSuccess: (_data, id) => {
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: ["contentItem", id] });
    },
  });
};

export const useIncrementDownloads = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.rpc('increment_content_downloads', { 
        content_id: id 
      });
      
      if (error) {
        console.error("Error incrementing downloads:", error);
        // Don't show toast for this - it's a background operation
        throw error;
      }
      
      return data;
    },
    onSuccess: (_data, id) => {
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: ["contentItem", id] });
    },
  });
};
