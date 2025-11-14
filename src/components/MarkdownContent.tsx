import { useEffect, useRef, memo } from "react";
import hljs from "highlight.js";
import { parseMarkdown } from "../utils/markdown";
import { scrollToHeading } from "../utils/scrollHash";
import { sanitizeHTML } from "../utils/security";
import { ExportButton } from "./ExportButton";
import { DocumentFooter } from "./DocumentFooter";
import { MDXProvider } from "./MDXProvider";
import { useTheme } from "../contexts/ThemeContext";
import type { AppConfig } from "../config/app.config";
import type { MarkdownFile } from "../types";

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
  const { isDark } = useTheme();

  // Check if this is an MDX file
  const isMDXSection = file?.isMDX === true;

  // Debug logging
  console.log(`[MarkdownContent] Rendering - isMDXSection: ${isMDXSection}, content length: ${content.length}`);
  if (isMDXSection) {
    console.log(`[MarkdownContent] MDX section content preview:`, content.substring(0, 200));
  }

  useEffect(() => {
    if (!contentRef.current) return;

    const container = contentRef.current;

    // Batch DOM queries to avoid multiple reflows
    const codeBlocks = config.content.syntaxHighlighting ? container.querySelectorAll("pre code") : [];
    const preElements = config.content.copyCodeButton ? container.querySelectorAll("pre:not([data-copy-added])") : [];
    const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");

    // Render Mermaid diagrams
    const mermaidBlocks = container.querySelectorAll("pre code.language-mermaid, .mermaid-diagram[data-mermaid-code]");
    if (mermaidBlocks.length > 0) {
      import('mermaid').then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });

        mermaidBlocks.forEach((block, index) => {
          let code = '';
          let targetElement: HTMLElement | null = null;
          
          // Check if it's a code block or already rendered diagram
          if (block.classList.contains('mermaid-diagram')) {
            // Already rendered, get code from data attribute
            code = block.getAttribute('data-mermaid-code') || '';
            targetElement = block as HTMLElement;
          } else {
            // New code block
            const pre = block.parentElement;
            if (!pre) return;
            code = block.textContent || '';
            targetElement = pre;
          }
          
          if (!code || !targetElement) return;

          const id = `mermaid-${Date.now()}-${index}`;
          
          // Create container for mermaid diagram
          const diagramContainer = document.createElement('div');
          diagramContainer.className = 'my-6 flex justify-center items-center mermaid-diagram';
          diagramContainer.style.minHeight = '100px';
          diagramContainer.setAttribute('data-mermaid-code', code); // Store code for re-rendering
          
          // Render diagram
          mermaid.render(id, code).then(({ svg }) => {
            diagramContainer.innerHTML = svg;
            targetElement?.replaceWith(diagramContainer);
          }).catch((error) => {
            console.error('Mermaid rendering error:', error);
            diagramContainer.innerHTML = `
              <div class="p-4 theme-border theme-border-size theme-border-radius bg-red-50 dark:bg-red-900/20 w-full">
                <div class="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                  Mermaid Diagram Error
                </div>
                <pre class="text-xs text-red-600 dark:text-red-300 whitespace-pre-wrap">${error.message || 'Failed to render diagram'}</pre>
              </div>
            `;
            targetElement?.replaceWith(diagramContainer);
          });
        });
      });
    }

    // Apply syntax highlighting (skip mermaid blocks)
    if (config.content.syntaxHighlighting && codeBlocks.length > 0) {
      // Use requestAnimationFrame to avoid blocking main thread
      requestAnimationFrame(() => {
        codeBlocks.forEach((block) => {
          // Skip mermaid blocks
          if (block.classList.contains('language-mermaid')) return;
          hljs.highlightElement(block as HTMLElement);
        });
      });
    }

    // Add copy buttons to code blocks (batch DOM mutations)
    if (config.content.copyCodeButton && preElements.length > 0) {
      preElements.forEach((pre) => {
        pre.setAttribute("data-copy-added", "true"); // Mark as processed

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "copy-button-container";

        const button = document.createElement("button");
        button.className = "copy-button";
        button.setAttribute("aria-label", "Copy code to clipboard");

        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

        button.onclick = () => {
          const code = pre.querySelector("code");
          if (code) {
            navigator.clipboard.writeText(code.textContent ?? "");
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
            button.classList.add("copied");
            setTimeout(() => {
              button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
              button.classList.remove("copied");
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
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--meta-nav-height")) || 40;

      headings.forEach((heading) => {
        // Skip headings that are inside code blocks
        if (heading.closest("pre, code")) return;

        const text = heading.textContent ?? "";
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

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
  }, [content, config, onNavigationExtracted, isDark]);

  // Parse regular markdown if not MDX
  const html = !isMDXSection ? parseMarkdown(content) : "";

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
        className="markdown-content prose prose-gray dark:prose-invert max-w-none w-full">
        {isMDXSection ? (
          // MDX Section: Check if this section has React components
          <MDXProvider>{file?.MDXComponent && <file.MDXComponent />}</MDXProvider>
        ) : (
          // Regular Markdown: Parse to HTML
          <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }} />
        )}

        {/* Document Footer */}
        <DocumentFooter
          config={config}
          fileName={file?.slug}
        />
      </div>
    </div>
  );
});
