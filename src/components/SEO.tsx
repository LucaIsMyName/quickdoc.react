import { Helmet } from "react-helmet-async";
import { memo } from "react";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  author?: string;
  ogImage?: string;
  canonical?: string;
  language?: string;
  isIndex?: boolean;
}

export const SEO = memo<SEOProps>(({ title, description = "Modern markdown-based documentation framework built with React", keywords = ["documentation", "markdown", "react", "typescript"], author = "QuickDoc", ogImage, canonical, language = "en", isIndex=true }: SEOProps) => {
  const siteTitle = `${title} | QuickDoc`;
  const currentUrl = canonical || window.location.href;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta
        name="title"
        content={siteTitle}
      />
      <meta
        name="description"
        content={description}
      />
      <meta
        name="keywords"
        content={keywords.join(", ")}
      />
      <meta
        name="author"
        content={author}
      />

      {/* Canonical URL */}
      <link
        rel="canonical"
        href={currentUrl}
      />

      {/* Open Graph / Facebook */}
      <meta
        property="og:type"
        content="website"
      />
      <meta
        property="og:url"
        content={currentUrl}
      />
      <meta
        property="og:title"
        content={siteTitle}
      />
      <meta
        property="og:description"
        content={description}
      />
      {ogImage && (
        <meta
          property="og:image"
          content={ogImage}
        />
      )}

      {/* Twitter */}
      <meta
        property="twitter:card"
        content="summary_large_image"
      />
      <meta
        property="twitter:url"
        content={currentUrl}
      />
      <meta
        property="twitter:title"
        content={siteTitle}
      />
      <meta
        property="twitter:description"
        content={description}
      />
      {ogImage && (
        <meta
          property="twitter:image"
          content={ogImage}
        />
      )}

      {/* Additional SEO */}
      <meta
        name="robots"
        content={isIndex ? "index, follow" : "noindex, nofollow"}
      />
      <meta
        name="language"
        content={language}
      />
      <meta
        name="revisit-after"
        content="7 days"
      />
      
      {/* HTML lang attribute */}
      <html lang={language} />
    </Helmet>
  );
});
