
import React, { createContext, useContext, useState, useEffect } from "react";
import { LanguageCodeType } from "@/types";
import enTranslations from "@/locales/en.json";
import koTranslations from "@/locales/ko.json";

interface TranslationsType {
  [key: string]: any;
}

interface LanguageContextType {
  currentLanguage: LanguageCodeType;
  changeLanguage: (lang: LanguageCodeType) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const translations: Record<LanguageCodeType, TranslationsType> = {
  en: enTranslations,
  ko: koTranslations,
  ru: {}, // Placeholder for Russian
  uz: {}, // Placeholder for Uzbek
};

const defaultLanguage: LanguageCodeType = "en";

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: defaultLanguage,
  changeLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCodeType>(() => {
    // Get saved language from localStorage or use browser preferred language
    const savedLanguage = localStorage.getItem("language") as LanguageCodeType | null;
    
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split("-")[0];
    if (browserLang && ["en", "ko", "ru", "uz"].includes(browserLang)) {
      return browserLang as LanguageCodeType;
    }
    
    return defaultLanguage;
  });

  useEffect(() => {
    localStorage.setItem("language", currentLanguage);
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const changeLanguage = (lang: LanguageCodeType) => {
    setCurrentLanguage(lang);
  };

  // Translation function
  const t = (key: string, variables?: Record<string, string>): string => {
    // Split the key by dots to access nested properties
    const keys = key.split(".");
    
    // Start with the translation object for the current language
    let value: any = translations[currentLanguage];
    
    // If translation doesn't exist in the current language, fallback to English
    if (!value) {
      value = translations[defaultLanguage];
    }
    
    // Navigate through the nested objects
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // If the key doesn't exist, return the key itself
        return key;
      }
    }
    
    // If the value is not a string at this point, return the key
    if (typeof value !== "string") {
      return key;
    }
    
    // Replace variables in the string if provided
    if (variables) {
      return Object.entries(variables).reduce((acc, [varKey, varValue]) => {
        return acc.replace(new RegExp(`{${varKey}}`, "g"), varValue);
      }, value);
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
