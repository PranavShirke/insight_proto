
import { useState, useEffect } from 'react';
import { User, Mail, Bell, Globe, Instagram, Linkedin, Twitter, Facebook, Save, Youtube } from 'lucide-react';
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

    const [inputs, setInputs] = useState({
        instagram: '',
        twitter: '',
        linkedin: '',
        facebook: ''
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
            window.location.href = 'https://localhost:5000/auth/google';
            return;
        }
        if (platform === 'facebook') {
            window.location.href = 'https://localhost:5000/auth/facebook'; // Will default to facebook state
            return;
        }
        if (platform === 'instagram') {
            window.location.href = 'https://localhost:5000/auth/instagram';
            return;
        }
        if (platform === 'twitter') {
            window.location.href = 'https://localhost:5000/auth/twitter';
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
                    handle: !current.connected ? (inputs[platform as keyof typeof inputs] || '@new_user') : ''
                }
            };
        });
    };

    const handleInputChange = (platform: string, value: string) => {
        setInputs(prev => ({
            ...prev,
            [platform]: value
        }));
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
                            <input type="text" defaultValue="Alex Morgan" className="bg-transparent border-none text-white focus:outline-none w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-dark-muted block">Email Address</label>
                        <div className="flex items-center px-4 py-3 bg-dark-bg border border-white/5 rounded-xl">
                            <Mail size={18} className="text-dark-muted mr-3" />
                            <input type="email" defaultValue="alex@nexusai.com" className="bg-transparent border-none text-white focus:outline-none w-full" />
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
                            <p className="text-xs text-dark-muted mt-1">Link your social media profiles to sync analytics.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {/* YouTube */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-dark-bg border border-white/5 rounded-xl gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center shrink-0">
                                <Youtube className="text-red-600 w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-white">YouTube</h3>
                                {connectedAccounts.youtube.connected ? (
                                    <p className="text-xs text-green-400 flex items-center gap-1">Connected as {connectedAccounts.youtube.handle}</p>
                                ) : (
                                    <p className="text-xs text-dark-muted">Connect channel for analytics</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleConnect('youtube')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${connectedAccounts.youtube.connected
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'
                                }`}
                        >
                            {connectedAccounts.youtube.connected ? 'Disconnect' : 'Connect Account'}
                        </button>
                    </div>

                    {/* Instagram */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-dark-bg border border-white/5 rounded-xl gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0">
                                <Instagram className="text-pink-500 w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-white">Instagram</h3>
                                {connectedAccounts.instagram.connected ? (
                                    <p className="text-xs text-green-400 flex items-center gap-1">Connected as {connectedAccounts.instagram.handle}</p>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Enter profile URL or handle"
                                        className="mt-1 bg-dark-surface border border-white/10 rounded px-2 py-1 text-xs text-white placeholder:text-dark-muted w-full md:w-64 focus:outline-none focus:border-pink-500/50 transition-colors"
                                        value={inputs.instagram}
                                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleConnect('instagram')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${connectedAccounts.instagram.connected
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'
                                }`}
                        >
                            {connectedAccounts.instagram.connected ? 'Disconnect' : 'Connect Account'}
                        </button>
                    </div>

                    {/* Twitter / X */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-dark-bg border border-white/5 rounded-xl gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center shrink-0">
                                <Twitter className="text-blue-400 w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-white">Twitter / X</h3>
                                {connectedAccounts.twitter.connected ? (
                                    <p className="text-xs text-green-400 flex items-center gap-1">Connected as {connectedAccounts.twitter.handle}</p>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Enter profile URL or handle"
                                        className="mt-1 bg-dark-surface border border-white/10 rounded px-2 py-1 text-xs text-white placeholder:text-dark-muted w-full md:w-64 focus:outline-none focus:border-blue-400/50 transition-colors"
                                        value={inputs.twitter}
                                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleConnect('twitter')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${connectedAccounts.twitter.connected
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'
                                }`}
                        >
                            {connectedAccounts.twitter.connected ? 'Disconnect' : 'Connect Account'}
                        </button>
                    </div>

                    {/* LinkedIn */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-dark-bg border border-white/5 rounded-xl gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center shrink-0">
                                <Linkedin className="text-blue-600 w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-white">LinkedIn</h3>
                                {connectedAccounts.linkedin.connected ? (
                                    <p className="text-xs text-green-400 flex items-center gap-1">Connected as {connectedAccounts.linkedin.handle}</p>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Enter profile URL or handle"
                                        className="mt-1 bg-dark-surface border border-white/10 rounded px-2 py-1 text-xs text-white placeholder:text-dark-muted w-full md:w-64 focus:outline-none focus:border-blue-600/50 transition-colors"
                                        value={inputs.linkedin}
                                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleConnect('linkedin')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${connectedAccounts.linkedin.connected
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'
                                }`}
                        >
                            {connectedAccounts.linkedin.connected ? 'Disconnect' : 'Connect Account'}
                        </button>
                    </div>

                    {/* Facebook */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-dark-bg border border-white/5 rounded-xl gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Facebook className="text-blue-500 w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-white">Facebook</h3>
                                {connectedAccounts.facebook.connected ? (
                                    <p className="text-xs text-green-400 flex items-center gap-1">Connected as {connectedAccounts.facebook.handle}</p>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Enter profile URL or handle"
                                        className="mt-1 bg-dark-surface border border-white/10 rounded px-2 py-1 text-xs text-white placeholder:text-dark-muted w-full md:w-64 focus:outline-none focus:border-blue-500/50 transition-colors"
                                        value={inputs.facebook}
                                        onChange={(e) => handleInputChange('facebook', e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleConnect('facebook')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${connectedAccounts.facebook.connected
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'
                                }`}
                        >
                            {connectedAccounts.facebook.connected ? 'Disconnect' : 'Connect Account'}
                        </button>
                    </div>
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
