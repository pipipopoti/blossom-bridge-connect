import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

export const SEO = ({
  title,
  description,
  keywords,
  ogImage = "/og-image.jpg",
  ogType = "website",
  canonicalUrl,
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Extended Hands Initiative`;

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement("meta");
        if (isProperty) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Update meta description
    updateMeta("description", description);

    // Update keywords if provided
    if (keywords) {
      updateMeta("keywords", keywords);
    }

    // Open Graph tags
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:image", ogImage, true);

    // Twitter Card tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImage);

    // Canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", canonicalUrl);
    }

    // Cleanup function
    return () => {
      // Reset to default title on unmount if needed
    };
  }, [title, description, keywords, ogImage, ogType, canonicalUrl]);

  return null;
};