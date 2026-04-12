export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techs: string[];
  features: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: Date | string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string | null;
  githubUrl: string | null;
  techs: string[];
  features: string[];
  featured: boolean;
  published: boolean;
  order: number;
}

