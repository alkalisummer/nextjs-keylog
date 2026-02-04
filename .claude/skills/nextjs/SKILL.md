---
name: nextjs
description: Next.js 15+ App Router patterns including Server Components, Streaming SSR, Server Actions, routing patterns, caching strategies, and file structure conventions. Use when building Next.js applications with App Router.
---

# Next.js App Router Patterns

Comprehensive patterns for building Next.js 15+ applications with App Router.

## When to Use This Skill

- Building Next.js applications with App Router
- Implementing Server Components and Client Components
- Setting up Server Actions for mutations
- Configuring caching and revalidation strategies
- Organizing routes and file structure

---

## 1. Server Components & Client Components

### Server Components (Default)

```tsx
// app/products/page.tsx - Server Component (default)
async function ProductsPage() {
  // Direct database/API access - runs on server only
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
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

### Client Components

```tsx
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

### When to Use Client Components

```tsx
// Use 'use client' when you need:
// - useState, useEffect, useContext
// - Event handlers (onClick, onChange)
// - Browser APIs (window, document)
// - Custom hooks that use state

'use client';

// ❌ Can't do this in Server Components
export function InteractiveCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Mixing Server and Client Components

```tsx
// app/products/[id]/page.tsx (Server Component)
import { AddToCartButton } from '@/components/AddToCartButton';

async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <div>
      {/* Static content - Server Component */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>${product.price}</span>

      {/* Interactive - Client Component */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}
```

---

## 2. Streaming with Suspense

### Basic Streaming

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Each Suspense boundary streams independently */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

// Async Server Component - streams when ready
async function StatsCards() {
  const stats = await fetchStats(); // Slow API
  return <StatsDisplay stats={stats} />;
}
```

### Loading UI Files

```tsx
// app/dashboard/loading.tsx
// Automatically wraps page in Suspense
export default function Loading() {
  return <DashboardSkeleton />;
}
```

---

## 3. Data Fetching & Caching

### Fetch with Caching Options

```tsx
// SSG - Cached indefinitely (default)
const data = await fetch('https://api.example.com/data');

// SSR - No caching, fresh every request
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
});

// ISR - Revalidate after 60 seconds
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 }
});

// Tag-based revalidation
const data = await fetch('https://api.example.com/products', {
  next: { tags: ['products'] }
});
```

### Data Access Layer

```typescript
// lib/data/user.ts
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

// Request deduplication (same request = single execution)
export const getUser = cache(async (id: string) => {
  return await db.user.findUnique({ where: { id } });
});

// Cross-request caching with tags
export const getCachedUser = unstable_cache(
  async (id: string) => db.user.findUnique({ where: { id } }),
  ['user-by-id'],
  { revalidate: 3600, tags: ['users'] }
);
```

### Route Segment Config

```tsx
// app/products/page.tsx

// Force static generation
export const dynamic = 'force-static';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Revalidate every hour
export const revalidate = 3600;

// Cache control
export const fetchCache = 'force-cache';
```

---

## 4. Server Actions

### Basic Server Action

```typescript
// app/actions/user.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

export async function updateUser(userId: string, formData: FormData) {
  try {
    const validatedData = updateUserSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
    });

    await db.user.update({
      where: { id: userId },
      data: validatedData,
    });

    revalidateTag(`user-${userId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Failed to update user' };
  }
}
```

### Form with Server Action

```tsx
// components/UserForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateUser } from '@/app/actions/user';

