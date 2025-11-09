import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const DarkModeToggle = ({ isDark, onToggle }: DarkModeToggleProps) => {
  const handleClick = () => {
    console.log('DarkModeToggle button clicked');
    console.log('onToggle function:', typeof onToggle);
    console.log('Current HTML classes:', document.documentElement.className);
    onToggle();
  };

  return (
    <div className="flex items-center gap-2 hidden">
      {/* Test button */}
      {/* Actual dark mode toggle */}
      <button
        onClick={handleClick}
        className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
        ) : (
          <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        )}
      </button>
      
      {/* Debug info */}
  
    </div>
  );
};
