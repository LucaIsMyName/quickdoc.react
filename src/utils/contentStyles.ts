import type { AppConfig } from '../config/app.config';

export const applyContentStyles = (config: AppConfig, mainContentElement: HTMLElement | null) => {
  const root = document.documentElement;
  
  // Set content spacing based on config
  const spacingMap = {
    compact: '0.5rem',
    normal: '1rem',
    relaxed: '2rem'
  };
  
  root.style.setProperty('--content-margin-y', spacingMap[config.content.spacing]);
  
  // Apply desktop-only alignment classes to the main content container
  if (mainContentElement) {
    console.log('Applying alignment:', config.content.align);
    console.log('Current classes:', mainContentElement.className);
    
    // Remove existing alignment classes
    mainContentElement.classList.remove('desktop-align-left', 'desktop-align-center', 'desktop-align-right');
    
    // Add new alignment class for desktop only
    const newClass = `desktop-align-${config.content.align}`;
    mainContentElement.classList.add(newClass);
    
    console.log('Added class:', newClass);
    console.log('Updated classes:', mainContentElement.className);
  } else {
    console.log('No main content element available');
  }
};
