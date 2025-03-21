
import { LanguageCodeType } from "@/types";

/**
 * Format date according to the current language
 */
export const formatDate = (date: Date, language: LanguageCodeType): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Intl.DateTimeFormat(language, options).format(date);
};

/**
 * Format number according to the current language
 */
export const formatNumber = (num: number, language: LanguageCodeType): string => {
  return new Intl.NumberFormat(language).format(num);
};

/**
 * Format file size in a human-readable way
 */
export const formatFileSize = (bytes: number, language: LanguageCodeType): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get direction (rtl or ltr) for a language
 */
export const getLanguageDirection = (language: LanguageCodeType): "ltr" | "rtl" => {
  // Add RTL languages here if needed in the future
  const rtlLanguages: LanguageCodeType[] = [];
  
  return rtlLanguages.includes(language) ? "rtl" : "ltr";
};
