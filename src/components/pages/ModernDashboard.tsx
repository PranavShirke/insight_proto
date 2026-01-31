import { useState, useEffect } from 'react';
import { useInsights } from '../../hooks/useInsights';
import { useAuth } from '../../context/AuthContext';
import {
    Loader, RefreshCw, Search, Globe, Send,
    Heart,
    Eye,
    MessageCircle,
    Share2,
    Users,
    TrendingUp,
    Youtube,
    Instagram
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

const STATS_DATA = [
    { label: 'Total Engagement', value: '0', change: '+12.5%', icon: Heart, color: '#ec4899' }, // Pink
    { label: 'Total Reach', value: '0', change: '+8.3%', icon: Eye, color: '#06b6d4' }, // Cyan
    { label: 'Total Comments', value: '0', change: '-2.1%', icon: MessageCircle, color: '#a855f7', negative: true }, // Purple
    { label: 'Avg Engagement Rate', value: '0%', change: '+0.8%', icon: TrendingUp, color: '#10b981' }, // Emerald
    { label: 'Total Followers', value: '0', change: '+15.2%', icon: Users, color: '#8b5cf6' }, // Violet
    { label: 'Total Posts', value: '0', change: '+24.8%', icon: Share2, color: '#3b82f6' }, // Blue
];

const CHART_DATA = [
    { name: 'Jan', engagement: 4000, reach: 2400 },
    { name: 'Feb', engagement: 3000, reach: 1398 },
    { name: 'Mar', engagement: 2000, reach: 9800 },
    { name: 'Apr', engagement: 2780, reach: 3908 },
    { name: 'May', engagement: 1890, reach: 4800 },
    { name: 'Jun', engagement: 2390, reach: 3800 },
    { name: 'Jul', engagement: 3490, reach: 4300 },
];

const AI_QUERIES = [
    "Which post performed best last month?",
    "What format gives highest engagement?",
    "Compare my Reels vs Carousels performance",
    "When should I post for maximum reach?"
];

const ModernDashboard = () => {
    const { user } = useAuth();
    const [activePlatform, setActivePlatform] = useState('All');

    // Dynamic Filter Options
    const platformOptions = ['All'];
    if (user?.connections?.instagram) platformOptions.push('Instagram');
    if (user?.connections?.facebook) platformOptions.push('Facebook');
    if (user?.connections?.youtube) platformOptions.push('Youtube');
    if (user?.connections?.twitter) platformOptions.push('Twitter');

    const { data, loading, refresh, saveAiAnalysis } = useInsights(); // Added saveAiAnalysis

    // AI State
    const [aiQuery, setAiQuery] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<any>(data?.aiAnalysis || null); // Note: data might be null initially

    // Watch for persisted AI analysis
    useEffect(() => {
        if (data?.aiAnalysis) {
            setAiResponse(data.aiAnalysis);
        }
    }, [data]);

    // Default Stats (Mock) - Used if no data or initial load
    const [displayStats, setDisplayStats] = useState<any[] | null>(null);

    useEffect(() => {
        if (!data) {
            setDisplayStats(null);
            return;
        }

        // Clone structure but preserve icons
        const newStats = STATS_DATA.map(stat => ({ ...stat }));

        // Reset values
        newStats.forEach((s: any) => s.value = '0');

        let totalEngagement = 0;
        let totalReach = 0;
        let totalComments = 0;
        let totalFollowers = 0;
        let totalPosts = 0;

        // Filter Logic
        const showYoutube = activePlatform === 'All' || activePlatform === 'Youtube';
        const showInstagram = activePlatform === 'All' || activePlatform === 'Instagram';
        const showFacebook = activePlatform === 'All' || activePlatform === 'Facebook';
        const showTwitter = activePlatform === 'All' || activePlatform === 'Twitter';

        if (data.youtube && showYoutube) {
            totalReach += parseInt(data.youtube.views || 0);
            totalFollowers += parseInt(data.youtube.subscribers || 0);
            totalPosts += parseInt(data.youtube.videos || 0);
            totalEngagement += (data.youtube.engagement || 0);
            totalComments += (data.youtube.totalComments || 0);
        }

        if (data.instagram && showInstagram) {
            totalFollowers += (data.instagram.followers || 0);
            totalPosts += (data.instagram.posts || 0);
            totalEngagement += (data.instagram.engagement || 0);
            totalComments += (data.instagram.totalComments || 0);

            // Reach logic
            if (data.instagram.insights) {
                const reachMetric = data.instagram.insights.find((i: any) => i.name === 'reach');
                if (reachMetric && reachMetric.values?.[0]?.value) {
                    totalReach += reachMetric.values[0].value;
                } else {
                    totalReach += (data.instagram.followers || 0);
                }
            } else {
                totalReach += (data.instagram.followers || 0);
            }
        }

        if (data.facebook && showFacebook) {
            totalFollowers += (data.facebook.followers || 0);
            totalPosts += (data.facebook.posts || 0);
            totalEngagement += (data.facebook.engagement || 0);
            totalComments += (data.facebook.totalComments || 0);
            totalReach += (data.facebook.followers || 0); // Proxy
        }

        if (data.twitter && showTwitter) {
            totalFollowers += (data.twitter.followers || 0);
            totalPosts += (data.twitter.posts || 0);
            totalEngagement += (data.twitter.engagement || 0);
            totalComments += (data.twitter.totalComments || 0);
            totalReach += (data.twitter.followers || 0); // Proxy
        }

        const engagementRate = totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(2) : '0';

        newStats[0].value = Intl.NumberFormat('en-US', { notation: "compact" }).format(totalEngagement);
        newStats[1].value = Intl.NumberFormat('en-US', { notation: "compact" }).format(totalReach);
        newStats[2].value = Intl.NumberFormat('en-US', { notation: "compact" }).format(totalComments);
        newStats[3].value = engagementRate + '%';
        newStats[4].value = Intl.NumberFormat('en-US', { notation: "compact" }).format(totalFollowers);
        newStats[5].value = Intl.NumberFormat('en-US', { notation: "compact" }).format(totalPosts);

        setDisplayStats(newStats);

        // Auto-Trigger AI if data exists but no AI response (check both state and data prop to avoid race condition)
        if ((data.youtube || data.instagram || data.facebook || data.twitter) && !aiResponse && !data.aiAnalysis && !aiLoading) {
            const customQuery = "Generate a summary of my performance based on these stats.";
            setAiQuery(customQuery);
            // We need to call the function, but state update is async. 
            // Better to call a refactored function directly.
            triggerAI(customQuery);
        }

    }, [data, activePlatform]);

    const handleAskAI = () => triggerAI(aiQuery);

    const triggerAI = async (queryText: string) => {
        if (!queryText) return;
        setAiLoading(true);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    stats: data || { note: "Using mock stats", stats: displayStats },
                    query: queryText
                })
            });
            const json = await res.json();
            setAiResponse(json);
            if (saveAiAnalysis) saveAiAnalysis(json);
        } catch (e) {
            console.error(e);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 text-white min-h-screen">

            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-1">
                        Home
                    </h1>
                    <p className="text-gray-400 font-medium">Welcome back, Creator</p>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        onClick={refresh}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>

                    {/* Platform Filters */}
                    <div className="flex gap-2">
                        {platformOptions.map((platform) => (
                            <button
                                key={platform}
                                onClick={() => setActivePlatform(platform)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activePlatform === platform
                                    ? 'bg-white/10 text-white border border-white/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    {platform === 'All' && <Globe size={14} />}
                                    {platform === 'Instagram' && <Instagram size={14} />}
                                    {platform === 'Youtube' && <Youtube size={14} />}
                                    {platform === 'Twitter' && <Send size={14} className="rotate-[-45deg]" />}
                                    {platform}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Search Bar - Minimal Glass */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-2 flex items-center gap-4 shadow-2xl">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                        <Search className="text-white w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Ask anything about your social media performance..."
                        className="w-full bg-transparent border-none focus:ring-0 text-xl font-light placeholder-gray-600 text-white h-full"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                    />
                    <button
                        onClick={handleAskAI}
                        disabled={aiLoading}
                        className="p-3 rounded-xl bg-brand-primary hover:bg-brand-secondary transition-colors text-black shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                    >
                        {aiLoading ? <Loader className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* AI Suggested Queries */}
            <div className="flex flex-wrap gap-3">
                {AI_QUERIES.map((query, i) => (
                    <button
                        key={i}
                        onClick={() => setAiQuery(query)}
                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-gray-400 hover:border-brand-primary/30 hover:text-white hover:bg-white/10 transition-all"
                    >
                        {query}
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            {!displayStats ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No Data Connected</h2>
                    <p className="text-gray-400 max-w-md mb-6">Connect your Instagram and YouTube accounts to see real-time insights and unlock AI-powered analysis.</p>
                    <a href="/app/settings" className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-secondary text-black font-bold transition-all shadow-lg shadow-cyan-500/20">
                        Connect Accounts
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {displayStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -2 }}
                            className="bg-white/5 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[160px] relative overflow-hidden group hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <stat.icon size={16} className="text-white" />
                                </div>
                                {stat.change && (
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded bg-black/20 ${stat.negative ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                                <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mt-1">{stat.label}</p>
                            </div>

                            {/* Ambient Glow */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tr from-transparent to-brand-primary/10 rounded-full blur-2xl group-hover:bg-brand-primary/20 transition-colors" />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Charts & Insights Split */}
            {displayStats && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto xl:h-[500px]">
                    {/* Engagement Overview Chart */}
                    <div className="xl:col-span-2 bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Engagement Overview</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="w-2 h-2 rounded-full bg-brand-primary"></span> Live Data
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0 relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={aiResponse?.chart_data || CHART_DATA}>
                                    <defs>
                                        <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="engagement" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorEng)" />
                                    <Area type="monotone" dataKey="reach" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReach)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insights Panel - Glass Stack */}
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex-1 flex flex-col relative overflow-hidden">
                            <div className="relative z-10 mb-6">
                                <h3 className="font-bold text-xl">AI Insights</h3>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
                                    {aiResponse ? "Analysis Complete" : "Real-time Analysis"}
                                </p>
                            </div>

                            <div className="space-y-3 relative z-10 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">

                                {aiLoading && (
                                    <div className="text-center py-10">
                                        <Loader className="animate-spin w-8 h-8 text-brand-primary mx-auto mb-2" />
                                        <p className="text-xs text-brand-primary">Analyzing your data...</p>
                                    </div>
                                )}

                                {!aiLoading && aiResponse && aiResponse.insights ? (
                                    <>
                                        {aiResponse.summary && (
                                            <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-xl mb-4">
                                                <p className="text-xs text-brand-primary italic">"{aiResponse.summary}"</p>
                                            </div>
                                        )}
                                        {aiResponse.insights.map((insight: any, i: number) => (
                                            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-sm group-hover:text-brand-primary transition-colors">{insight.title}</h4>
                                                    {insight.sentiment === 'positive' && <span className="text-black text-[10px] font-bold bg-emerald-400 px-1.5 py-0.5 rounded">Good</span>}
                                                    {insight.sentiment === 'negative' && <span className="text-black text-[10px] font-bold bg-red-400 px-1.5 py-0.5 rounded">Bad</span>}
                                                </div>
                                                <p className="text-xs text-gray-400 leading-relaxed">
                                                    {insight.description}
                                                </p>
                                            </div>
                                        ))}

                                        {/* Actionable Tips Section */}
                                        {aiResponse.actionable_tips && (
                                            <div className="mt-6">
                                                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                                    <TrendingUp size={14} className="text-brand-primary" />
                                                    Actionable Tips
                                                </h4>
                                                <ul className="space-y-2">
                                                    {aiResponse.actionable_tips.map((tip: string, i: number) => (
                                                        <li key={i} className="text-xs text-gray-400 flex gap-2">
                                                            <span className="text-brand-primary">•</span>
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                ) : !aiLoading && (
                                    <div className="text-center py-10 opacity-50">
                                        <p className="text-sm">Ask a question to generate insights.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModernDashboard;
