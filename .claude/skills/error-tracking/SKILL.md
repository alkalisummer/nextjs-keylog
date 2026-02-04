---
name: error-tracking
description: Error tracking and logging with Sentry. Setup guides for Next.js, React, and React Native. Covers error boundaries, custom tagging, source maps, and alerting.
---

# Error Tracking with Sentry

Capture, track, and resolve errors across your application stack.

## When to Use

- Setting up error monitoring for new projects
- Implementing error boundaries
- Adding custom error context and tags
- Configuring alerts and notifications
- Debugging production issues

## Platform Setup

### Next.js

**Recommended: Use the wizard**

```bash
npx @sentry/wizard@latest -i nextjs
```

The wizard automatically:
- Creates config files (`instrumentation-client.ts`, `sentry.server.config.ts`)
- Adds Next.js instrumentation hook
- Updates `next.config.js`
- Creates error handling components
- Sets up source map uploads

**Manual setup if needed:**

```bash
npm install @sentry/nextjs
```

```typescript
// instrumentation-client.ts (client-side)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  sendDefaultPii: true,
  
  integrations: [
    Sentry.replayIntegration(),
  ],
  
  // Performance: adjust in production
  tracesSampleRate: 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Required for App Router performance tracking
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
```

```typescript
// sentry.server.config.ts (server-side)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});
```

```typescript
// next.config.js
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  { /* your next config */ },
  {
    silent: true,
    org: "your-org",
    project: "your-project",
  }
);
```

### React (Vite / CRA)

```bash
npm install @sentry/react
```

```typescript
// main.tsx or index.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, // or process.env.REACT_APP_SENTRY_DSN
  environment: import.meta.env.MODE,
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

```tsx
// App.tsx - Error Boundary
import * as Sentry from "@sentry/react";

export default function App() {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <Router>
        {/* your app */}
      </Router>
    </Sentry.ErrorBoundary>
  );
}

function ErrorFallback() {
  return (
    <div>
      <h1>Something went wrong</h1>
      <button onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  );
}
```

### React Native

**Recommended: Use the wizard**

```bash
npx @sentry/wizard@latest -i reactNative
```

The wizard automatically:
- Installs `@sentry/react-native`
- Configures Metro (`metro.config.js`)
- Sets up Android Gradle for source maps
- Configures Xcode build phases
- Runs `pod install`

**Manual setup:**

```bash
npm install @sentry/react-native
```

```typescript
// App.tsx
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "YOUR_DSN",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  
  // Session Replay (mobile)
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [Sentry.mobileReplayIntegration()],
});

// Wrap your app for touch tracking and automatic tracing
export default Sentry.wrap(App);
```

**For Expo:**

```bash
npx expo install @sentry/react-native
```

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native/expo",
        {
          "organization": "your-org",
          "project": "your-project"
        }
      ]
    ]
  }
}
```

## Error Boundaries

### Basic Pattern

```tsx
import * as Sentry from "@sentry/react"; // or @sentry/nextjs

<Sentry.ErrorBoundary
  fallback={({ error, resetError }) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={resetError}>Try again</button>
    </div>
  )}
  onError={(error, componentStack) => {
    console.error(componentStack);
  }}
>
  <CriticalComponent />
</Sentry.ErrorBoundary>
```

### Per-Feature Boundaries

```tsx
function Dashboard() {
  return (
    <div>
      <Sentry.ErrorBoundary fallback={<ChartError />}>
        <AnalyticsChart />
      </Sentry.ErrorBoundary>
      
      <Sentry.ErrorBoundary fallback={<TableError />}>
        <DataTable />
      </Sentry.ErrorBoundary>
    </div>
  );
}
```

## Manual Error Capture

### Capture Exceptions

```typescript
import * as Sentry from "@sentry/react";

try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}

// Async errors
async function fetchData() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (error) {
    Sentry.captureException(error, {
      tags: { operation: "fetchData" },
    });
    throw error;
  }
}
```

### Capture Messages

```typescript
Sentry.captureMessage("User completed onboarding", "info");
Sentry.captureMessage("API rate limit approaching", "warning");
```

## Context and Tags

### User Context

```typescript
// After login
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});

// After logout
Sentry.setUser(null);
```

### Tags (Filterable)

```typescript
// Global tags
Sentry.setTag("app_version", "1.2.3");
Sentry.setTag("feature_flag", "new_checkout");

// Per-event tags
Sentry.captureException(error, {
  tags: {
    component: "PaymentForm",
    payment_method: "stripe",
  },
});
```

### Extra Data

```typescript
Sentry.setExtra("cart_items", cart.items);

Sentry.captureException(error, {
  extra: {
    request_payload: payload,
    response_status: response.status,
  },
});
```

### Breadcrumbs

```typescript
Sentry.addBreadcrumb({
  category: "checkout",
  message: "User selected payment method",
  level: "info",
  data: { method: "credit_card" },
});
```

## Source Maps

### Next.js

Automatic with wizard setup. Verify in `next.config.js`:

```javascript
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(nextConfig, {
  org: "your-org",
  project: "your-project",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  hideSourceMaps: true,
});
```

### Vite

```bash
npm install @sentry/vite-plugin
```

```typescript
// vite.config.ts
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  build: { sourcemap: true },
  plugins: [
    sentryVitePlugin({
      org: "your-org",
      project: "your-project",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
});
```

### React Native

Handled automatically by wizard. For manual setup, ensure release/dist match:

```typescript
Sentry.init({
  dsn: "...",
  release: "my-app@1.0.0",
  dist: "1",
});
```

## Environment Config

```env
# .env.local (Next.js)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# .env (Vite)
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

## Sample Rates by Environment

```typescript
Sentry.init({
  dsn: "...",
  environment: process.env.NODE_ENV,
  sendDefaultPii: true,
  
  // Errors: always capture
  sampleRate: 1.0,
  
  // Performance: reduce in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Replays: sample in production
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
  replaysOnErrorSampleRate: 1.0,
  
  // Ignore specific errors
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Network request failed",
  ],
  
  // Filter events before sending
  beforeSend(event) {
    if (event.exception?.values?.[0]?.type === "ChunkLoadError") {
      return null;
    }
    return event;
  },
});
```

## Alerts Setup (Sentry Dashboard)

1. **Alerts** → **Create Alert**
2. Choose trigger:
   - Issue Alerts: New error, regression, high frequency
   - Metric Alerts: Error rate > threshold
3. Set conditions:
   - Environment = production
   - Error count > 10 in 1 hour
4. Add actions: Slack, Email, PagerDuty

## Verify Setup

Add this snippet to test:

```typescript
throw new Error("Test Sentry error!");
```

Check Sentry dashboard:
- **Issues**: View captured errors
- **Traces**: View performance data
- **Replays**: View session recordings

## Checklist

- [ ] Install Sentry SDK (use wizard when available)
- [ ] Configure DSN and environment
- [ ] Add error boundaries around critical components
- [ ] Set user context after authentication
- [ ] Add relevant tags for filtering
- [ ] Configure source maps
- [ ] Set appropriate sample rates for production
- [ ] Set up alert rules in Sentry dashboard
- [ ] Test error capture in development


## References

Sentry Next.js: https://docs.sentry.io/platforms/javascript/guides/nextjs/
Sentry React: https://docs.sentry.io/platforms/javascript/guides/react/
Sentry React Native: https://docs.sentry.io/platforms/react-native/
Sentry Expo: https://docs.sentry.io/platforms/react-native/manual-setup/expo/
Sentry Node.js: https://docs.sentry.io/platforms/javascript/guides/node/
Sentry Vite Plugin: https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/
