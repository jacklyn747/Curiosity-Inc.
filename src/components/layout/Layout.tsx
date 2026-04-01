import { Navigation } from '../navigation/Navigation';
import { Footer } from '../footer/Footer';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-root">
      {/* Skip-to-content — hidden until focused, required for keyboard nav */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to content
      </a>

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
