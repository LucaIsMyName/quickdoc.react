import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const DarkModeToggle = ({ isDark, onToggle }: DarkModeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
      ) : (
        <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
};
