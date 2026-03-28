import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SECTION_LINKS = [
  { label: 'WORK',    href: '#work',    path: '/' },
  { label: 'WRITING', href: '#writing', path: '/' },
];

const ABOUT_LINK = { label: 'ABOUT', path: '/about' };

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const options = {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    ['hero', 'work', 'writing'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  return (
    <nav className={`nav-root ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        {/* LOGO */}
        <Link 
          to="/" 
          className="nav-logo"
          onClick={() => isHome && window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ✦ CURIOSITY INC.
        </Link>

        {/* LINKS */}
        <ul className="nav-links">
          {SECTION_LINKS.map(link => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <li key={link.label}>
                {isHome ? (
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.querySelector(link.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.path} className="nav-link">
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
          <li>
            <Link
              to={ABOUT_LINK.path}
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              {ABOUT_LINK.label}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
