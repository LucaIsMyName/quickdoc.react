import { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface SidebarWidthControlProps {
  width: number;
  onWidthChange: (width: number) => void;
  onReset: () => void;
}

export const SidebarWidthControl = ({ 
  width, 
  onWidthChange, 
  onReset 
}: SidebarWidthControlProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX.current;
      const newWidth = startWidth.current + deltaX;
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (isDragging) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, [isDragging, onWidthChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    startWidth.current = width;
    e.preventDefault();
  };

  const handleDoubleClick = () => {
    onReset();
  };

  return (
    <div
      className={`
        hidden md:flex absolute top-0 right-0 h-full cursor-col-resize
        transition-all duration-200 z-50
        ${isHovered || isDragging ? 'bg-blue-500 dark:bg-blue-400 w-2' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-1'}
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center justify-center h-full w-full">
        <GripVertical 
          className={`
            w-3 h-3 text-gray-500 dark:text-gray-400 transition-opacity duration-200
            ${isHovered || isDragging ? 'opacity-100' : 'opacity-0'}
          `}
        />
      </div>
      
      {/* Width indicator tooltip */}
      {isHovered && !isDragging && (
        <div className="absolute top-1/2 -translate-y-1/2 -right-16 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
          {width}px
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900 dark:border-r-gray-100 -ml-1"></div>
        </div>
      )}
    </div>
  );
};
