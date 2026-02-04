---
name: design-system
description: Design token systems, component architecture patterns, and UI implementation standards. Use when building design systems, creating reusable components, implementing dark mode, or establishing visual consistency across applications.
---

# Design System

Comprehensive guide for building scalable design systems with design tokens, component patterns, and implementation standards.

## When to Use This Skill

- Establishing design token systems (spacing, color, typography)
- Building reusable UI component libraries
- Implementing dark mode / theming
- Creating consistent component APIs
- Setting up Storybook documentation

---

## 1. Design Token System

### Token Hierarchy

```
Global Tokens (primitive)
└── Semantic Tokens (purpose)
    └── Component Tokens (specific)

Example:
--color-blue-500          (global)
└── --color-primary       (semantic)
    └── --button-bg       (component)
```

### Spacing Scale

Base unit (4px) × multiplier. Limit choices for consistency.

```css
:root {
  --spacing-0: 0;
  --spacing-1: 4px;    /* Inline icon gaps */
  --spacing-2: 8px;    /* Tight padding, related elements */
  --spacing-3: 12px;   /* Default padding */
  --spacing-4: 16px;   /* Card padding, section gaps */
  --spacing-6: 24px;   /* Component separation */
  --spacing-8: 32px;   /* Section separation */
  --spacing-12: 48px;  /* Large section gaps */
  --spacing-16: 64px;  /* Page section separation */
}
```

### Typography Scale

Modular scale (1.25 ratio) for harmonious sizing.

```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Fira Code', 'Consolas', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px - Captions, labels */
  --text-sm: 0.875rem;   /* 14px - Secondary text */
  --text-base: 1rem;     /* 16px - Body text */
  --text-lg: 1.25rem;    /* 20px - Lead text */
  --text-xl: 1.5rem;     /* 24px - H4 */
  --text-2xl: 2rem;      /* 32px - H3 */
  --text-3xl: 2.5rem;    /* 40px - H2 */
  --text-4xl: 3rem;      /* 48px - H1 */

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Color System

```css
:root {
  /* Palette (primitives - don't use directly) */
  --color-gray-50: #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-200: #e5e5e5;
  --color-gray-300: #d4d4d4;
  --color-gray-400: #a3a3a3;
  --color-gray-500: #737373;
  --color-gray-600: #525252;
  --color-gray-700: #404040;
  --color-gray-800: #262626;
  --color-gray-900: #171717;

  --color-blue-50: #eff6ff;
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  --color-blue-700: #1d4ed8;

  --color-red-50: #fef2f2;
  --color-red-500: #ef4444;
  --color-red-600: #dc2626;

  --color-green-50: #f0fdf4;
  --color-green-500: #22c55e;
  --color-green-600: #16a34a;

  /* Semantic Tokens (use these) */
  --color-bg-primary: var(--color-gray-50);
  --color-bg-secondary: var(--color-gray-100);
  --color-bg-tertiary: var(--color-gray-200);
  --color-bg-inverse: var(--color-gray-900);

  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-text-tertiary: var(--color-gray-500);
  --color-text-inverse: var(--color-gray-50);
  --color-text-link: var(--color-blue-600);

  --color-border-default: var(--color-gray-200);
  --color-border-strong: var(--color-gray-300);

  --color-interactive: var(--color-blue-500);
  --color-interactive-hover: var(--color-blue-600);
  --color-interactive-active: var(--color-blue-700);

  --color-success: var(--color-green-500);
  --color-error: var(--color-red-500);
  --color-warning: #f59e0b;
}
```

### Elevation (Shadow) Scale

```css
:root {
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Elevation usage */
  --shadow-card: var(--shadow-sm);
  --shadow-dropdown: var(--shadow-md);
  --shadow-modal: var(--shadow-lg);
  --shadow-toast: var(--shadow-xl);
}
```

### Motion Tokens

```css
:root {
  /* Durations */
  --duration-instant: 50ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  /* Easings */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Common transitions */
  --transition-colors: color, background-color, border-color var(--duration-fast) var(--ease-default);
  --transition-transform: transform var(--duration-normal) var(--ease-default);
  --transition-opacity: opacity var(--duration-normal) var(--ease-default);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-instant: 0ms;
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
  }
}
```

### Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

## 2. Dark Mode Implementation

### CSS Custom Properties Approach

```css
/* Light theme (default) */
:root {
  --color-bg-primary: var(--color-gray-50);
  --color-bg-secondary: var(--color-gray-100);
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-border-default: var(--color-gray-200);
}

/* Dark theme */
[data-theme="dark"] {
  --color-bg-primary: var(--color-gray-900);
  --color-bg-secondary: var(--color-gray-800);
  --color-text-primary: var(--color-gray-50);
  --color-text-secondary: var(--color-gray-400);
  --color-border-default: var(--color-gray-700);
}

