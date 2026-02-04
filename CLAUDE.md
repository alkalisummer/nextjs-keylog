# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev           # Start development server (http://localhost:3000)
npm run build         # Build for production (includes sitemap generation)
npm run start         # Start production server (standalone mode)
npm run start:next    # Alternative: start Next.js production server
npm run lint          # Run ESLint
```

### Deployment
```bash
npm run deploy        # Restart PM2 process with updated environment
npm run sitemap       # Generate sitemap
```

### Build Notes
- The build uses Next.js standalone output mode
- Postbuild script generates sitemap and copies static files to standalone directory
- Production server runs from `.next/standalone/server.js`

## Architecture Overview

### FSD (Feature-Sliced Design) Structure

The codebase follows Feature-Sliced Design with clear layer separation:

```
src/
├── app/          # Next.js App Router (pages, layouts, API routes)
├── entities/     # Business entities (post, comment, hashtag, like, trend, article, user)
├── features/     # Feature logic (post, comment, like, login, signup, account, logout)
├── shared/       # Shared utilities, UI components, hooks, boundaries
├── widgets/      # Page-level layout components (header, sidebar, footer, article)
└── styles/       # Global styles and SCSS configuration
```

**Key Principles:**
- **Entities**: Read-only data models with display components and query hooks
- **Features**: User actions (mutations) that combine entities
- **Shared**: Reusable utilities, UI components, and hooks across the app
- **Widgets**: Page-level composition components

### Technology Stack

- **Framework**: Next.js 16 with App Router (standalone output mode)
- **React**: v19 with React Server Components
- **State Management**: React Query v5 (TanStack Query)
- **Authentication**: NextAuth v4 (JWT strategy)
- **Forms**: React Hook Form + Zod validation
- **Styling**: SCSS + MUI v7 + Emotion
- **Backend API**: Separate NestJS backend at `NEXT_PUBLIC_KEYLOG_API_URL`
- **Storage**: Oracle Cloud Object Storage (OCI)
- **Editor**: TOAST UI Editor with markdown support

## Server vs Client Components

### Default: Server Components
All page components are Server Components (RSC) by default. Use server actions with `'use server'` directive for mutations.

### Client Components
Mark with `'use client'` directive when needed for:
- Interactive UI (state, effects, event handlers)
- Browser APIs (clipboard, IntersectionObserver)
- React Query hooks (useSuspenseQuery, useMutation)
- TOAST UI Editor and other browser-only libraries

### Dynamic Imports for Client-Only
For components that can't render on server (e.g., TOAST UI Editor):
```typescript
const Editor = dynamic(
  () => import('@toast-ui/react-editor').then(m => m.Editor),
  { ssr: false }
);
```

## React Query Patterns

### Query Key Factory
Always use the query key factory from `/src/app/provider/query/lib/queryKey.ts`:

```typescript
queryKey().post().postList({ authorId, currPageNum })
queryKey().comment().commentList(postId)
queryKey().hashtag().hashtagList(userId)
queryKey().like().likeCnt(postId)
queryKey().article().articleList(keyword)
```

### Server-Side Prefetching
For optimal performance, prefetch queries in server components:

```typescript
const queryClient = new QueryClient();
await queryClient.prefetchQuery({
  queryKey: queryKey().article().articleList(keyword),
  queryFn: () => getArticleList(keyword),
});
const dehydratedState = dehydrate(queryClient);

return <HydrateClient state={dehydratedState}><ClientComponent /></HydrateClient>;
```

### Mutation Pattern with Optimistic Updates
Features use mutations with optimistic updates:

```typescript
const mutation = useMutation({
  mutationFn: (data) => createEntity(data),

  onMutate: async (data) => {
    await queryClient.cancelQueries({ queryKey });
    const prev = queryClient.getQueryData(queryKey);
    // Optimistically update cache
    queryClient.setQueryData(queryKey, newData);
    return { prev };
  },

  onError: (err, vars, context) => {
    // Rollback on error
    queryClient.setQueryData(queryKey, context.prev);
  },

  onSettled: () => {
    // Refetch to sync with server
    queryClient.invalidateQueries({ queryKey });
  },
});
```

### Query Configuration
- Default `staleTime`: 1 minute
- Use `useSuspenseQuery` for components wrapped in `<AsyncBoundary>` or `<Suspense>`
- Always invalidate related queries after mutations

## Authentication & Authorization

### NextAuth Session
- **Strategy**: JWT with 1-hour max age, 30-minute update age
- **Location**: `/src/app/api/auth/[...nextauth]/route.ts`
- **Session refetch interval**: 15 minutes (900 seconds)

### Session Structure
```typescript
{
  user: { id, email, name, image, blogName, tokenExp },
  accessToken: string,
  accessTokenExpireDate: number
}
```

### Protected Routes
The HTTP client (`/src/shared/lib/client/fetch.ts`) automatically:
1. Checks session existence for non-public routes
2. Refreshes tokens if expired
3. Redirects to login with `?reason=session_expired&redirect={url}` if needed
4. Includes bearer token in requests

### Checking Auth in Components
```typescript
// Server components
const session = await getCustomSession();

