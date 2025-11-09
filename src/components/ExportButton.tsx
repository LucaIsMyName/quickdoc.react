import { memo } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { Popover } from '@base-ui-components/react/popover';

interface ExportButtonProps {
  content: string;
  title: string;
  filename?: string;
}

const ExportButtonComponent = ({ content, title, filename }: ExportButtonProps) => {
  // Generate filename from title if not provided
  const getFilename = (extension: string) => {
    const baseFilename = filename || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${baseFilename}.${extension}`;
  };

  // Export as Markdown file
  const exportAsMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getFilename('md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print as PDF (opens print dialog)
  const exportAsPDF = () => {
    // Add print-specific title to the page
    const originalTitle = document.title;
    document.title = title;
    
    // Trigger print dialog
    window.print();
    
    // Restore original title
    document.title = originalTitle;
  };

  return (
    <Popover.Root>
      <Popover.Trigger className="flex items-center gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200">
        <Download className="w-4 h-4" />
        <span className="hidden md:inline">Export</span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner 
          side="top"
          align="end"
          sideOffset={8}
        >
          <Popover.Popup className="w-48 md:w-64 lg:w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1 origin-[var(--transform-origin)] transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0">
            {/* PDF Export */}
            <button
              onClick={exportAsPDF}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium">Export as PDF</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Print dialog</div>
              </div>
            </button>

            {/* Markdown Export */}
            <button
              onClick={exportAsMarkdown}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium">Export as Markdown</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Download .md file</div>
              </div>
            </button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

// Memoize the ExportButton component
export const ExportButton = memo(ExportButtonComponent);
