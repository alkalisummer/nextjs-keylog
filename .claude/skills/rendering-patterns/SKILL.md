---
name: rendering-patterns
description: Web rendering strategies for modern applications including CSR, SSR, SSG, ISR, and streaming. Use when architecting web applications, choosing rendering methods for Next.js/Remix, or optimizing for SEO and performance.
---

# Rendering Patterns

Modern web rendering strategies for building fast, SEO-friendly, and scalable applications.

## When to Use This Skill

- Choosing rendering architecture for new projects
- Configuring Next.js or Remix applications
- Optimizing for SEO requirements
- Improving performance metrics (FCP, LCP, TTI)
- Migrating between rendering strategies

## Rendering Strategies Overview

| Pattern | Build Time | Request Time | Best For |
|---------|-----------|--------------|----------|
| CSR | - | Full render | Dashboards, SPAs |
| SSR | - | Full render | Dynamic, personalized content |
| SSG | Full render | - | Blogs, marketing sites |
| ISR | Initial render | Revalidate | E-commerce, news sites |
| Streaming | - | Progressive | Large pages, slow data |

---

## 1. Client-Side Rendering (CSR)

All rendering happens in the browser. Server sends minimal HTML with JavaScript bundle.

```jsx
// Traditional CSR with React
// index.html
<!DOCTYPE html>
<html>
  <head>
    <title>CSR App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>

// App.jsx
const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <Spinner />;
  
  return <Dashboard data={data} />;
};

createRoot(document.getElementById('root')).render(<App />);
```

**Process:**
1. Browser requests page
2. Server returns empty HTML + JS bundle
3. Browser downloads and parses JS
4. React renders UI
5. Data fetched after initial render

**Pros:**
- Simple deployment (static hosting)
- Rich interactivity
- Good for authenticated/personalized content

**Cons:**
- Poor SEO (empty initial HTML)
- Slower First Contentful Paint
- JS required for any content
- Loading spinners on initial load

**Best For:**
- Admin dashboards
- Internal tools
- Apps behind authentication
- Highly interactive applications

---

## 2. Server-Side Rendering (SSR)

Server renders full HTML for each request.

```jsx
// Next.js App Router - Server Component (default)
// app/products/[id]/page.tsx
async function ProductPage({ params }: { params: { id: string } }) {
  // Runs on server for every request
  const product = await fetch(`https://api.example.com/products/${params.id}`, {
    cache: 'no-store' // Opt out of caching = SSR
  }).then(res => res.json());
  
  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <AddToCartButton productId={product.id} />
    </main>
  );
}

export default ProductPage;
```

```jsx
// Next.js Pages Router
// pages/products/[id].tsx
export async function getServerSideProps({ params }) {
  const product = await fetch(`https://api.example.com/products/${params.id}`)
    .then(res => res.json());
  
  return {
    props: { product }
  };
}

function ProductPage({ product }) {
  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </main>
  );
}

export default ProductPage;
```

```jsx
// Remix SSR
// app/routes/products.$id.tsx
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ params }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    throw new Response('Not Found', { status: 404 });
  }
  
  return json({ product });
}

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();
  
  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </main>
  );
}
```

**Process:**
1. Browser requests page
2. Server fetches data
3. Server renders HTML with data
4. Browser receives complete HTML
5. React hydrates for interactivity

**Pros:**
- SEO-friendly (complete HTML)
- Fast First Contentful Paint
- Works without JavaScript
- Fresh data on every request

**Cons:**
- Higher server load
- Slower Time to First Byte (TTFB)
- Full page generation per request
- Requires Node.js server

**Best For:**
- User-specific content
- Real-time data requirements
- Pages with frequent updates
- E-commerce product pages

---

## 3. Static Site Generation (SSG)

Pages pre-rendered at build time.

```jsx
// Next.js App Router - Static by default
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';

// Generate static paths at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Static page component
async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <time>{post.publishedAt}</time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

export default BlogPost;
```

```jsx
// Next.js Pages Router
// pages/blog/[slug].tsx
export async function getStaticPaths() {
  const posts = await getAllPosts();
  
  return {
    paths: posts.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: false // 404 for unknown paths
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return {
    props: { post }
  };
}

function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

export default BlogPost;
```

**Process:**
1. Build process fetches all data
2. All pages pre-rendered to HTML
3. HTML files deployed to CDN
4. Browser receives pre-built HTML instantly

**Pros:**
- Fastest possible TTFB (CDN)
- Excellent SEO
- Low server costs
- High reliability (static files)

**Cons:**
- Stale content until rebuild
- Long build times for large sites
- Not suitable for dynamic content
- Rebuild needed for updates

**Best For:**
- Marketing/landing pages
- Documentation sites
- Blogs
- Any content that changes infrequently

---

## 4. Incremental Static Regeneration (ISR)

Static pages that revalidate and regenerate in the background.

```jsx
// Next.js App Router - Time-based revalidation
// app/products/page.tsx
async function ProductsPage() {
  const products = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  }).then(res => res.json());
  
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

