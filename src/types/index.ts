export interface MarkdownFile {
  slug: string;
  title: string;
  content: string;
  path: string;
}

export interface NavigationItem {
  id: string;
  title: string;
  level: number;
  slug: string;
}

export interface AppState {
  currentFile: string | null;
  currentSection: string | null;
}
