import React from 'react';
import Navbar from './components/Navbar';
import { useSession } from 'next-auth/react';

const HomePage = () => {
  const session = useSession();

  return (
    <div className='index_div'>
      <Navbar></Navbar>
      <h1>HomePage</h1>
    </div>
  );
};

export default HomePage;
