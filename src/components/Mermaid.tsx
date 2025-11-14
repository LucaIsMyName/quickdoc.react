import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../contexts/ThemeContext';

interface MermaidProps {
  chart: string;
  id?: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart, id }) => {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const uniqueId = useRef(id || `mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Initialize mermaid with theme
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });
  }, [isDark]);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !chart.trim()) return;

      try {
        setError(null);
        
        // Clear previous content
        containerRef.current.innerHTML = '';
        
        // Render the diagram
        const { svg } = await mermaid.render(uniqueId.current, chart);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderDiagram();
  }, [chart, isDark]);

  if (error) {
    return (
      <div className="my-4 p-4 theme-border theme-border-size theme-border-radius bg-red-50 dark:bg-red-900/20">
        <div className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
          Mermaid Diagram Error
        </div>
        <pre className="text-xs text-red-600 dark:text-red-300 whitespace-pre-wrap">
          {error}
        </pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="my-6 flex justify-center items-center mermaid-diagram"
      style={{ minHeight: '100px' }}
    />
  );
};
