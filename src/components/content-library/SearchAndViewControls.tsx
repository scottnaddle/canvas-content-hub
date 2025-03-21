
import { Search, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import FilterSheet from "./FilterSheet";

interface SearchAndViewControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  selectedTypes: any[];
  setSelectedTypes: (types: any[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  categories: any[] | undefined;
  isCategoriesLoading: boolean;
  clearFilters: () => void;
}

const SearchAndViewControls = ({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  selectedTypes,
  setSelectedTypes,
  selectedCategories,
  setSelectedCategories,
  dateFilter,
  setDateFilter,
  categories,
  isCategoriesLoading,
  clearFilters,
}: SearchAndViewControlsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("library.searchPlaceholder")}
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <FilterSheet
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          categories={categories}
          isCategoriesLoading={isCategoriesLoading}
          clearFilters={clearFilters}
        />
        
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("library.sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("library.sortOptions.newest")}</SelectItem>
            <SelectItem value="oldest">{t("library.sortOptions.oldest")}</SelectItem>
            <SelectItem value="titleAZ">{t("library.sortOptions.titleAZ")}</SelectItem>
            <SelectItem value="titleZA">{t("library.sortOptions.titleZA")}</SelectItem>
            <SelectItem value="mostViewed">{t("library.sortOptions.mostViewed")}</SelectItem>
            <SelectItem value="mostDownloaded">{t("library.sortOptions.mostDownloaded")}</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex border rounded-md overflow-hidden">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            className="rounded-none"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            className="rounded-none"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndViewControls;
