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
    Flag
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

const ModernSidebar = () => {
    return (
        <aside className="fixed left-4 top-4 bottom-4 w-20 lg:w-64 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-3xl flex flex-col z-50 shadow-2xl shadow-black/50 overflow-hidden">
            {/* Logo Area */}
            <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center shadow-lg shadow-brand-primary/25 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-10 group-hover:translate-y-0 transition-transform duration-500" />
                    <BarChart2 className="text-white w-5 h-5 relative z-10" />
                </div>
                <div className="hidden lg:block ml-4">
                    <h1 className="text-xl font-bold text-white tracking-tight">
                        Social<span className="text-brand-primary">Sense</span>
                    </h1>
                </div>
            </div>

            {/* Back to Home Main Action */}
            <div className="px-6 pb-6">
                <Link to="/" className="flex items-center gap-3 text-xs font-medium text-gray-500 hover:text-white transition-colors pl-2 uppercase tracking-wider">
                    <Home size={14} />
                    <span className="hidden lg:block">Back to Home</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">

                <NavLink
                    to="/app"
                    end
                    className={({ isActive }) => `flex items-center p-3.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    {({ isActive }) => (
                        <>
                            <LayoutDashboard size={20} className={isActive ? 'text-brand-primary' : ''} />
                            <span className="hidden lg:block ml-3 font-medium text-sm">Dashboard</span>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/app/ai-features"
                    className={({ isActive }) => `flex items-center p-3.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    {({ isActive }) => (
                        <>
                            <Sparkles size={20} className={isActive ? 'text-brand-primary' : ''} />
                            <span className="hidden lg:block ml-3 font-medium text-sm">AI Features</span>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/app/comparison"
                    className={({ isActive }) => `flex items-center p-3.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    {({ isActive }) => (
                        <>
                            <Files size={20} className={isActive ? 'text-brand-primary' : ''} />
                            <span className="hidden lg:block ml-3 font-medium text-sm">Comparison</span>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/app/detailed-analysis"
                    className={({ isActive }) => `flex items-center p-3.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    {({ isActive }) => (
                        <>
                            <Zap size={20} className={isActive ? 'text-brand-primary' : ''} />
                            <span className="hidden lg:block ml-3 font-medium text-sm">Deep Analysis</span>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/app/flags"
                    className={({ isActive }) => `flex items-center p-3.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    {({ isActive }) => (
                        <>
                            <Flag size={20} className={isActive ? 'text-brand-primary' : ''} />
                            <span className="hidden lg:block ml-3 font-medium text-sm">Flags</span>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/app/ask-ai"
                    className={({ isActive }) => `flex items-center p-3.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    {({ isActive }) => (
                        <>
                            <MessageSquare size={20} className={isActive ? 'text-brand-primary' : ''} />
                            <span className="hidden lg:block ml-3 font-medium text-sm">Ask AI</span>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/app/reports"
                    className={({ isActive }) => `flex items-center p-3.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    {({ isActive }) => (
                        <>
                            <FileText size={20} className={isActive ? 'text-brand-primary' : ''} />
                            <span className="hidden lg:block ml-3 font-medium text-sm">Reports</span>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/app/business"
                    className={({ isActive }) => `flex items-center p-3.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    {({ isActive }) => (
                        <>
                            <BarChart2 size={20} className={isActive ? 'text-brand-primary' : ''} />
                            <span className="hidden lg:block ml-3 font-medium text-sm">Business</span>
                        </>
                    )}
                </NavLink>
            </nav>

            {/* Footer Items */}
            <div className="p-4 mt-auto">
                <NavLink
                    to="/app/settings"
                    className={({ isActive }) => `flex items-center p-3.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Settings size={20} />
                    <span className="hidden lg:block ml-3 font-medium text-sm">Settings</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default ModernSidebar;
