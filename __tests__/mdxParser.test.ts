import { describe, it, expect } from 'vitest';
import { extractImports, extractExports, splitIntoSections, parseMDX } from '../src/utils/mdxParser';

describe('MDX Parser', () => {
  describe('extractImports', () => {
    it('should extract import statements', () => {
      const content = `import React from 'react';
import { useState } from 'react';
import Button from './Button';

# Hello`;

      const imports = extractImports(content);
      expect(imports).toHaveLength(3);
      expect(imports[0]?.line).toBe("import React from 'react';");
      expect(imports[1]?.line).toBe("import { useState } from 'react';");
      expect(imports[2]?.line).toBe("import Button from './Button';");
    });

    it('should return empty array when no imports', () => {
      const content = '# Hello\n\nNo imports here';
      const imports = extractImports(content);
      expect(imports).toHaveLength(0);
    });
  });

  describe('extractExports', () => {
    it('should extract single-line exports', () => {
      const content = `export const name = 'test';
export const value = 123;`;

      const exports = extractExports(content);
      expect(exports).toHaveLength(2);
      expect(exports[0]?.name).toBe('name');
      expect(exports[1]?.name).toBe('value');
    });

    it('should extract multi-line function exports', () => {
      const content = `export const Counter = () => {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
};`;

      const exports = extractExports(content);
      expect(exports).toHaveLength(1);
      expect(exports[0]?.name).toBe('Counter');
      expect(exports[0]?.content).toContain('useState');
    });

    it('should extract component with nested braces', () => {
      const content = `export const Alert = ({ type = 'info', children }) => {
  const colors = {
    info: { bg: '#dbeafe' },
    warning: { bg: '#fef3c7' }
  };
  return <div>{children}</div>;
};`;

      const exports = extractExports(content);
      expect(exports).toHaveLength(1);
      expect(exports[0]?.name).toBe('Alert');
      expect(exports[0]?.content).toContain('colors');
    });
  });

  describe('splitIntoSections', () => {
    it('should split by H2 headings', () => {
      const content = `# Title

Some intro

## Section 1

Content 1

## Section 2

Content 2`;

      const sections = splitIntoSections(content, 'h2');
      expect(sections).toHaveLength(2);
      expect(sections[0]?.title).toBe('Section 1');
      expect(sections[0]?.slug).toBe('section-1');
      expect(sections[1]?.title).toBe('Section 2');
    });

    it('should ignore headings in code blocks', () => {
      const content = `## Real Section

\`\`\`markdown
## Not A Section
\`\`\`

## Another Real Section`;

      const sections = splitIntoSections(content, 'h2');
      expect(sections).toHaveLength(2);
      expect(sections[0]?.title).toBe('Real Section');
      expect(sections[1]?.title).toBe('Another Real Section');
    });

    it('should include content in sections', () => {
      const content = `## Interactive Counter

Here's a component:

export const Counter = () => {
  return <div>Counter</div>;
};

<Counter />`;

      const sections = splitIntoSections(content, 'h2');
      expect(sections).toHaveLength(1);
      expect(sections[0]?.content).toContain('export const Counter');
      expect(sections[0]?.content).toContain('<Counter />');
    });
  });

  describe('parseMDX', () => {
    it('should parse complete MDX file', () => {
      const content = `import React from 'react';

# MDX Example

## Section 1

export const Component = () => <div>Test</div>;

<Component />

## Section 2

More content`;

      const parsed = parseMDX(content, 'h2');
      
      expect(parsed.imports).toHaveLength(1);
      expect(parsed.imports[0]?.line).toBe("import React from 'react';");
      
      expect(parsed.exports).toHaveLength(1);
      expect(parsed.exports[0]?.name).toBe('Component');
      
      expect(parsed.sections).toHaveLength(2);
      expect(parsed.sections[0]?.title).toBe('Section 1');
      expect(parsed.sections[1]?.title).toBe('Section 2');
      
      expect(parsed.rawContent).toBe(content);
    });
  });
});
