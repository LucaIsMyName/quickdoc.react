import { MDXProvider as BaseMDXProvider } from '@mdx-js/react';
import type { ReactNode } from 'react';

interface MDXProviderProps {
  children: ReactNode;
}

/**
 * Custom MDX components to ensure consistent styling between MD and MDX
 * These components match the Tailwind prose classes used in MarkdownContent
 */
const components = {
  // Headings
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="scroll-mt-[var(--meta-nav-height)] cursor-pointer" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="scroll-mt-[var(--meta-nav-height)] cursor-pointer" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="scroll-mt-[var(--meta-nav-height)] cursor-pointer" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="scroll-mt-[var(--meta-nav-height)] cursor-pointer" {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="scroll-mt-[var(--meta-nav-height)] cursor-pointer" {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className="scroll-mt-[var(--meta-nav-height)] cursor-pointer" {...props} />
  ),
  
  // Code blocks
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="relative" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code {...props} />
  ),
  
  // Links
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="theme-accent underline" {...props} />
  ),
  
  // Lists
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li {...props} />
  ),
  
  // Blockquotes
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote {...props} />
  ),
  
  // Tables
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <table {...props} />
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead {...props} />
  ),
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} />
  ),
  
  // Horizontal rule
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr {...props} />
  ),
  
  // Paragraphs
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} />
  ),
  
  // Images
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
};

/**
 * MDX Provider component that wraps MDX content with custom components
 * Ensures consistent styling between regular Markdown and MDX files
 */
export const MDXProvider = ({ children }: MDXProviderProps) => {
  return (
    <BaseMDXProvider components={components}>
      {children}
    </BaseMDXProvider>
  );
};
