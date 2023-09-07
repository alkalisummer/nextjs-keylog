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
      <div className='post_header'>
        <span
          className='post_back_arrow'
          onClick={() => router.push(`/${userId}`)}>
          &lt;
        </span>
        <span className='post_header_title'>kyuuun</span>
      </div>
      <div className='post_main'>{children}</div>
    </div>
  );
};

export default PostLayout;
