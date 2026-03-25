import React from 'react';
import { Navigation } from '../navigation/Navigation';
import { Footer } from '../footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-root">
      {/* Navigation Layer */}
      <Navigation />

      {/* Main content area */}
      <main id="main-content">
        {children}
      </main>

      {/* Footer Layer */}
      <Footer />
    </div>
  );
}
