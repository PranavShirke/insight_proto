import { useAuth } from '../../context/AuthContext';
import ModernDashboard from './ModernDashboard';
import BusinessDashboard from './BusinessDashboard';

/**
 * Smart Dashboard Router
 * Shows BusinessDashboard for business users and ModernDashboard for influencers
 */
const DashboardRouter = () => {
    const { isBusiness, user } = useAuth();

    // Debug logging
    console.log('[DashboardRouter] user:', user?.username, 'accountType:', user?.accountType, 'isBusiness:', isBusiness);

    if (isBusiness) {
        return <BusinessDashboard />;
    }

    return <ModernDashboard />;
};

export default DashboardRouter;
