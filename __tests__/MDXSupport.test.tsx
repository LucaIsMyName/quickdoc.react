import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownContent } from '../src/components/MarkdownContent';
import { defaultConfig } from '../src/config/app.config';
import type { MarkdownFile } from '../src/types';

describe('MDX Support', () => {
  it('should render markdown content when isMDX is false', () => {
    const file: MarkdownFile = {
      slug: 'test',
      title: 'Test',
      content: '# Hello World\n\nThis is a test.',
      path: '/test.md',
      isMDX: false,
    };

    render(
      <MarkdownContent
        content={file.content}
        config={defaultConfig}
        file={file}
      />
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render MDX component when isMDX is true', () => {
    const TestMDXComponent = () => <div>MDX Component Content</div>;
    
    const file: MarkdownFile = {
      slug: 'test-mdx',
      title: 'Test MDX',
      content: '',
      path: '/test.mdx',
      isMDX: true,
      MDXComponent: TestMDXComponent,
    };

    render(
      <MarkdownContent
        content={file.content}
        config={defaultConfig}
        file={file}
      />
    );

    expect(screen.getByText('MDX Component Content')).toBeInTheDocument();
  });

  it('should handle missing MDX component gracefully', () => {
    const file: MarkdownFile = {
      slug: 'test-mdx',
      title: 'Test MDX',
      content: '',
      path: '/test.mdx',
      isMDX: true,
      // No MDXComponent provided
    };

    const { container } = render(
      <MarkdownContent
        content={file.content}
        config={defaultConfig}
        file={file}
      />
    );

    // Should render without crashing
    expect(container.querySelector('.markdown-content')).toBeTruthy();
  });
});
