/**
 * MDX Parser Utility
 * Extracts imports, exports, and sections from MDX content
 */

export interface MDXImport {
  line: string;
  lineNumber: number;
}

export interface MDXExport {
  name: string;
  content: string;
  startLine: number;
  endLine: number;
}

export interface MDXSection {
  title: string;
  slug: string;
  level: number;
  startLine: number;
  endLine: number;
  content: string;
}

export interface ParsedMDX {
  imports: MDXImport[];
  exports: MDXExport[];
  sections: MDXSection[];
  rawContent: string;
}

/**
 * Extract all import statements from MDX content
 */
export const extractImports = (content: string): MDXImport[] => {
  const lines = content.split("\n");
  const imports: MDXImport[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    // Match import statements
    if (trimmed.startsWith("import ")) {
      imports.push({
        line,
        lineNumber: i,
      });
    }
  }

  return imports;
};

/**
 * Extract all component exports from MDX content
 * Handles both inline and multi-line exports
 */
export const extractExports = (content: string): MDXExport[] => {
  const lines = content.split("\n");
  const exports: MDXExport[] = [];
  let inExport = false;
  let currentExport: { name: string; content: string[]; startLine: number } | null = null;
  let braceCount = 0;
  let parenCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    // Start of an export
    if (!inExport && (trimmed.startsWith("export const ") || trimmed.startsWith("export function "))) {
      // Extract name
      const nameMatch = trimmed.match(/export (?:const|function)\s+(\w+)/);
      const name = nameMatch?.[1] ?? `export_${i}`;

      currentExport = {
        name,
        content: [line],
        startLine: i,
      };
      inExport = true;

      // Count braces and parens in this line
      braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      parenCount = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;

      // Check if export is complete in one line
      if (trimmed.endsWith(";") && braceCount === 0 && parenCount === 0) {
        exports.push({
          name: currentExport.name,
          content: currentExport.content.join("\n"),
          startLine: currentExport.startLine,
          endLine: i,
        });
        inExport = false;
        currentExport = null;
      }
    }
    // Continue collecting export lines
    else if (inExport && currentExport) {
      currentExport.content.push(line);

      // Update brace and paren counts
      braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      parenCount += (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;

      // Check if export is complete
      if (braceCount === 0 && parenCount === 0 && trimmed.endsWith(";")) {
        exports.push({
          name: currentExport.name,
          content: currentExport.content.join("\n"),
          startLine: currentExport.startLine,
          endLine: i,
        });
        inExport = false;
        currentExport = null;
      }
    }
  }

  // Handle unclosed export (edge case)
  if (inExport && currentExport) {
    exports.push({
      name: currentExport.name,
      content: currentExport.content.join("\n"),
      startLine: currentExport.startLine,
      endLine: lines.length - 1,
    });
  }

  return exports;
};

/**
 * Split MDX content into sections based on heading level (breakpoint)
 * Returns sections with their content, but doesn't include imports/exports
 */
export const splitIntoSections = (
  //
  content: string,
  breakingPoint: "h1" | "h2" | "h3" | "h4" = "h2"
): MDXSection[] => {
  const levelMap = { h1: 1, h2: 2, h3: 3, h4: 4 };
  const breakLevel = levelMap[breakingPoint];

  const lines = content.split("\n");
  // console.log('[MDX Parser] Total lines:', lines.length);
  // console.log('[MDX Parser] First 5 lines:', lines.slice(0, 5));
  const sections: MDXSection[] = [];
  let inCodeBlock = false;
  let currentSection: { title: string; slug: string; level: number; startLine: number; content: string[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    // Track code blocks (triple backticks)
    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      if (currentSection) {
        currentSection.content.push(line);
      }
      continue;
    }

    // Only check for headings outside code blocks
    if (!inCodeBlock) {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

      if (headingMatch) {
        const level = headingMatch[1]?.length ?? 0;
        const title = headingMatch[2]?.trim() ?? "";
        // console.log(`[MDX Parser] Found heading: level=${level}, title="${title}", breakLevel=${breakLevel}`);

        // If this is a breaking point heading, start a new section
        if (level === breakLevel) {
          // console.log(`[MDX Parser] ✅ Creating new section for: "${title}"`);
          // Save previous section
          if (currentSection) {
            sections.push({
              title: currentSection.title,
              slug: currentSection.slug,
              level: currentSection.level,
              startLine: currentSection.startLine,
              endLine: i - 1,
              content: currentSection.content.join("\n"),
            });
          }

          // Start new section
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          currentSection = {
            title,
            slug,
            level,
            startLine: i,
            content: [line],
          };
          continue;
        } else {
          // console.log(`[MDX Parser] ❌ Skipping heading (level ${level} != breakLevel ${breakLevel})`);
        }
      }
    }

    // Add line to current section (or accumulate before first section)
    if (currentSection) {
      currentSection.content.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections.push({
      title: currentSection.title,
      slug: currentSection.slug,
      level: currentSection.level,
      startLine: currentSection.startLine,
      endLine: lines.length - 1,
      content: currentSection.content.join("\n"),
    });
  }

  return sections;
};

/**
 * Parse MDX content into imports, exports, and sections
 */
export const parseMDX = (content: string, breakingPoint: "h1" | "h2" | "h3" | "h4" = "h2"): ParsedMDX => {
  return {
    imports: extractImports(content),
    exports: extractExports(content),
    sections: splitIntoSections(content, breakingPoint),
    rawContent: content,
  };
};
