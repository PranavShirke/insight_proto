
import { Outlet } from 'react-router-dom';
import ModernSidebar from './ModernSidebar';
import { Search, Bell, User } from 'lucide-react';

const ModernLayout = () => {
    return (
        <div className="min-h-screen bg-[#020202] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] text-white font-sans selection:bg-brand-primary/30 relative">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay"></div>
            <ModernSidebar />

            <main className="pl-20 lg:pl-64 min-h-screen">
                {/* Header */}
                <header className="h-20 border-b border-white/5 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
                    {/* Search Bar - "Ask AI" */}
                    <div className="flex-1 max-w-xl mx-auto hidden md:block relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="text-dark-muted w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Ask AI anything about your audience..."
                            className="w-full bg-dark-surface border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all shadow-inner"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center">
                            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium text-dark-muted bg-white/5 border border-white/10">
                                CTRL + K
                            </kbd>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4 ml-4">
                        <button className="relative p-2 text-dark-muted hover:text-white hover:bg-white/5 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-accent rounded-full border-2 border-dark-bg animate-pulse"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-white">Alex Morgan</div>
                                <div className="text-xs text-dark-muted">Pro Account</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-secondary to-brand-primary p-[2px]">
                                <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
                                    <User className="text-white w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ModernLayout;
