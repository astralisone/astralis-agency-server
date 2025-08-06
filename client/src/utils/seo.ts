export const generateProductStructuredData = (item: any) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": item.title,
    "description": item.description,
    "image": item.imageUrl,
    "sku": item.id,
    "offers": {
      "@type": "Offer",
      "price": item.price,
      "priceCurrency": "USD",
      "availability": item.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": item.seller?.name || "Astralis One"
      }
    },
    "aggregateRating": item.averageRating && item.reviewCount ? {
      "@type": "AggregateRating",
      "ratingValue": item.averageRating,
      "reviewCount": item.reviewCount
    } : undefined
  };
};

export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};