export function UserForm({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId);
  const [state, dispatch] = useFormState(updateUserWithId, {});

  return (
    <form action={dispatch}>
      <input name="name" required />
      {state.error && <p className="error">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}
```

### Optimistic Updates

```tsx
'use client';

import { useOptimistic } from 'react';
import { toggleLike } from '@/app/actions/posts';

export function LikeButton({ post }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    post.likes,
    (state, increment: number) => state + increment
  );

  async function handleLike() {
    addOptimisticLike(1);
    await toggleLike(post.id);
  }

  return <button onClick={handleLike}>❤️ {optimisticLikes}</button>;
}
```

---

## 5. Routing Patterns

### Route Groups

```
app/
├── (marketing)/          # Group - doesn't affect URL
│   ├── layout.tsx        # Minimal marketing layout
│   ├── page.tsx          # /
│   └── about/page.tsx    # /about
├── (shop)/               # Group - different layout
│   ├── layout.tsx        # Shop layout with cart
│   ├── products/page.tsx # /products
│   └── cart/page.tsx     # /cart
└── (dashboard)/          # Group - auth required
    ├── layout.tsx        # Dashboard layout with sidebar
    └── dashboard/page.tsx # /dashboard
```

### Parallel Routes

```tsx
// app/dashboard/@analytics/page.tsx
export default function Analytics() {
  return <AnalyticsChart />;
}

// app/dashboard/@metrics/page.tsx
export default function Metrics() {
  return <MetricsPanel />;
}

// app/dashboard/layout.tsx
export default function Layout({
  children,
  analytics,
  metrics,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  metrics: React.ReactNode;
}) {
  return (
    <div className="grid">
      {children}
      {analytics}
      {metrics}
    </div>
  );
}
```

### Intercepting Routes (Modals)

```
app/
├── @modal/
│   └── (.)products/[id]/page.tsx  # Intercepts /products/[id]
├── products/
│   └── [id]/page.tsx              # Full product page
└── layout.tsx
```

```tsx
// app/@modal/(.)products/[id]/page.tsx
export default function ProductModal({ params }) {
  return (
    <Modal>
      <ProductQuickView id={params.id} />
    </Modal>
  );
}

// app/layout.tsx
export default function RootLayout({ children, modal }) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
```

### Dynamic Routes

```tsx
// app/products/[id]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  return <ProductDetail product={product} />;
}

// Generate static params at build time
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}
```

---

## 6. Middleware

### Authentication

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  // Protect dashboard routes
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add headers
  const response = NextResponse.next();
  response.headers.set('x-pathname', request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

### Layout-Level Auth Check

```tsx
// app/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <DashboardNav user={user} />
      {children}
    </div>
  );
}
```

---

## 7. Error Handling

### Error Boundary

```tsx
// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Not Found

```tsx
// app/products/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Product Not Found</h2>
      <p>Could not find the requested product.</p>
    </div>
  );
}

// Trigger from page
import { notFound } from 'next/navigation';

async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
```

---

## 8. File Structure

### Domain-Driven Structure

```
app/
├── (marketing)/
│   ├── page.tsx
│   └── about/page.tsx
├── (shop)/
│   ├── products/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── cart/page.tsx
├── (dashboard)/
│   └── dashboard/
│       ├── page.tsx
│       └── settings/page.tsx
├── api/
│   └── webhooks/route.ts
├── actions/              # Server Actions
│   ├── user.ts
│   └── product.ts
├── components/           # Shared components
│   ├── ui/
│   └── forms/
├── lib/                  # Utilities
│   ├── db.ts
│   └── auth.ts
└── layout.tsx
```

### Feature-Based Structure

```
app/
├── domains/
│   ├── user/
│   │   ├── components/
│   │   │   ├── UserProfile.tsx      # Server Component
│   │   │   └── UserEditForm.tsx     # 'use client'
│   │   ├── actions/
│   │   │   ├── queries.ts           # getUser, getUsers
│   │   │   └── mutations.ts         # updateUser, deleteUser
│   │   └── hooks/
│   │       └── useUserPreferences.ts
│   └── product/
│       ├── components/
│       ├── actions/
│       └── hooks/
├── (routes)/
│   └── ...
└── ...
```

---

## 9. Image & Metadata

### Image Optimization

```tsx
import Image from 'next/image';

export function ProductCard({ product }) {
  return (
    <Image
      src={product.image}
      alt={product.name}
      width={300}
      height={200}
      placeholder="blur"
      blurDataURL={product.blurDataURL}
      priority={false} // true for LCP images
      sizes="(max-width: 768px) 100vw, 300px"
    />
  );
}
```

### Metadata

```tsx
// app/products/[id]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}
```

---

## 10. Best Practices Summary

1. **Server Components by default** - 'use client' only when needed
2. **Streaming with Suspense** - Wrap slow components in Suspense
3. **Colocate data fetching** - Fetch in Server Components where needed
4. **Server Actions for mutations** - All writes through Server Actions
5. **Proper caching** - Use revalidate, tags, unstable_cache
6. **Route groups** - Organize by feature/layout needs
7. **Error boundaries** - error.tsx at appropriate levels
8. **Type safety** - TypeScript + Zod for validation

## Related Skills

- For React component patterns, see: `react-patterns`
- For rendering concepts, see: `rendering-patterns`
- For performance optimization, see: `performance-patterns`
- For i18n implementation, see: `i18n-patterns`
