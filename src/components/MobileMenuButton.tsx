import { memo } from "react";
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const MobileMenuButton = memo(({ onClick, isOpen }: MobileMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed bottom-6 left-6 z-50 w-12 h-12 theme-accent-bg shadow-lg flex items-center justify-center theme-radius-medium transition-colors hover:opacity-90"
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <X className="w-5 h-5 text-white" />
      ) : (
        <Menu className="w-5 h-5 text-white" />
      )}
    </button>
  );
});
