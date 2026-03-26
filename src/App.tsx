import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage, CaseStudyPage, ArticlePage, NotFoundPage } from './pages/index';
import { TestComponents } from './pages/TestComponents';

export function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test-components" element={<TestComponents />} />
        <Route path="/work/:slug" element={<CaseStudyPage />} />
        <Route path="/writing/:slug" element={<ArticlePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
