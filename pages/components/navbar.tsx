import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const { data: session, status } = useSession();

  return (
    <div className='nav_div'>
      {status === 'authenticated' ? (
        <button onClick={() => signOut()}>Logout</button>
      ) : (
        <div>
          <a href='/api/auth/signin'>Login</a>
          <a href='#'>Sign Up</a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
