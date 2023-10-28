import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

const PostLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { userId } = router.query;
  return (
    <div className='post_area'>
      <div className='post_main'>{children}</div>
    </div>
  );
};

export default PostLayout;
