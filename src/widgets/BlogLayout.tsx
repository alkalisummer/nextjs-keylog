import React, { ReactNode } from 'react';
import RightArea from '@/widgets/RightArea';
import LeftArea from '@/widgets/LeftArea';

interface LayoutProps {
  children: ReactNode;
}

const BlogLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <LeftArea></LeftArea>
      <RightArea>{children}</RightArea>
    </>
  );
};

export default React.memo(BlogLayout);
