
import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { ContentType } from "@/types/content";

interface FilterSheetProps {
  selectedTypes: ContentType[];
  setSelectedTypes: (types: ContentType[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  categories: any[] | undefined;
  isCategoriesLoading: boolean;
  clearFilters: () => void;
}

const FilterSheet = ({
  selectedTypes,
  setSelectedTypes,
  selectedCategories,
  setSelectedCategories,
  dateFilter,
  setDateFilter,
  categories,
  isCategoriesLoading,
  clearFilters,
}: FilterSheetProps) => {
  const { t } = useLanguage();

  const handleTypeCheckboxChange = (type: ContentType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  const handleCategoryCheckboxChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          <span>{t("library.filter.title")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("library.filter.title")}</SheetTitle>
          <SheetDescription>
            유형, 카테고리 등으로 콘텐츠 필터링
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{t("library.filter.contentType")}</h4>
            <div className="grid grid-cols-2 gap-2">
              {["video", "audio", "document", "presentation", "spreadsheet", "scorm", "other"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type}`} 
                    checked={selectedTypes.includes(type as ContentType)}
                    onCheckedChange={() => handleTypeCheckboxChange(type as ContentType)}
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm font-normal capitalize">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{t("library.filter.category")}</h4>
            <div className="space-y-2">
              {isCategoriesLoading ? (
                <p className="text-sm text-muted-foreground">로딩 중...</p>
              ) : categories && categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`} 
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryCheckboxChange(category.id)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="text-sm font-normal">
                      {category.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">카테고리 없음</p>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{t("library.filter.date")}</h4>
            <RadioGroup value={dateFilter} onValueChange={setDateFilter}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="date-any" />
                <Label htmlFor="date-any" className="text-sm font-normal">모든 기간</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="date-week" />
                <Label htmlFor="date-week" className="text-sm font-normal">지난 주</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="date-month" />
                <Label htmlFor="date-month" className="text-sm font-normal">지난 달</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="year" id="date-year" />
                <Label htmlFor="date-year" className="text-sm font-normal">지난 해</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={clearFilters}>
              {t("library.filter.clearAll")}
            </Button>
            <Button onClick={() => document.body.click()}>
              {t("library.filter.apply")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
