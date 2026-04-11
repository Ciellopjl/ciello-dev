export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techs: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  techs: string[];
  features: string[];
  featured: boolean;
  published: boolean;
  order: number;
}
