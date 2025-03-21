
import { Database } from "@/integrations/supabase/types";

export type ContentType = Database["public"]["Enums"]["content_type"];
export type UserRole = Database["public"]["Enums"]["user_role"];

export type ContentItem = Database["public"]["Tables"]["content_items"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type NewContentItem = Database["public"]["Tables"]["content_items"]["Insert"];

export interface ContentWithDetails extends ContentItem {
  category?: Category | null;
  author?: Profile | null;
}
