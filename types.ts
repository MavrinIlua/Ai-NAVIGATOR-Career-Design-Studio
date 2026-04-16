
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export interface GeneratedMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  prompt: string;
  aspectRatio: AspectRatio;
  timestamp: number;
}

export enum AppMode {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  EDIT = 'EDIT',
  CAREER = 'CAREER',
  GALLERY = 'GALLERY'
}

export interface AICareer {
  id: string;
  title: string;
  category: string;
  description: string;
}
