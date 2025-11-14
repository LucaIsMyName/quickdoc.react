import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  title,
  showLineNumbers = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="my-2">
      {title && (
        <div className="theme-bg-secondary px-4 py-2 text-sm font-medium theme-text-secondary flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs theme-text-secondary uppercase">{language}</span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 theme-border-radius bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
        <pre className="p-3 overflow-x-auto text-sm" style={{ whiteSpace: 'pre' }}>
          {showLineNumbers ? (
            <code className="text-gray-800 dark:text-gray-200 block" style={{ whiteSpace: 'pre' }}>
              <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="pr-4 text-right text-gray-500 dark:text-gray-500 select-none align-top" style={{ width: '3rem', whiteSpace: 'nowrap' }}>
                        {index + 1}
                      </td>
                      <td style={{ whiteSpace: 'pre', wordBreak: 'break-all' }}>{line || '\u00A0'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </code>
          ) : (
            <code className="text-gray-800 dark:text-gray-200" style={{ whiteSpace: 'pre' }}>
              {code}
            </code>
          )}
        </pre>
      </div>
    </div>
  );
};
