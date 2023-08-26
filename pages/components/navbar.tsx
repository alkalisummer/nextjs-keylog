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
      {status === 'authenticated' ? (
        <button onClick={() => signOut()}>로그아웃</button>
      ) : (
        <div>
          <Link href={'/api/auth/signin'}>로그인</Link>
          <Link href={'/signup'}>회원가입</Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
