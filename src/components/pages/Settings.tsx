
import { useState, useEffect } from 'react';
import { User, Mail, Bell, Globe, Instagram, Twitter, Facebook, Save, Youtube } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [connectedAccounts, setConnectedAccounts] = useState({
        instagram: { connected: false, handle: '' },
        twitter: { connected: false, handle: '' },
        linkedin: { connected: false, handle: '' }, // Demo
        facebook: { connected: false, handle: '' },
        youtube: { connected: false, handle: '' }
    });



    useEffect(() => {
        if (user) {
            setConnectedAccounts(prev => ({
                ...prev,
                youtube: {
                    connected: !!user.connections?.youtube,
                    handle: user.connections?.youtube ? (user.fullName || 'Connected') : ''
                },
                instagram: {
                    connected: !!user.connections?.instagram,
                    handle: user.connections?.instagram ? 'Connected' : ''
                },
                facebook: {
                    connected: !!user.connections?.facebook,
                    handle: user.connections?.facebook ? 'Connected' : ''
                },
                twitter: {
                    connected: !!user.connections?.twitter,
                    handle: user.connections?.twitter ? 'Connected' : ''
                }
            }));
        }

        // Optional: clear query params to keep URL clean
        const params = new URLSearchParams(window.location.search);
        if (params.get('connected')) {
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [user]);

    const handleConnect = (platform: string) => {
        if (platform === 'youtube') {
            window.location.href = '/auth/google';
            return;
        }
        if (platform === 'facebook') {
            window.location.href = '/auth/facebook'; // Will default to facebook state
            return;
        }
        if (platform === 'instagram') {
            window.location.href = '/auth/instagram';
            return;
        }
        if (platform === 'twitter') {
            window.location.href = '/auth/twitter';
            return;
        }

        // Fallback for others (demo only)
        setConnectedAccounts(prev => {
            const current = prev[platform as keyof typeof connectedAccounts];
            return {
                ...prev,
                [platform]: {
                    ...current,
                    connected: !current.connected,
                    handle: !current.connected ? '@new_user' : ''
                }
            };
        });
    };



    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-dark-muted">Manage your profile, preferences, and integrations.</p>
            </div>

            {/* Profile Section */}
            <section className="bg-dark-surface border border-white/5 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                        <User className="text-brand-primary w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Profile Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-dark-muted block">Full Name</label>
                        <div className="flex items-center px-4 py-3 bg-dark-bg border border-white/5 rounded-xl">
                            <User size={18} className="text-dark-muted mr-3" />
                            <input type="text" defaultValue={user?.fullName || ''} className="bg-transparent border-none text-white focus:outline-none w-full" placeholder="Your Name" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-dark-muted block">Email Address</label>
                        <div className="flex items-center px-4 py-3 bg-dark-bg border border-white/5 rounded-xl">
                            <Mail size={18} className="text-dark-muted mr-3" />
                            <input type="email" defaultValue={user?.email || ''} className="bg-transparent border-none text-white focus:outline-none w-full" placeholder="your@email.com" readOnly />
                        </div>
                    </div>
                </div>
            </section>

            {/* Connected Accounts Section */}
            <section className="bg-dark-surface border border-white/5 rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                            <Globe className="text-brand-secondary w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Connected Accounts</h2>
                            <p className="text-xs text-dark-muted mt-1">Manage your organization's social profiles.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Helper to render platform section */}
                    {['youtube', 'instagram', 'twitter', 'facebook'].map(platform => {
                        const icon = platform === 'youtube' ? <Youtube className="text-red-600 w-5 h-5" /> :
                            platform === 'instagram' ? <Instagram className="text-pink-500 w-5 h-5" /> :
                                platform === 'twitter' ? <Twitter className="text-blue-400 w-5 h-5" /> :
                                    <Facebook className="text-blue-600 w-5 h-5" />;

                        const bg = platform === 'youtube' ? 'bg-red-600/10' :
                            platform === 'instagram' ? 'bg-pink-500/10' :
                                platform === 'twitter' ? 'bg-blue-400/10' :
                                    'bg-blue-600/10';

                        const accounts = user?.connections?.all?.filter((a: any) => a.platform === platform) || [];

                        return (
                            <div key={platform} className="bg-dark-bg border border-white/5 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-white capitalize flex items-center gap-2">
                                        {icon} {platform}
                                    </h3>
                                    <button
                                        onClick={() => handleConnect(platform)}
                                        className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                                    >
                                        + Add {platform === 'youtube' ? 'Channel' : 'Account'}
                                    </button>
                                </div>

                                {accounts.length > 0 ? (
                                    <div className="space-y-2">
                                        {accounts.map((acc: any) => (
                                            <div key={acc.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
                                                        {icon}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{acc.username}</p>
                                                        <p className="text-xs text-green-400">Connected</p>
                                                    </div>
                                                </div>
                                                {/* Future: Add Disconnect Button here */}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-dark-muted italic">No accounts connected.</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Preferences Section */}
            <section className="bg-dark-surface border border-white/5 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center">
                        <Bell className="text-brand-accent w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Preferences</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">Email Notifications</p>
                            <p className="text-xs text-dark-muted">Receive weekly reports and alerts.</p>
                        </div>
                        <div className="w-12 h-6 bg-brand-primary rounded-full relative cursor-pointer">
                            <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">AI Suggestions</p>
                            <p className="text-xs text-dark-muted">Auto-generate content ideas based on trends.</p>
                        </div>
                        <div className="w-12 h-6 bg-brand-primary rounded-full relative cursor-pointer">
                            <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all">
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

        </div>
    );
};

export default Settings;
