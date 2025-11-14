import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  variant = 'default',
}) => {
  const variants = {
    default: 'theme-bg-secondary',
    bordered: 'theme-border theme-border-size',
    elevated: 'shadow-lg theme-bg',
  };

  return (
    <div className={`my-4 p-6 theme-border-radius ${variants[variant]}`}>
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}
      <div className="text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
};
