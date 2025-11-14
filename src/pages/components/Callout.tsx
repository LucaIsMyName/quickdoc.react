import React from 'react';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({
  type = 'info',
  title,
  children,
}) => {
  const styles = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      title: 'text-blue-900 dark:text-blue-100',
      Icon: Info,
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      title: 'text-yellow-900 dark:text-yellow-100',
      Icon: AlertTriangle,
    },
    success: {
      container: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      title: 'text-green-900 dark:text-green-100',
      Icon: CheckCircle,
    },
    error: {
      container: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      title: 'text-red-900 dark:text-red-100',
      Icon: AlertCircle,
    },
  };

  const style = styles[type];
  const IconComponent = style.Icon;

  return (
    <div className={`theme-border-medium my-4 p-4 border-l-4 theme-border-radius ${style.container}`}>
      <div className="flex gap-3">
        <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.icon}`} />
        <div className="flex-1">
          {title && (
            <div className={`font-semibold mb-1 ${style.title}`}>
              {title}
            </div>
          )}
          <div className="text-sm dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
