'use client';
import '../../styles/Post.css';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className='post_area'>
      <div className='post_header'>
        <span
          className='post_back_arrow'
          onClick={() => router.push('/')}>
          &lt;
        </span>
        <span className='post_header_title'>kyuuun</span>
      </div>
      <div className='post_main'>{children}</div>
    </div>
  );
}
