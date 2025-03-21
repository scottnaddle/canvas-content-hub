
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ContentItem, ContentWithDetails, NewContentItem } from "@/types/content";

export const useContentItems = () => {
  return useQuery({
    queryKey: ["contentItems"],
    queryFn: async (): Promise<ContentWithDetails[]> => {
      const { data, error } = await supabase
        .from("content_items")
        .select(`
          *,
          category:category_id(*),
          author:author_id(*)
        `)
        .order("upload_date", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching content",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });
};

export const useContentItem = (id: string | undefined) => {
  return useQuery({
    queryKey: ["contentItem", id],
    queryFn: async (): Promise<ContentWithDetails | null> => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("content_items")
        .select(`
          *,
          category:category_id(*),
          author:author_id(*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        if (error.code !== "PGRST116") { // Not found error code
          toast({
            title: "Error fetching content",
            description: error.message,
            variant: "destructive",
          });
        }
        return null;
      }

      return data;
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        toast({
          title: "Error fetching categories",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });
};

export const useRecentContent = (limit = 3) => {
  return useQuery({
    queryKey: ["recentContent", limit],
    queryFn: async (): Promise<ContentWithDetails[]> => {
      const { data, error } = await supabase
        .from("content_items")
        .select(`
          *,
          category:category_id(*),
          author:author_id(*)
        `)
        .order("upload_date", { ascending: false })
        .limit(limit);

      if (error) {
        toast({
          title: "Error fetching recent content",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });
};

export const usePopularContent = (limit = 3) => {
  return useQuery({
    queryKey: ["popularContent", limit],
    queryFn: async (): Promise<ContentWithDetails[]> => {
      const { data, error } = await supabase
        .from("content_items")
        .select(`
          *,
          category:category_id(*),
          author:author_id(*)
        `)
        .order("views", { ascending: false })
        .limit(limit);

      if (error) {
        toast({
          title: "Error fetching popular content",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });
};

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
      // Fix: Using rpc with the correct function name
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
      // Fix: Using rpc with the correct function name
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
