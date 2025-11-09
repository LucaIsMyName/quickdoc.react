import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import { parseMarkdown } from '../utils/markdown';
import { scrollToHeading } from '../utils/scrollHash';
import type { AppConfig } from '../config/app.config';

interface MarkdownContentProps {
  content: string;
  config: AppConfig;
  onNavigationExtracted?: (headings: HTMLHeadingElement[]) => void;
}

export const MarkdownContent = ({ content, config, onNavigationExtracted }: MarkdownContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Apply syntax highlighting
    if (config.content.syntaxHighlighting) {
      contentRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }

    // Add copy buttons to code blocks
    if (config.content.copyCodeButton) {
      contentRef.current.querySelectorAll('pre').forEach((pre) => {
        if (pre.querySelector('.copy-button')) return; // Already has button

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'copy-button-container';
        
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
        
        button.onclick = () => {
          const code = pre.querySelector('code');
          if (code) {
            navigator.clipboard.writeText(code.textContent ?? '');
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
            button.classList.add('copied');
            setTimeout(() => {
              button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1 0 2 .9 2 2h10c1.1 0 2 .9 2 2"/></svg>`;
              button.classList.remove('copied');
            }, 2000);
          }
        };
        
        buttonContainer.appendChild(button);
        pre.appendChild(buttonContainer);
      });
    }

    // Extract headings for navigation
    if (onNavigationExtracted) {
      const headings = Array.from(
        contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
      ) as HTMLHeadingElement[];
      onNavigationExtracted(headings);
    }

    // Add IDs to headings for anchor links (excluding those inside code blocks)
    contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      // Skip headings that are inside code blocks
      if (heading.closest('pre, code')) return;
      
      const text = heading.textContent ?? '';
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      heading.id = id;
      
      // Add scroll margin top to account for sticky header using CSS variable
      const htmlHeading = heading as HTMLElement;
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--meta-nav-height')) || 40;
      htmlHeading.style.scrollMarginTop = `${headerHeight}px`;
      
      // Make all headings clickable to update URL
      htmlHeading.style.cursor = 'pointer';
      htmlHeading.onclick = () => {
        scrollToHeading(id);
      };
    });
  }, [content, config, onNavigationExtracted]);

  const html = parseMarkdown(content);

  return (
    <div
      ref={contentRef}
      className="markdown-content prose prose-gray dark:prose-invert max-w-none"
      style={{ 
        maxWidth: config.content.maxWidth,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
