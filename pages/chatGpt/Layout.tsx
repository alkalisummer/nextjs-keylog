import React, { ReactNode } from 'react';
import '@/styles/ChatGpt.css';

interface LayoutProps {
  children: ReactNode;
}

const GptLayout: React.FC<LayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default GptLayout;
