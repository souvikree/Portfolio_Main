// TypeScript interfaces for portfolio data

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Skill {
  name: string;
  icon?: string;
  proficiency?: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  duration: string;
  startDate: string;
  endDate: string;
  description: string[];
  technologies: string[];
  status?: 'current' | 'past' | 'upcoming';
}

export interface Project {
  name: string;
  description: string;
  longDescription: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: 'production' | 'open-source' | 'in-progress' | 'coming-soon';
  icon: string;
  features: string[];
}

export interface Achievement {
  title: string;
  organization: string;
  description: string;
  date: string;
  badge: string;
  url?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  location: string;
  duration: string;
  score: string;
  highlights?: string[];
}

export interface PersonalInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  photoUrl: string;
  availableForWork: boolean;
}

export interface Theme {
  name: string;
  label: string;
  colors: {
    background: string;
    foreground: string;
    accent: string;
    secondary: string;
    highlight: string;
    muted: string;
    border: string;
    card: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface PortfolioData {
  personal: PersonalInfo;
  about: {
    intro: string;
    philosophy: string;
    personal: string;
    stats: {
      label: string;
      value: number;
      suffix?: string;
    }[];
  };
  social: SocialLink[];
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  achievements: Achievement[];
  education: Education[];
  themes: Theme[];
}
