import { useEffect, useRef, memo } from 'react';
import hljs from 'highlight.js';
import { parseMarkdown } from '../utils/markdown';
import { scrollToHeading } from '../utils/scrollHash';
import { ExportButton } from './ExportButton';
import { MDXProvider } from './MDXProvider';
import type { AppConfig } from '../config/app.config';
import type { MarkdownFile } from '../types';

interface ExportProps {
  content: string;
  title: string;
  filename: string;
}

interface MarkdownContentProps {
  content: string;
  config: AppConfig;
  onNavigationExtracted?: (headings: HTMLHeadingElement[]) => void;
  exportProps?: ExportProps;
  file?: MarkdownFile; // Optional: for MDX rendering
}

export const MarkdownContent = memo(({ content, config, onNavigationExtracted, exportProps, file }: MarkdownContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const container = contentRef.current;
    
    // Batch DOM queries to avoid multiple reflows
    const codeBlocks = config.content.syntaxHighlighting ? container.querySelectorAll('pre code') : [];
    const preElements = config.content.copyCodeButton ? container.querySelectorAll('pre:not([data-copy-added])') : [];
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    // Apply syntax highlighting
    if (config.content.syntaxHighlighting && codeBlocks.length > 0) {
      // Use requestAnimationFrame to avoid blocking main thread
      requestAnimationFrame(() => {
        codeBlocks.forEach((block) => {
          hljs.highlightElement(block as HTMLElement);
        });
      });
    }

    // Add copy buttons to code blocks (batch DOM mutations)
    if (config.content.copyCodeButton && preElements.length > 0) {
      preElements.forEach((pre) => {
        pre.setAttribute('data-copy-added', 'true'); // Mark as processed
        
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
              button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
              button.classList.remove('copied');
            }, 2000);
          }
        };
        
        buttonContainer.appendChild(button);
        pre.appendChild(buttonContainer);
      });
    }

    // Extract headings for navigation (single query)
    if (onNavigationExtracted && headings.length > 0) {
      const headingArray = Array.from(headings) as HTMLHeadingElement[];
      onNavigationExtracted(headingArray);
    }

    // Process headings for anchor links (batch style updates)
    if (headings.length > 0) {
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--meta-nav-height')) || 40;
      
      headings.forEach((heading) => {
        // Skip headings that are inside code blocks
        if (heading.closest('pre, code')) return;
        
        const text = heading.textContent ?? '';
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        
        const htmlHeading = heading as HTMLElement;
        
        // Batch style updates
        htmlHeading.id = id;
        htmlHeading.style.cssText = `scroll-margin-top: ${headerHeight}px; cursor: pointer;`;
        
        // Add click handler
        htmlHeading.onclick = () => {
          scrollToHeading(id);
        };
      });
    }
  }, [content, config, onNavigationExtracted]);

  // Check if this is an MDX file
  const isMDX = file?.isMDX && file?.MDXComponent;
  const html = !isMDX ? parseMarkdown(content) : '';

  return (
    <div className="relative w-full">
      {/* Export Button - positioned to align with first heading */}
      {exportProps && (
        <div className="fixed bottom-4 right-4 no-print z-10">
          <ExportButton
            content={exportProps.content}
            title={exportProps.title}
            filename={exportProps.filename}
          />
        </div>
      )}
      
      <div
        ref={contentRef}
        className="markdown-content prose prose-gray dark:prose-invert max-w-none w-full"
      >
        {isMDX && file?.MDXComponent ? (
          <MDXProvider>
            <file.MDXComponent />
          </MDXProvider>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
    </div>
  );
});