/* System preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-primary: var(--color-gray-900);
    --color-bg-secondary: var(--color-gray-800);
    --color-text-primary: var(--color-gray-50);
    --color-text-secondary: var(--color-gray-400);
    --color-border-default: var(--color-gray-700);
  }
}
```

### React Theme Provider

```tsx
// contexts/ThemeContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', systemDark ? 'dark' : 'light');
      setResolvedTheme(systemDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
      setResolvedTheme(theme);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system changes
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### Theme Toggle Component

```tsx
// components/ThemeToggle.tsx
'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

### Prevent Flash (Next.js)

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'system';
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
                document.documentElement.setAttribute('data-theme', resolved);
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 3. Component Architecture

### Component Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **Primitives** | Atomic building blocks | Box, Text, Icon |
| **Forms** | User input | Button, Input, Select, Checkbox |
| **Layout** | Structure | Stack, Grid, Container, Divider |
| **Data Display** | Content | Card, Badge, Avatar, Table |
| **Feedback** | User feedback | Spinner, Skeleton, Progress |
| **Overlay** | Layered UI | Modal, Popover, Tooltip, Drawer |

### Component API Design

**1. Variant over Boolean**
```tsx
// ❌ Bad
<Button primary large outline>

// ✅ Good
<Button variant="primary" size="lg" appearance="outline">
```

**2. Consistent Prop Names**
```tsx
// Standard prop conventions
size: 'sm' | 'md' | 'lg'
variant: 'primary' | 'secondary' | 'ghost'
disabled: boolean
fullWidth: boolean
```

**3. Compound Components**
```tsx
// Complex components with multiple parts
<Select>
  <Select.Trigger placeholder="Select option" />
  <Select.Content>
    <Select.Item value="1">Option 1</Select.Item>
    <Select.Item value="2">Option 2</Select.Item>
  </Select.Content>
</Select>

<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### Component States

Every interactive component must handle:

| State | CSS Selector | Description |
|-------|--------------|-------------|
| Default | - | Resting state |
| Hover | `:hover` | Mouse over |
| Focus | `:focus-visible` | Keyboard focus |
| Active | `:active` | Being pressed |
| Disabled | `:disabled`, `[aria-disabled]` | Non-interactive |

### Button Component Example

```tsx
// components/Button/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './Button.module.css';

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      ghost: styles.ghost,
      danger: styles.danger,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant, 
    size, 
    isLoading, 
    leftIcon, 
    rightIcon, 
    disabled,
    children, 
    className,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner size="sm" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

```css
/* components/Button/Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: var(--transition-colors);
  cursor: pointer;
  border: none;
}

.button:focus-visible {
  outline: 2px solid var(--color-interactive);
  outline-offset: 2px;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.primary {
  background: var(--color-interactive);
  color: white;
}
.primary:hover:not(:disabled) {
  background: var(--color-interactive-hover);
}

.secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
}
.secondary:hover:not(:disabled) {
  background: var(--color-bg-tertiary);
}

.ghost {
  background: transparent;
  color: var(--color-text-primary);
}
.ghost:hover:not(:disabled) {
  background: var(--color-bg-secondary);
}

/* Sizes */
.sm {
  height: 32px;
  padding: 0 var(--spacing-3);
  font-size: var(--text-sm);
}
.md {
  height: 40px;
  padding: 0 var(--spacing-4);
  font-size: var(--text-base);
}
.lg {
  height: 48px;
  padding: 0 var(--spacing-6);
  font-size: var(--text-lg);
}
```

---

## 4. Accessibility Requirements

### Focus Management

```css
/* Visible focus for keyboard users */
:focus-visible {
  outline: 2px solid var(--color-interactive);
  outline-offset: 2px;
}

/* Remove focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Color Contrast

| Element | Minimum Ratio |
|---------|---------------|
| Normal text | 4.5:1 |
| Large text (18px+ bold, 24px+) | 3:1 |
| UI components | 3:1 |

### Touch Targets

```css
/* Minimum 44x44px touch target */
.interactive {
  min-width: 44px;
  min-height: 44px;
}
```

### ARIA Patterns

```tsx
// Button with loading state
<button aria-busy={isLoading} aria-disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>

// Icon button needs label
<button aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>

// Form error
<input aria-invalid={hasError} aria-describedby="error-message" />
<span id="error-message" role="alert">{errorMessage}</span>
```

---

## 5. File Structure

```
design-system/
├── tokens/
│   ├── colors.css
│   ├── spacing.css
│   ├── typography.css
│   ├── shadows.css
│   ├── motion.css
│   └── index.css          # Imports all tokens
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   ├── Button.stories.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Input/
│   ├── Card/
│   └── index.ts           # Export all components
├── hooks/
│   └── useTheme.ts
├── contexts/
│   └── ThemeContext.tsx
└── index.ts               # Main entry point
```

---

## 6. Storybook Documentation

```tsx
// components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button isLoading>Loading</Button>
    </div>
  ),
};
```

---

## Related Skills

- For React component patterns, see: `react-patterns`
- For performance optimization, see: `performance-patterns`
