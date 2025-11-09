import { Search } from 'lucide-react';

interface SearchButtonProps {
  onClick: () => void;
}

export const SearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Search documentation"
    >
      <Search className="w-4 h-4 text-gray-700 dark:text-gray-300" />
    </button>
  );
};
