/**
 * Utility for managing URL hash based on scroll position
 * Updates the hash dynamically as the user scrolls through content
 */

let isScrolling = false;
let scrollTimeout: NodeJS.Timeout;

/**
 * Get all headings in the current document
 */
const getHeadings = (): HTMLHeadingElement[] => {
  return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    .filter(heading => heading.id && !heading.closest('pre, code')) as HTMLHeadingElement[];
};

/**
 * Find the currently visible heading based on scroll position
 */
const getCurrentHeading = (): HTMLHeadingElement | null => {
  const headings = getHeadings();
  if (headings.length === 0) return null;

  const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--meta-nav-height')) || 40;
  const scrollPosition = window.scrollY + headerHeight + 50; // Add some offset

  // Find the heading that's currently in view
  let currentHeading: HTMLHeadingElement | null = null;
  
  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i];
    if (heading) {
      const headingTop = heading.getBoundingClientRect().top + window.scrollY;
      
      if (scrollPosition >= headingTop) {
        currentHeading = heading;
        break;
      }
    }
  }

  // If no heading is found above scroll position, use the first one
  return currentHeading || (headings.length > 0 ? headings[0] || null : null);
};

/**
 * Update URL hash based on current scroll position
 */
const updateHashFromScroll = (): void => {
  const currentHeading = getCurrentHeading();
  
  if (currentHeading && currentHeading.id) {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split('#')[0];
    const newUrl = `${baseUrl}#${currentHeading.id}`;
    
    // Only update if the hash actually changed
    if (window.location.href !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }
};

/**
 * Initialize scroll-based hash updates with throttling
 */
export const initScrollHashUpdates = (): (() => void) => {
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (!isScrolling) {
          isScrolling = true;
        }

        // Clear existing timeout
        clearTimeout(scrollTimeout);

        // Set a timeout to update hash after scrolling stops
        scrollTimeout = setTimeout(() => {
          updateHashFromScroll();
          isScrolling = false;
        }, 150); // Wait 150ms after scrolling stops
        
        ticking = false;
      });
      ticking = true;
    }
  };

  // Add scroll listener with passive flag for better performance
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(scrollTimeout);
  };
};

/**
 * Scroll to a specific heading by ID
 */
export const scrollToHeading = (headingId: string): void => {
  const element = document.getElementById(headingId);
  if (!element) return;

  const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--meta-nav-height')) || 40;
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - headerHeight;

  // Update URL hash immediately
  const currentUrl = window.location.href;
  const baseUrl = currentUrl.split('#')[0];
  window.history.replaceState(null, '', `${baseUrl}#${headingId}`);

  // Apply a temporary highlight class to indicate navigation happened
  const highlightClass = 'heading-flash';
  element.classList.remove(highlightClass);
  // Force reflow so re-adding the class retriggers the animation even for same target
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  (element as HTMLElement).offsetWidth;
  element.classList.add(highlightClass);

  // Remove the class after the animation duration to keep DOM clean
  window.setTimeout(() => {
    element.classList.remove(highlightClass);
  }, 1200);

  // Scroll to position
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });
};

/**
 * Handle initial hash on page load
 */
export const handleInitialHash = (): void => {
  const hash = window.location.hash.slice(1); // Remove #
  if (hash) {
    // Delay to ensure content is loaded
    setTimeout(() => {
      scrollToHeading(hash);
    }, 100);
  }
};