// Client components
const { data: session } = useSession();
```

## HTTP Client & API Integration

### Client Factory Pattern
Use the client factory from `/src/shared/lib/client/fetch.ts`:

```typescript
import { client } from '@/shared/lib/client';

// API calls
const response = await client.post().post({ options: { body: data } });
const response = await client.comment().get({ options: { searchParams: { postId } } });
```

### Available Clients
```typescript
client.route()     // Internal Next.js API routes
client.post()      // Post entity endpoints
client.comment()   // Comment endpoints
client.hashtag()   // Hashtag endpoints
client.like()      // Like endpoints
client.article()   // Article endpoints
client.user()      // User endpoints
client.auth()      // Auth endpoints
```

### Request Options
```typescript
{
  body?: Record<string, any>;              // POST/PUT body
  searchParams?: Record<string, any>;      // Query parameters
  bearer?: string;                         // Override auth token
  isPublic?: boolean;                      // Skip auth (default: false)
  stream?: boolean;                        // Streaming response
  withCookie?: boolean;                    // Include cookies for public routes
}
```

### Response Type
All API calls return discriminated union:
```typescript
type ApiResponse<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string }
```

Always check `ok` before accessing `data`:
```typescript
const response = await client.post().get({ ... });
if (!response.ok) {
  // Handle error
  return;
}
const data = response.data; // Type-safe access
```

## Error Handling

### AsyncBoundary Pattern
Wrap async server components with `<AsyncBoundary>`:

```typescript
import { AsyncBoundary } from '@/shared/boundary';

<AsyncBoundary
  pending={<LoadingSkeleton />}
  error={<ErrorFallback />}
>
  <ServerAsyncComponent />
