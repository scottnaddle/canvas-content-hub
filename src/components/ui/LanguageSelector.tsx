
import { useState } from "react";
import { CheckIcon, GlobeIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageCodeType } from "@/types";

const LanguageSelector = () => {
  const [open, setOpen] = useState(false);
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  const languages: { code: LanguageCodeType; name: string }[] = [
    { code: "en", name: "English" },
    { code: "ko", name: "한국어" },
    { code: "ru", name: "Русский" },
    { code: "uz", name: "O'zbek" },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 h-9 px-2"
        >
          <GlobeIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {languages.find(lang => lang.code === currentLanguage)?.name}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <div className="space-y-0.5">
          {languages.map((language) => (
            <button
              key={language.code}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md",
                language.code === currentLanguage
                  ? "bg-primary/5 text-primary font-medium"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary"
              )}
              onClick={() => {
                changeLanguage(language.code);
                setOpen(false);
              }}
            >
              <span>{language.name}</span>
              {language.code === currentLanguage && (
                <CheckIcon className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
