import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Analytics from './components/pages/Analytics';
import LandingPage from './components/pages/LandingPage';
import ModernLayout from './components/layout/ModernLayout';
import DashboardRouter from './components/pages/DashboardRouter';
import Settings from './components/pages/Settings';
import AIFeatures from './components/pages/AIFeatures.tsx';
import ContentComparison from './components/pages/ContentComparison.tsx';
import AskAI from './components/pages/AskAI.tsx';
import Reports from './components/pages/Reports.tsx';
import DetailedAnalysis from './components/pages/DetailedAnalysis.tsx';
import Login from './components/pages/Login';
import Flags from './components/pages/Flags'; // Import Flags Page
import BusinessAnalysis from './components/pages/BusinessAnalysis'; // Import Business Analysis Page
import { OnboardingFlow } from './components/pages/OnboardingFlow'; // Import New Onboarding Flow
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/auth/RequireAuth';
// Business-specific pages
import InfluencerDiscovery from './components/pages/InfluencerDiscovery';
import AIMatching from './components/pages/AIMatching';
import PredictiveAnalytics from './components/pages/PredictiveAnalytics';
import BusinessDashboard from './components/pages/BusinessDashboard';
import CampaignManagement from './components/pages/CampaignManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<OnboardingFlow />} />

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/app" element={<ModernLayout />}>
              <Route index element={<DashboardRouter />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="ai-features" element={<AIFeatures />} />
              <Route path="comparison" element={<ContentComparison />} />
              <Route path="detailed-analysis" element={<DetailedAnalysis />} />
              <Route path="ask-ai" element={<AskAI />} />
              <Route path="reports" element={<Reports />} />
              <Route path="business" element={<BusinessAnalysis />} />
              <Route path="flags" element={<Flags />} />
              <Route path="settings" element={<Settings />} />
              {/* Business-specific routes */}
              <Route path="influencer-discovery" element={<InfluencerDiscovery />} />
              <Route path="ai-matching" element={<AIMatching />} />
              <Route path="predictive-analytics" element={<PredictiveAnalytics />} />
              <Route path="business-dashboard" element={<BusinessDashboard />} />
              <Route path="campaigns" element={<CampaignManagement />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
