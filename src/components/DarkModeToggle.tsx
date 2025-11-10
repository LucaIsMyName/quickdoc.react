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
        className="p-2 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <Sun className="w-4 h-4 theme-accent" />
        ) : (
          <Moon className="w-4 h-4 theme-text-secondary" />
        )}
      </button>
    </div>
  );
});
