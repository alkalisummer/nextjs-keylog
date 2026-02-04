---
name: seo
description: SEO best practices for web applications. Covers meta tags, Open Graph, structured data, sitemaps, and Core Web Vitals. Use when setting up SEO for Next.js/React apps or optimizing for search engines.
---

# SEO

Search engine optimization guidelines for web applications.

## When to Use

- Setting up meta tags for new pages
- Configuring Open Graph for social sharing
- Implementing structured data (JSON-LD)
- Creating sitemaps and robots.txt
- Optimizing Core Web Vitals

## Meta Tags

### Next.js App Router (Metadata API)

```typescript
// app/layout.tsx - Global metadata
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://mysite.com"),
  title: {
    default: "My Site",
    template: "%s | My Site", // Page title | My Site
  },
  description: "Default description for the site",
  keywords: ["keyword1", "keyword2"],
  authors: [{ name: "Author Name" }],
  creator: "Creator Name",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "My Site",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@handle",
  },
};
```

```typescript
// app/blog/[slug]/page.tsx - Dynamic metadata
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}
```

### React (Vite) with react-helmet-async

```typescript
import { Helmet } from "react-helmet-async";

function BlogPost({ post }) {
  return (
    <>
      <Helmet>
        <title>{post.title} | My Site</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Page content */}
    </>
  );
}
```

## Open Graph Images

### Next.js Dynamic OG Images

```typescript
// app/api/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Default Title";
  
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          color: "white",
          fontSize: 60,
          fontWeight: "bold",
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

```typescript
// Usage in metadata
export const metadata: Metadata = {
  openGraph: {
    images: ["/api/og?title=My+Page+Title"],
  },
};
```

## Structured Data (JSON-LD)

### Next.js

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug);
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  );
}
```

### Common Schema Types

```typescript
// Organization
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Company Name",
  url: "https://example.com",
  logo: "https://example.com/logo.png",
  sameAs: [
    "https://twitter.com/company",
    "https://linkedin.com/company/company",
  ],
};

// Product
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Product Name",
  description: "Product description",
  image: "https://example.com/product.jpg",
  offers: {
    "@type": "Offer",
    price: "29.99",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

// FAQ
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is this product?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This product is...",
      },
    },
  ],
};
```

## Sitemap

### Next.js App Router

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mysite.com";
  
  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];
  
  // Dynamic pages (e.g., blog posts)
  const posts = await getPosts();
  const postPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  
  return [...staticPages, ...postPages];
}
```

### Large Sites (Multiple Sitemaps)

```typescript
// app/sitemap/[id]/route.ts
import { MetadataRoute } from "next";

export async function generateSitemaps() {
  const totalPosts = await getPostCount();
  const sitemapCount = Math.ceil(totalPosts / 50000);
  
  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts({ offset: id * 50000, limit: 50000 });
  // ...
}
```

## Robots.txt

### Next.js

```typescript
// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mysite.com";
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

## Canonical URLs

```typescript
// Next.js
export const metadata: Metadata = {
  alternates: {
    canonical: "https://mysite.com/blog/post-slug",
  },
};

// For paginated content
export const metadata: Metadata = {
  alternates: {
    canonical: "https://mysite.com/blog", // Always point to page 1
  },
};
```

## Core Web Vitals

### Key Metrics

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤2.5s | 2.5s–4s | >4s |
| INP (Interaction to Next Paint) | ≤200ms | 200ms–500ms | >500ms |
| CLS (Cumulative Layout Shift) | ≤0.1 | 0.1–0.25 | >0.25 |

### Quick Wins

```typescript
// 1. Image optimization (Next.js)
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={630}
  priority // LCP image
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// 2. Font optimization
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Prevents layout shift
});

// 3. Prevent CLS - always specify dimensions
<div style={{ aspectRatio: "16/9" }}>
  <iframe src="..." />
</div>
```

## Multi-language SEO

```typescript
// app/[lang]/layout.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  return {
    alternates: {
      canonical: `https://mysite.com/${lang}`,
      languages: {
        "en": "https://mysite.com/en",
        "ko": "https://mysite.com/ko",
        "ja": "https://mysite.com/ja",
        "x-default": "https://mysite.com/en",
      },
    },
  };
}
```

```html
<!-- Generated output -->
<link rel="alternate" hreflang="en" href="https://mysite.com/en" />
<link rel="alternate" hreflang="ko" href="https://mysite.com/ko" />
<link rel="alternate" hreflang="ja" href="https://mysite.com/ja" />
<link rel="alternate" hreflang="x-default" href="https://mysite.com/en" />
```

## Common Mistakes

### ❌ Don't

```typescript
// Missing meta description
export const metadata = { title: "Page Title" }; // No description

// Duplicate titles across pages
// All pages: "My Site"

// Blocking important pages
// robots.txt: Disallow: /products/

// Missing alt text
<img src="/product.jpg" /> // No alt

// Client-side only content (not crawlable)
useEffect(() => {
  setContent(fetchedContent); // Search engines may not see this
}, []);
```

### ✅ Do

```typescript
// Unique, descriptive meta for each page
export const metadata = {
  title: "Blue Running Shoes - Free Shipping | My Store",
  description: "Lightweight blue running shoes with cushioned sole. Free shipping on orders over $50.",
};

// Server-side rendering for important content
export default async function Page() {
  const products = await getProducts(); // Crawlable
  return <ProductList products={products} />;
}
```

## SEO Checklist

### Per Page

```
□ Unique, descriptive title (50-60 chars)
□ Meta description (150-160 chars)
□ Canonical URL set
□ Open Graph tags (title, description, image)
□ Twitter card tags
□ Structured data (JSON-LD) where applicable
□ Proper heading hierarchy (single H1)
□ Alt text on images
□ Internal links with descriptive anchor text
```

### Site-Wide

```
□ sitemap.xml generated and submitted
□ robots.txt configured
□ HTTPS enabled
□ Mobile-friendly (responsive)
□ Core Web Vitals passing
□ Hreflang tags (if multi-language)
□ 404 page with navigation
□ No broken links
```

## References

- Next.js Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Next.js Sitemap: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- Google Search Central: https://developers.google.com/search/docs
- Schema.org: https://schema.org/
- Open Graph Protocol: https://ogp.me/
- Web Vitals: https://web.dev/vitals/
- Rich Results Test: https://search.google.com/test/rich-results
