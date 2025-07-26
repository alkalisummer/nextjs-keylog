import { ResponsiveFrame } from '@/shared/ui/layout';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <ResponsiveFrame>{children}</ResponsiveFrame>;
};

export default Layout;