</AsyncBoundary>
```

Combines `<Suspense>` and `<ErrorBoundary>` for clean async handling.

### Error Pages
- `error.tsx` - Segment-level error handling
- `global-error.tsx` - Root layout error handling
- `not-found.tsx` - 404 page

## Form Validation

### Zod Schemas
Define schemas in feature `model/` directories:

```typescript
// features/comment/model/schema.ts
export const CreateCommentSchema = z.object({
  postId: z.number(),
  content: z.string().min(1),
  commentOriginId: z.number().optional(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
```

### Server Action Validation
Always validate in server actions before API calls:

```typescript
'use server';

export const createComment = async (data: CreateCommentInput) => {
  const validation = await CreateCommentSchema.safeParseAsync(data);
  if (!validation.success) {
    return { ok: false, error: 'Invalid input' };
  }

  const session = await getCustomSession();
  if (!session) throw new Error('Unauthorized');

  return await client.comment().post({
    options: { body: validation.data }
  });
};
```

## Oracle Cloud Integration

### Object Storage Client
Server-side only, located at `/src/shared/lib/oci/index.ts`:

```typescript
const storage = await objectStorageClient();

// Upload image
await storage.put(imageBuffer, {
  objectName: 'posts/image.jpg',
  contentType: 'image/jpeg'
});

// Get image URL (public read access)
const url = 'https://objectstorage.ap-chuncheon-1.oraclecloud.com/n/{namespace}/b/{bucket}/o/{objectName}';

// Delete image
await storage.delete('posts/image.jpg');
```

**Features:**
- Automatic cache-control headers (1 day)
- Content-type detection
- Used for profile images, post thumbnails, and content images

## Path Aliases

TypeScript paths configured in `tsconfig.json`:

```typescript
import { Component } from '@/shared/ui';
import { useAuth } from '@/shared/hooks';
import { client } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib/queryKey';
```

Base URL is `.`, so `@/` maps to `src/`.

## SCSS Configuration

### Global Imports
SCSS files in `src/styles/scss/` are globally available:
- `color.scss` - Color variables
- `font.scss` - Font definitions
- `variable.scss` - SCSS variables
- `layout.scss` - Layout utilities

### Usage in Components
```scss
@use 'color' as *;
@use 'font' as *;
@use 'variable' as *;

.component {
  color: $primary-color;
  font-family: $main-font;
}
```

## Important Constants

Located in `/src/shared/lib/constants/`:

```typescript
NUMBER_CONSTANTS: {
  ARTICLE_COUNT: 3,           // Articles per keyword
  POST_PER_PAGE: 10,          // Posts per page (main)
  BLOG_POST_PER_PAGE: 6,      // Posts per page (blog)
  POST_IMAGE_WIDTH: 800,      // Max image width
}

SESSION_REFETCH_INTERVAL: 900  // 15 minutes in seconds
```

## Security

### XSS Prevention
Always sanitize user-generated HTML:

```typescript
import { sanitize } from '@/shared/lib/dompurify';

const cleanHtml = sanitize(userContent);
```

### Validation
- Validate all inputs with Zod on server
- Check auth in server actions before mutations
- Use `isPublic: false` (default) for protected API calls

## Frontend Design Guidelines

The codebase follows Toss Frontend Design Principles (see `.cursor/rules/toss-frontend-rules.mdc`):

### Readability
- Name magic numbers as constants
- Abstract implementation details into dedicated components
- Separate code paths for conditional rendering
- Simplify complex ternaries with IIFEs or separate components
- Name complex conditions

### Predictability
- Standardize return types (React Query returns query object, validation returns discriminated union)
- Avoid hidden side effects (Single Responsibility Principle)
- Use unique, descriptive names to avoid ambiguity

### Cohesion
- Consider form-level vs field-level validation cohesion
- Organize code by feature/domain (FSD architecture)
- Colocate related logic (constants near usage)

### Coupling
- Avoid premature abstraction
- Scope state management (focused hooks)
- Use component composition over props drilling

## Next.js Configuration

### Output Mode
```javascript
output: 'standalone'
```
Optimized for Docker/PM2 deployment with minimal dependencies.

### Image Optimization
Remote patterns allowed for:
- Oracle Cloud Storage (`objectstorage.ap-chuncheon-1.oraclecloud.com`)
- Naver images (`imgnews.naver.net`, `imgnews.pstatic.net`)
- Local images

### Experimental Features
- `staleTimes`: Dynamic 0s, static 180s
- `taint`: Prevent sensitive server data leaking to client
- `scrollRestoration`: Built-in scroll restoration
- `serverSourceMaps`: Development only
- `serverActions.bodySizeLimit`: 20MB

### Redirects
Root path `/` redirects to `/home`.

## Common Workflows

### Adding a New Entity
1. Create folder in `/src/entities/{entity}/`
2. Add `model/` with TypeScript types
3. Add `api/` with fetch functions
4. Add `query/` with React Query hooks
5. Add `component/` with display components

### Adding a New Feature
1. Create folder in `/src/features/{feature}/`
2. Add `model/` with Zod schemas
3. Add `api/` with server actions (`'use server'`)
4. Add `hooks/` with mutation hooks
5. Add `component/` with feature UI

### Creating a New Page
1. Add route in `/src/app/{route}/page.tsx`
2. Make it a server component by default
3. Prefetch queries if needed
4. Pass data to client components via props
5. Wrap async components with `<AsyncBoundary>`

### Adding an API Route
1. Create `/src/app/api/{route}/route.ts`
2. Export HTTP method handlers (GET, POST, etc.)
3. Add auth checks if needed
4. Return NextResponse

## Backend API Endpoints

The app integrates with a separate NestJS backend:

**Base URL**: `process.env.NEXT_PUBLIC_KEYLOG_API_URL`

**Endpoints:**
```
POST   /user/login
POST   /user/signup
GET    /user/:userId
PUT    /user/:userId
DELETE /user/:userId

GET    /post?authorId={id}&currPageNum={page}
GET    /post/:postId
POST   /post
PUT    /post/:postId
DELETE /post/:postId

GET    /comment?postId={id}
POST   /comment
PUT    /comment/:id
DELETE /comment/:id

GET    /hashtag?userId={id}
GET    /hashtag/posts/:postId

GET    /like/count?postId={id}
POST   /like
DELETE /like

GET    /article?keyword={keyword}
```

See NestJS backend repo: https://github.com/alkalisummer/nestjs-keylog

## Environment Variables

Required in `.env`:
```bash
# Backend API
NEXT_PUBLIC_KEYLOG_API_URL=https://api.keylog.dev

# Base URL
BASE_URL=https://keylog.dev

# NextAuth
NEXTAUTH_SECRET={secret}
NEXTAUTH_URL=https://keylog.dev

# Oracle Cloud (server-side only)
OCI_CONFIG_PATH=/path/to/oci/config
OCI_NAMESPACE={namespace}
OCI_BUCKET_NAME={bucket}

# OpenAI
OPENAI_API_KEY={key}

# Naver API (for articles/images)
NAVER_CLIENT_ID={id}
NAVER_CLIENT_SECRET={secret}
```
