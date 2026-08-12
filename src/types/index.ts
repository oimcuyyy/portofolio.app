export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tech_stack: string[];
  demo_url?: string;
  github_url?: string;
  created_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon_name?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}