import { Outlet } from 'react-router-dom';
import EnhancedSidebar from './EnhancedSidebar';
import DashboardBackground from './DashboardBackground';
import { User, Bell, Building2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const ModernLayout = () => {
    const { user, isBusiness } = useAuth();

    // Debug logging
    console.log('[ModernLayout] User:', user?.username, 'AccountType:', user?.accountType, 'isBusiness:', isBusiness);

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-brand-primary/30 relative overflow-hidden">
            {/* Three.js Animated Background */}
            <DashboardBackground />

            {/* Enhanced Sidebar */}
            <EnhancedSidebar />

            {/* Main Content Area */}
            <main className="pl-24 lg:pl-[300px] min-h-screen transition-all duration-300">
                {/* Floating User Info & Notifications */}
                <div className="fixed top-2 right-6 z-50 flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <Bell size={18} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary rounded-full text-[10px] font-bold flex items-center justify-center text-white">3</span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-4 pr-2 py-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
                        {/* Account Type Badge */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            isBusiness 
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        }`}>
                            {isBusiness ? <Building2 size={12} /> : <Sparkles size={12} />}
                            {isBusiness ? 'Business' : 'Creator'}
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-white">{user?.fullName || user?.username || 'User'}</div>
                            <div className="text-xs text-gray-500">{user?.email || 'Pro Account'}</div>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary via-cyan-500 to-blue-600 p-[2px] cursor-pointer"
                        >
                            <div className="w-full h-full rounded-xl bg-dark-bg flex items-center justify-center overflow-hidden">
                                <User className="text-white w-5 h-5" />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 lg:p-8 pt-28 max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ModernLayout;
