import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const { data: session, status } = useSession();

  if (status === 'authenticated') {
    console.log('session', session);
  }

  return (
    <div className='nav_div'>
      <span className='nav_logo_btn'>keylog</span>
      {status === 'authenticated' ? (
        <button onClick={() => signOut()}>로그아웃</button>
      ) : (
        <div>
          <Link
            href={'/login'}
            className='nav_login_btn'>
            로그인
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
