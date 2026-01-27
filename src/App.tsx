
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIInsights from './components/pages/AIInsights';
import Analytics from './components/pages/Analytics';
import LandingPage from './components/pages/LandingPage';
import ModernLayout from './components/layout/ModernLayout';
import ModernDashboard from './components/pages/ModernDashboard';
import Settings from './components/pages/Settings';
import AIFeatures from './components/pages/AIFeatures.tsx';
import ContentComparison from './components/pages/ContentComparison.tsx';
import AskAI from './components/pages/AskAI.tsx';
import Reports from './components/pages/Reports.tsx';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/app" element={<ModernLayout />}>
          <Route index element={<ModernDashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="ai-features" element={<AIFeatures />} />
          <Route path="comparison" element={<ContentComparison />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="ask-ai" element={<AskAI />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
