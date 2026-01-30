import { Outlet } from 'react-router-dom';
import ModernSidebar from './ModernSidebar';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ModernLayout = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#020202] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] text-white font-sans selection:bg-brand-primary/30 relative">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay"></div>
            <ModernSidebar />

            <main className="pl-20 lg:pl-64 min-h-screen">
                {/* Header */}
                <header className="h-20 border-b border-white/5 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-end">

                    {/* Right Actions */}
                    <div className="flex items-center gap-4 ml-4">

                        <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-white">{user?.fullName || user?.username}</div>
                                <div className="text-xs text-dark-muted">{user?.email || 'Pro Account'}</div>
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
