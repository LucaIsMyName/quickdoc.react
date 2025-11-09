import { useEffect, useRef, useState } from 'react';

interface ScrollFadeProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  size?: number;
  intensity?: number;
  className?: string;
}

export const ScrollFade = ({ 
  children, 
  direction = 'vertical',
  size = 40,
  intensity = 0.8,
  className = ''
}: ScrollFadeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({ start: true, end: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScrollable = () => {
      if (direction === 'vertical') {
        const hasScroll = container.scrollHeight > container.clientHeight;
        setIsScrollable(hasScroll);
        
        const atTop = container.scrollTop === 0;
        const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
        
        setScrollPosition({ start: atTop, end: atBottom });
      } else {
        const hasScroll = container.scrollWidth > container.clientWidth;
        setIsScrollable(hasScroll);
        
        const atLeft = container.scrollLeft === 0;
        const atRight = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
        
        setScrollPosition({ start: atLeft, end: atRight });
      }
    };

    checkScrollable();
    container.addEventListener('scroll', checkScrollable);
    window.addEventListener('resize', checkScrollable);

    return () => {
      container.removeEventListener('scroll', checkScrollable);
      window.removeEventListener('resize', checkScrollable);
    };
  }, [direction]);

  if (!isScrollable) {
    return (
      <div ref={containerRef} className={className}>
        {children}
      </div>
    );
  }

  const fadeStyle = {
    '--fade-size': `${size}px`,
    '--fade-intensity': intensity,
  } as React.CSSProperties;

  return (
    <div className={`scroll-fade-container scroll-fade-${direction} relative`} style={fadeStyle}>
      {/* Start fade */}
      <div 
        className={`scroll-fade-start absolute z-10 pointer-events-none transition-opacity duration-300 ${
          scrollPosition.start ? 'opacity-0' : 'opacity-100'
        }`}
        style={
          direction === 'vertical' 
            ? {
                top: 0,
                left: 0,
                right: 0,
                height: 'var(--fade-size)',
                background: `linear-gradient(to bottom, 
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 1)) 0%, 
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.8)) 30%,
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.6)) 60%,
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.3)) 90%,
                  rgba(255, 255, 255, 0) 100%
                )`,
                backdropFilter: `blur(calc(var(--fade-size) * 0.3))`,
                WebkitBackdropFilter: `blur(calc(var(--fade-size) * 0.3))`,
              }
            : {
                left: 0,
                top: 0,
                bottom: 0,
                width: 'var(--fade-size)',
                background: `linear-gradient(to right, 
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 1)) 0%, 
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.8)) 30%,
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.6)) 60%,
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.3)) 90%,
                  rgba(255, 255, 255, 0) 100%
                )`,
                backdropFilter: `blur(calc(var(--fade-size) * 0.3))`,
                WebkitBackdropFilter: `blur(calc(var(--fade-size) * 0.3))`,
              }
        }
      />

      {/* End fade */}
      <div 
        className={`scroll-fade-end absolute z-10 pointer-events-none transition-opacity duration-300 ${
          scrollPosition.end ? 'opacity-0' : 'opacity-100'
        }`}
        style={
          direction === 'vertical'
            ? {
                bottom: 0,
                left: 0,
                right: 0,
                height: 'var(--fade-size)',
                background: `linear-gradient(to top, 
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 1)) 0%, 
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.8)) 30%,
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.6)) 60%,
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.3)) 90%,
                  rgba(255, 255, 255, 0) 100%
                )`,
                backdropFilter: `blur(calc(var(--fade-size) * 0.3))`,
                WebkitBackdropFilter: `blur(calc(var(--fade-size) * 0.3))`,
              }
            : {
                right: 0,
                top: 0,
                bottom: 0,
                width: 'var(--fade-size)',
                background: `linear-gradient(to left, 
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 1)) 0%, 
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.8)) 30%,
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.6)) 60%,
                  rgba(255, 255, 255, calc(var(--fade-intensity) * 0.3)) 90%,
                  rgba(255, 255, 255, 0) 100%
                )`,
                backdropFilter: `blur(calc(var(--fade-size) * 0.3))`,
                WebkitBackdropFilter: `blur(calc(var(--fade-size) * 0.3))`,
              }
        }
      />

      {/* Scrollable content */}
      <div 
        ref={containerRef}
        className={`scroll-fade-content ${className}`}
        style={{
          overflow: direction === 'vertical' ? 'auto' : 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
};
