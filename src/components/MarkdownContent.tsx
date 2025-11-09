import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import { parseMarkdown } from '../utils/markdown';
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

        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        button.onclick = () => {
          const code = pre.querySelector('code');
          if (code) {
            navigator.clipboard.writeText(code.textContent ?? '');
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(() => {
              button.textContent = 'Copy';
              button.classList.remove('copied');
            }, 2000);
          }
        };
        pre.appendChild(button);
      });
    }

    // Extract headings for navigation
    if (onNavigationExtracted) {
      const headings = Array.from(
        contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
      ) as HTMLHeadingElement[];
      onNavigationExtracted(headings);
    }

    // Add IDs to headings for anchor links
    contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      const text = heading.textContent ?? '';
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      heading.id = id;
    });
  }, [content, config, onNavigationExtracted]);

  const html = parseMarkdown(content);

  return (
    <div
      ref={contentRef}
      className="markdown-content prose prose-gray dark:prose-invert max-w-none"
      style={{ maxWidth: config.content.maxWidth }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
