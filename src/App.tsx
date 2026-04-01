import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/transitions/ScrollToTop';

// Code-split all routes — Three.js and heavy case studies stay out of the main bundle
const HomePage        = lazy(() => import('./pages/index').then(m => ({ default: m.HomePage })));
const CaseStudyPage   = lazy(() => import('./pages/index').then(m => ({ default: m.CaseStudyPage })));
const ArticlePage     = lazy(() => import('./pages/ArticlePage').then(m => ({ default: m.ArticlePage })));
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage'));
const TestComponents  = lazy(() => import('./pages/TestComponents').then(m => ({ default: m.TestComponents })));
const AuditRequest    = lazy(() => import('./pages/AuditRequest').then(m => ({ default: m.AuditRequest })));
const AboutPage       = lazy(() => import('./pages/About'));

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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
}

export default App;
