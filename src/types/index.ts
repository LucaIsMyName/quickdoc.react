export interface MarkdownFile {
  slug: string;
  title: string;
  content: string;
  path: string;
}

export interface ContentSection {
  slug: string;
  title: string;
  content: string;
  level: number;
  subsections: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  title: string;
  level: number;
  slug: string;
  subsections?: NavigationItem[];
}

export interface AppState {
  currentFile: string | null;
  currentSection: string | null;
}