export default ProductsPage;
```

```jsx
// Next.js App Router - On-demand revalidation
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { path, tag, secret } = await request.json();
  
  // Validate secret
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  // Revalidate by path or tag
  if (path) {
    revalidatePath(path);
  }
  
  if (tag) {
    revalidateTag(tag);
  }
  
  return Response.json({ revalidated: true });
}

// Usage in data fetching with tags
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { tags: ['products'] }
  });
  return res.json();
}

// Trigger from CMS webhook
// POST /api/revalidate
// { "tag": "products", "secret": "xxx" }
```

```jsx
// Next.js Pages Router
// pages/products/[id].tsx
export async function getStaticProps({ params }) {
  const product = await getProduct(params.id);
  
  return {
    props: { product },
    revalidate: 60 // Regenerate after 60 seconds
  };
}

export async function getStaticPaths() {
  const products = await getTopProducts(100);
  
  return {
    paths: products.map(p => ({ params: { id: p.id } })),
    fallback: 'blocking' // Generate unknown paths on-demand
  };
}
```

**Fallback Strategies:**
- `fallback: false` - 404 for paths not in getStaticPaths
- `fallback: true` - Show loading state, then render
- `fallback: 'blocking'` - Wait for generation (SSR-like)

**Process:**
1. Static pages served from cache
2. After revalidation period, next request triggers regeneration
3. New page generated in background
4. Cache updated, subsequent requests get fresh content

**Pros:**
- Static performance with fresh content
- Scales infinitely (CDN)
- No full rebuild needed
- Hybrid of SSG and SSR benefits

**Cons:**
- Data can be stale for revalidation period
- More complex caching logic
- Cold starts for uncached pages

**Best For:**
- E-commerce catalogs
- News/media sites
- Content that updates periodically
- Large sites with many pages

---

## 5. Streaming SSR

Progressive rendering that sends HTML in chunks as it becomes available.

```jsx
// Next.js App Router - Streaming with Suspense
// app/dashboard/page.tsx
import { Suspense } from 'react';

// Fast component - renders immediately
function Header() {
  return <header><h1>Dashboard</h1></header>;
}

// Slow component - data fetching
async function Analytics() {
  const data = await fetchAnalytics(); // Slow API call
  return <AnalyticsChart data={data} />;
}

async function RecentOrders() {
  const orders = await fetchRecentOrders(); // Another slow call
  return <OrdersList orders={orders} />;
}

// Page streams content progressively
export default function DashboardPage() {
  return (
    <div>
      <Header /> {/* Sent immediately */}
      
      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics /> {/* Streamed when ready */}
      </Suspense>
      
      <Suspense fallback={<OrdersSkeleton />}>
        <RecentOrders /> {/* Streamed when ready */}
      </Suspense>
    </div>
  );
}
```

```jsx
// Loading UI with loading.tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="dashboard-skeleton">
      <HeaderSkeleton />
      <ChartSkeleton />
      <TableSkeleton />
    </div>
  );
}

// Nested loading states
// app/dashboard/@analytics/loading.tsx
export default function AnalyticsLoading() {
  return <ChartSkeleton />;
}
```

```jsx
// Remix streaming
// app/routes/dashboard.tsx
import { defer } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';

export async function loader() {
  // Start slow requests but don't await
  const analyticsPromise = fetchAnalytics();
  const ordersPromise = fetchRecentOrders();
  
  // Return immediately, stream later
  return defer({
    analytics: analyticsPromise,
    orders: ordersPromise,
  });
}

