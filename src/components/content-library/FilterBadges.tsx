
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentType } from "@/types/content";

interface FilterBadgesProps {
  selectedTypes: ContentType[];
  selectedCategories: string[];
  dateFilter: string;
  searchQuery: string;
  categories: any[] | undefined;
  handleTypeCheckboxChange: (type: ContentType) => void;
  handleCategoryCheckboxChange: (categoryId: string) => void;
  setDateFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

const FilterBadges = ({
  selectedTypes,
  selectedCategories,
  dateFilter,
  searchQuery,
  categories,
  handleTypeCheckboxChange,
  handleCategoryCheckboxChange,
  setDateFilter,
  setSearchQuery,
  clearFilters,
}: FilterBadgesProps) => {
  if (
    selectedTypes.length === 0 &&
    selectedCategories.length === 0 &&
    dateFilter === "any" &&
    !searchQuery
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {selectedTypes.map(type => (
        <Badge key={type} variant="outline" className="bg-background flex items-center gap-1">
          {type}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 ml-1 p-0"
            onClick={() => handleTypeCheckboxChange(type)}
          >
            ×
          </Button>
        </Badge>
      ))}
      
      {selectedCategories.map(categoryId => {
        const category = categories?.find(c => c.id === categoryId);
        return category ? (
          <Badge key={categoryId} variant="outline" className="bg-background flex items-center gap-1">
            {category.name}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1 p-0"
              onClick={() => handleCategoryCheckboxChange(categoryId)}
            >
              ×
            </Button>
          </Badge>
        ) : null;
      })}
      
      {dateFilter !== "any" && (
        <Badge variant="outline" className="bg-background flex items-center gap-1">
          {dateFilter === "week" ? "지난 주" : 
           dateFilter === "month" ? "지난 달" : 
           dateFilter === "year" ? "지난 해" : dateFilter}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 ml-1 p-0"
            onClick={() => setDateFilter("any")}
          >
            ×
          </Button>
        </Badge>
      )}
      
      {searchQuery && (
        <Badge variant="outline" className="bg-background flex items-center gap-1">
          검색: {searchQuery}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 ml-1 p-0"
            onClick={() => setSearchQuery("")}
          >
            ×
          </Button>
        </Badge>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs h-7"
        onClick={clearFilters}
      >
        모든 필터 지우기
      </Button>
    </div>
  );
};

export default FilterBadges;
