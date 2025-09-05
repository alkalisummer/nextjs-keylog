import { ResponsiveFrame } from '@/shared/ui/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ResponsiveFrame>{children}</ResponsiveFrame>;
}
