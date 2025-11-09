export const applyMetaNavStyles = (hasMetaNav: boolean) => {
  const root = document.documentElement;
  
  // Set meta nav height based on whether it's shown
  const metaNavHeight = hasMetaNav ? '40px' : '0px';
  root.style.setProperty('--meta-nav-height', metaNavHeight);
  
  // Adjust content margin based on meta nav presence
  const contentMarginY = hasMetaNav ? '1rem' : '0.5rem';
  root.style.setProperty('--content-margin-y', contentMarginY);
};