export default function Dashboard() {
  const { analytics, orders } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <Header />
      
      <Suspense fallback={<ChartSkeleton />}>
        <Await resolve={analytics}>
          {(data) => <AnalyticsChart data={data} />}
        </Await>
      </Suspense>
      
      <Suspense fallback={<TableSkeleton />}>
        <Await resolve={orders}>
          {(data) => <OrdersList orders={data} />}
        </Await>
      </Suspense>
    </div>
  );
}
```

**Process:**
1. Server starts rendering
2. Fast parts sent immediately
3. Suspense boundaries show fallbacks
4. Slow data streams in as available
5. HTML chunks replace fallbacks

**Pros:**
- Improved perceived performance
- Better TTFB than traditional SSR
- Parallel data fetching
- Progressive enhancement

**Cons:**
- More complex architecture
- Requires Suspense planning
- Infrastructure must support streaming

**Best For:**
- Dashboards with multiple data sources
- Pages with slow APIs
- Large pages with independent sections

---

## 6. React Server Components (RSC)

Components that run only on the server, sending serialized output to client.

```jsx
// Server Component (default in App Router)
// app/products/page.tsx
import { db } from '@/lib/db';

// This NEVER runs in browser
// Can use Node.js APIs, direct DB access, etc.
async function ProductsPage() {
  // Direct database query - no API needed
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  
  return (
    <main>
      <h1>Products</h1>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </main>
  );
}

export default ProductsPage;
```

```jsx
// Client Component - explicitly marked
// components/AddToCartButton.tsx
'use client';

import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  
  const handleClick = async () => {
    setIsAdding(true);
    await addToCart(productId);
    setIsAdding(false);
  };
  
  return (
    <button onClick={handleClick} disabled={isAdding}>
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

```jsx
// Mixing Server and Client Components
// app/products/[id]/page.tsx (Server Component)
import { AddToCartButton } from '@/components/AddToCartButton';

async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({
    where: { id: params.id }
  });
  
  return (
    <div>
      {/* Static content rendered on server */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>${product.price}</span>
      
      {/* Interactive part - Client Component */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}
```

```jsx
// Passing Server Data to Client Components
// ❌ Wrong - Can't pass functions or non-serializable data
<ClientComponent onClick={handleClick} db={dbConnection} />

// ✅ Correct - Pass serializable props
<ClientComponent productId={product.id} initialData={product} />

// ✅ Correct - Children pattern
async function ServerWrapper() {
  const data = await fetchData();
  
  return (
    <ClientInteractiveWrapper>
      <ServerRenderedContent data={data} />
    </ClientInteractiveWrapper>
  );
}
```

**Server vs Client Components:**

| Feature | Server Component | Client Component |
|---------|-----------------|------------------|
| Interactivity | ❌ No hooks/events | ✅ Full React |
| Direct data access | ✅ DB, filesystem | ❌ API only |
| Bundle size | ✅ Zero JS | ❌ Adds to bundle |
| Secrets/API keys | ✅ Safe | ❌ Exposed |
| Browser APIs | ❌ No window/document | ✅ Full access |

**Pros:**
- Zero client JS for server components
- Direct backend access
- Smaller bundles
- Better security (secrets stay on server)

**Cons:**
- New mental model
- Can't use hooks in server components
- Serialization constraints
- Limited ecosystem support

**Best For:**
- Data-heavy pages
- Components that don't need interactivity
- Security-sensitive data display
- Large applications (bundle size matters)

---

## Choosing the Right Pattern

### Decision Tree

```
Need real-time/personalized data?
├── Yes → SSR or Streaming
└── No → Content changes frequently?
    ├── Yes → ISR
    └── No → SSG

Need interactivity?
├── Heavy interactivity → CSR (or hybrid)
└── Light interactivity → Server Components + Client islands
```

### Pattern Combinations

```jsx
// Next.js - Hybrid approach
// Static shell + dynamic content

// app/layout.tsx - Static
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header /> {/* Static */}
        <Nav /> {/* Static */}
        {children}
        <Footer /> {/* Static */}
      </body>
    </html>
  );
}

// app/page.tsx - ISR
export const revalidate = 3600; // 1 hour

async function HomePage() {
  const featured = await getFeaturedProducts();
  return <FeaturedGrid products={featured} />;
}

// app/dashboard/page.tsx - SSR with streaming
export const dynamic = 'force-dynamic';

async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
```

---

## Performance Metrics Impact

| Pattern | FCP | LCP | TTI | TTFB |
|---------|-----|-----|-----|------|
| CSR | Poor | Poor | Good | Excellent |
| SSR | Good | Good | Medium | Medium |
| SSG | Excellent | Excellent | Excellent | Excellent |
| ISR | Excellent | Excellent | Excellent | Excellent |
| Streaming | Excellent | Good | Good | Excellent |

## Related Skills

- For React component patterns, see: `react-patterns`
- For performance optimization, see: `performance-patterns`
