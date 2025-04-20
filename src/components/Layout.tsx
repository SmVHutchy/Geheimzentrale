import React, { ReactNode } from 'react';
import AnimatedBackground from './AnimatedBackground';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      <main className="relative z-10">{children}</main>
    </div>
  );
};

export default Layout;