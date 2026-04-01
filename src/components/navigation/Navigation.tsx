import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SECTION_LINKS = [
  { label: 'WORK',    href: '#work',    path: '/' },
  { label: 'LIBRARY', href: '#library', path: '/' },
];

const ABOUT_LINK = { label: 'ABOUT', path: '/about' };

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav-root border-b border-[rgba(255,255,255,0.05)] ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner flex w-full max-w-[1440px] justify-between pl-6 md:pl-12">
        <Link 
          to="/" 
          className="nav-logo"
          aria-label="Curiosity Inc. Home"
          onClick={() => {
            setIsMenuOpen(false);
            if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          ✦ CURIOSITY INC.
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button 
          className={`menu-trigger md:hidden ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="menu-text">{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
        </button>

        <ul className="nav-links hidden md:flex items-center h-full border-l border-[rgba(255,255,255,0.05)]">
          {SECTION_LINKS.map(link => {
            return (
              <li key={link.label} className="h-full flex items-center border-r border-[rgba(255,255,255,0.05)] px-8">
                {isHome ? (
                  <a
                    href={link.href}
                    aria-label={`Navigate to ${link.label} section`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.querySelector(link.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="nav-link nav-item"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    to={link.path} 
                    aria-label={`Go to ${link.label} on homepage`}
                    className="nav-link nav-item"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
          <li className="h-full flex items-center border-r border-[rgba(255,255,255,0.05)] px-8">
            <Link
              to={ABOUT_LINK.path}
              aria-label="Learn about the Curiosity Inc. studio"
              className={`nav-link nav-item ${location.pathname === '/about' ? 'active' : ''}`}
            >
              {ABOUT_LINK.label}
            </Link>
          </li>
          <li className="h-full flex items-center px-8">
            <Link
              to="/audit"
              className="nav-item"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              Let's talk →
            </Link>
          </li>
        </ul>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" style={{ pointerEvents: 'auto' }}>
          <div className="mobile-menu-content">
            <div className="mobile-menu-links">
              {SECTION_LINKS.map(link => (
                <div key={link.label} className="mobile-menu-item">
                   <Link 
                    to={link.path}
                    className="mobile-menu-link"
                    onClick={() => {
                        setIsMenuOpen(false);
                        const el = document.querySelector(link.href);
                        if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
              <div className="mobile-menu-item">
                <Link to="/about" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>ABOUT</Link>
              </div>
              <div className="mobile-menu-item">
                <Link to="/audit" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>AUDIT</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
