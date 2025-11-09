import { Sun, Moon } from 'lucide-react';
import { memo } from 'react';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const DarkModeToggle = memo(({ isDark, onToggle }: DarkModeToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      {/* Actual dark mode toggle */}
      <button
        onClick={onToggle}
        className="p-2 pr-0 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
        ) : (
          <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        )}
      </button>
    </div>
  );
});
