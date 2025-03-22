import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { NewContentItem } from "@/types/content";

export const useAddContentItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentItem: NewContentItem) => {
      try {
        const { data, error } = await supabase
          .from("content_items")
          .insert(contentItem)
          .select()
          .single();

        if (error) {
          console.error("Database insert error:", error);
          throw error;
        }

        return data;
      } catch (err) {
        console.error("Add content error:", err);
        toast({
          title: "콘텐츠 추가 중 오류 발생",
          description: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        });
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentItems"] });
      queryClient.invalidateQueries({ queryKey: ["recentContent"] });
      toast({
        title: "콘텐츠 추가 성공",
        description: "콘텐츠가 업로드되어 이제 사용할 수 있습니다.",
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "콘텐츠 추가 오류",
        description: "콘텐츠 추가 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
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
