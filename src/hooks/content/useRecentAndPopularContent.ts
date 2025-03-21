
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ContentWithDetails } from "@/types/content";

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
