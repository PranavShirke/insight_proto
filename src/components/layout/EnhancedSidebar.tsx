import { useState, useMemo } from 'react';
import {
    LayoutDashboard,
    BarChart2,
    Settings,
    Home,
    FileText,
    Sparkles,
    MessageSquare,
    Files,
    Zap,
    Flag,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Search,
    Brain,
    TrendingUp,
    Building2,
    Target
} from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { logout, isBusiness } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (e) {
            console.error(e);
        }
    };

    // Define nav items based on user type
    const navItems = useMemo(() => {
        if (isBusiness) {
            // Business user navigation
            return [
                { to: '/app', icon: Building2, label: 'Business Hub', end: true },
                { to: '/app/influencer-discovery', icon: Search, label: 'Find Influencers' },
                { to: '/app/ai-matching', icon: Brain, label: 'AI Matching' },
                { to: '/app/predictive-analytics', icon: TrendingUp, label: 'Predictions' },
                { to: '/app/campaigns', icon: Target, label: 'Campaigns' },
                { to: '/app/ask-ai', icon: MessageSquare, label: 'Ask AI' },
                { to: '/app/reports', icon: FileText, label: 'Reports' },
                { to: '/app/business', icon: BarChart2, label: 'ROI Analysis' },
            ];
        }
        // Influencer user navigation (default)
        return [
            { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
            { to: '/app/ai-features', icon: Sparkles, label: 'AI Features' },
            { to: '/app/comparison', icon: Files, label: 'Comparison' },
            { to: '/app/detailed-analysis', icon: Zap, label: 'Deep Analysis' },
            { to: '/app/flags', icon: Flag, label: 'Flags' },
            { to: '/app/ask-ai', icon: MessageSquare, label: 'Ask AI' },
            { to: '/app/reports', icon: FileText, label: 'Reports' },
            { to: '/app/business', icon: BarChart2, label: 'Business' },
        ];
    }, [isBusiness]);

    return (
        <motion.aside
            initial={false}
            animate={{ width: isExpanded ? 280 : 88 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-4 top-4 bottom-4 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col z-50 shadow-2xl shadow-black/50 overflow-hidden"
        >
            {/* Decorative Gradient Border */}
            <div className="absolute inset-0 rounded-3xl p-[1px] pointer-events-none">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 via-transparent to-white/5" />
            </div>

            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-white/5 relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-primary via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-brand-primary/30 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-500" />
                    <BarChart2 className="text-white w-6 h-6 relative z-10" />
                </div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="ml-4"
                        >
                            <h1 className="text-xl font-bold text-white tracking-tight">
                                Social<span className="text-brand-primary">Sense</span>
                            </h1>
                            <p className="text-xs text-gray-500">Analytics Platform</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Back to Home */}
            <div className="px-4 py-4 border-b border-white/5 space-y-3">
                {/* Account Type Badge */}
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${
                    isBusiness 
                        ? 'bg-purple-500/20 border border-purple-500/30' 
                        : 'bg-cyan-500/20 border border-cyan-500/30'
                }`}>
                    {isBusiness ? (
                        <Building2 size={16} className="text-purple-400" />
                    ) : (
                        <LayoutDashboard size={16} className="text-cyan-400" />
                    )}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1"
                            >
                                <div className={`text-xs font-semibold ${isBusiness ? 'text-purple-400' : 'text-cyan-400'}`}>
                                    {isBusiness ? 'Business Mode' : 'Creator Mode'}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                    {isBusiness ? 'Find & manage influencers' : 'Grow your audience'}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                <Link
                    to="/"
                    className={`flex items-center gap-3 text-xs font-medium text-gray-500 hover:text-white transition-all px-3 py-2.5 rounded-xl hover:bg-white/5 ${!isExpanded ? 'justify-center' : ''}`}
                >
                    <Home size={18} />
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="uppercase tracking-wider"
                            >
                                Back to Home
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                            ${isActive
                                ? 'bg-gradient-to-r from-brand-primary/20 to-transparent text-white shadow-lg shadow-brand-primary/10 border border-brand-primary/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                            }
                            ${!isExpanded ? 'justify-center' : ''}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                {/* Active Indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-primary rounded-full" />
                                )}
                                <item.icon
                                    size={20}
                                    className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-brand-primary' : ''}`}
                                />
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="font-medium text-sm whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/5 space-y-2">
                <NavLink
                    to="/app/settings"
                    className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
                        ${isActive
                            ? 'bg-white/10 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                        ${!isExpanded ? 'justify-center' : ''}
                    `}
                >
                    <Settings size={20} />
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="font-medium text-sm"
                            >
                                Settings
                            </motion.span>
                        )}
                    </AnimatePresence>
                </NavLink>

                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 ${!isExpanded ? 'justify-center' : ''}`}
                >
                    <LogOut size={20} />
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="font-medium text-sm"
                            >
                                Log Out
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-dark-surface border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-lg"
            >
                {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
        </motion.aside>
    );
};

export default EnhancedSidebar;
