import React from 'react';
import Navbar from '../components/Navbar';

const RigthArea = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='right_area'>
      <div className='right_header pr25'>
        <Navbar></Navbar>
      </div>
      {children}
      <div className='right_footer'>
        This app is built with &nbsp;<span className='right_footer_text'>Next.js</span>
      </div>
    </div>
  );
};

export default RigthArea;
