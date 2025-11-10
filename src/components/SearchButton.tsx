import { Search } from 'lucide-react';
import { memo } from 'react';

interface SearchButtonProps {
  onClick: () => void;
}

export const SearchButton = memo(({ onClick }: SearchButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="p-2 transition-colors hover:theme-active-bg theme-radius-base"
      aria-label="Search documentation"
    >
      <Search className="w-4 h-4 theme-text-secondary" />
    </button>
  );
});
