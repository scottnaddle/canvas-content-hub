
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ContentWithDetails } from "@/types/content";

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
