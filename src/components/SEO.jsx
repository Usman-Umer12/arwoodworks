
import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://arwoodworks.com";

export default function SEO({
  title,
  description,
  path = "/",
  image = "/logo1.webp",
}) {
  const canonicalUrl = `${SITE_URL}${path}`;

  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="A.R. Woodworks" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta
        name="twitter:description"
        content={description}
      />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}