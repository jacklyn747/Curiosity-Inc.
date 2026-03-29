import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { setLenis } from './lib/lenis';
import { Layout } from './components/layout/Layout';
import { PageTransition } from './components/transitions/PageTransition';

// Code-split all routes — Three.js and heavy case studies stay out of the main bundle
const HomePage        = lazy(() => import('./pages/index').then(m => ({ default: m.HomePage })));
const CaseStudyPage   = lazy(() => import('./pages/index').then(m => ({ default: m.CaseStudyPage })));
const ArticlePage     = lazy(() => import('./pages/ArticlePage').then(m => ({ default: m.ArticlePage })));
const NotFoundPage    = lazy(() => import('./pages/index').then(m => ({ default: m.NotFoundPage })));
const TestComponents  = lazy(() => import('./pages/TestComponents').then(m => ({ default: m.TestComponents })));
const AuditRequest    = lazy(() => import('./pages/AuditRequest').then(m => ({ default: m.AuditRequest })));
const AboutPage       = lazy(() => import('./pages/About').then(m => ({ default: m.AboutPage })));

// Minimal loading fallback — void screen, no flash
function PageFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-void)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Loading"
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.15em',
          color: 'var(--color-context-dim)',
          textTransform: 'uppercase',
        }}
      >
        ✦
      </span>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/"                element={<HomePage />} />
          <Route path="/audit"           element={<AuditRequest />} />
          <Route path="/about"           element={<AboutPage />} />
          <Route path="/test-components" element={<TestComponents />} />
          <Route path="/work/:slug"      element={<CaseStudyPage />} />
          <Route path="/writing/:slug"   element={<ArticlePage />} />
          <Route path="*"               element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

import { ScrollToTop } from './components/transitions/ScrollToTop';

function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // autoRaf: false — GSAP ticker drives the loop, not Lenis's own rAF
    const lenis = new Lenis({ lerp: 0.08, duration: 1.2, autoRaf: false });
    setLenis(lenis);

    // Capture tickerFn in a const so the SAME ref is passed to both add and remove
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      setLenis(null);
      gsap.ticker.remove(tickerFn);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      {/* PageTransition wraps AppRoutes so its context is available to all children */}
      <PageTransition>
        <AppRoutes />
      </PageTransition>
      <SoftCursor />
      <div className="noise-overlay" aria-hidden="true" />
    </Router>
  );
}

/**
 * A minimal, high-fidelity cursor orb that provides kinetic feedback 
 * on desktop hover interactions.
 */
function SoftCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power3.out'
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div 
      ref={cursorRef}
      className="soft-cursor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '40px',
        height: '40px',
        margin: '-20px 0 0 -20px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-insight)',
        opacity: 0.08,
        pointerEvents: 'none',
        zIndex: 9999,
        filter: 'blur(10px)',
      }}
    />
  );
}

export default App;
