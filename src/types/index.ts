
export type LanguageCodeType = "en" | "ko" | "ru" | "uz";

export type UserRole = "admin" | "instructor" | "student";

export type ContentType = 
  | "video" 
  | "audio" 
  | "document" 
  | "presentation" 
  | "spreadsheet" 
  | "scorm" 
  | "other";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  duration?: number;
  category?: string;
  tags?: string[];
  author: string;
  uploadDate: Date;
  lastModified: Date;
  views: number;
  downloads: number;
  completionRate?: number;
  averageRating?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
}

export interface LTIConfig {
  ltiVersion: "1.1" | "1.3";
  clientId?: string;
  keySet?: string;
  redirectUrl?: string;
  platformIssuer?: string;
  deploymentId?: string;
}

export interface SSOConfig {
  provider: "openid" | "saml";
  clientId?: string;
  clientSecret?: string;
  domain?: string;
  callbackUrl?: string;
}
