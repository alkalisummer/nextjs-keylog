import React, { ReactNode } from 'react';
import RightArea from '@/widgets/RightArea';
import { Sidebar } from '@/widgets/sidebar/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const BlogLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* Sidebar needs a userId; pages using this old layout won't have it. Keep RightArea only. */}
      <RightArea>{children}</RightArea>
    </>
  );
};

export default React.memo(BlogLayout);
