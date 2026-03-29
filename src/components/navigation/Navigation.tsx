import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const SECTION_LINKS = [
  { label: 'WORK',    href: '#work',    path: '/' },
  { label: 'WRITING', href: '#writing', path: '/' },
];

const ABOUT_LINK = { label: 'ABOUT', path: '/about' };

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
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
    <nav className={`nav-root border-b border-[rgba(255,255,255,0.05)] ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner flex w-full max-w-[1440px] justify-between pl-6 md:pl-12">
        <Link 
          to="/" 
          className="nav-logo"
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
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <li key={link.label} className="h-full flex items-center border-r border-[rgba(255,255,255,0.05)] px-8">
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
          <li className="h-full flex items-center border-r border-[rgba(255,255,255,0.05)] px-8">
            <Link
              to={ABOUT_LINK.path}
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              {ABOUT_LINK.label}
            </Link>
          </li>
        </ul>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        activeSection={activeSection}
        isHome={isHome}
      />
    </nav>
  );
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string | null;
  isHome: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, activeSection, isHome }) => {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const linksRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Animate in
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.5,
        ease: 'power2.out'
      });
      tl.fromTo(linksRef.current, 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        "-=0.2"
      );
    } else {
      document.body.style.overflow = '';
      // Animate out
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.4,
        ease: 'power2.in'
      });
    }
  }, [isOpen]);

  const MENU_ITEMS = [
    { label: 'WORK',    href: '#work',    path: '/' },
    { label: 'WRITING', href: '#writing', path: '/' },
    { label: 'ABOUT',   href: '/about',   path: '/about' },
    { label: 'AUDIT',   href: '/audit',   path: '/audit' },
  ];

  return (
    <div 
      ref={overlayRef}
      className="mobile-menu-overlay"
      style={{ opacity: 0, pointerEvents: 'none' }}
    >
      <div className="mobile-menu-content">
        <div className="mobile-menu-links">
          {MENU_ITEMS.map((item, i) => {
            const isActive = isHome 
              ? activeSection === item.href.replace('#', '')
              : location.pathname === item.path;

            const isExternal = !item.href.startsWith('#');

            return (
              <div 
                key={item.label}
                ref={el => { linksRef.current[i] = el; }}
                className="mobile-menu-item"
              >
                {(!isExternal && isHome) ? (
                  <a 
                    href={item.href}
                    className={`mobile-menu-link ${isActive ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      const el = document.querySelector(item.href);
                      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 500);
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link 
                    to={item.path}
                    className={`mobile-menu-link ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="mobile-menu-footer">
          <p className="font-mono text-[9px] uppercase tracking-widest opacity-40">
            © 2026 CURIOSITY INC. LABORATORY
          </p>
        </div>
      </div>
    </div>
  );
};
