import React, { useState } from 'react';
import {
    Search,
    Send,
    Heart,
    Eye,
    MessageCircle,
    Share2,
    Users,
    TrendingUp,
    Youtube,
    Instagram,
    Linkedin,
    Globe
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
    { label: 'Total Engagement', value: '127.4K', change: '+12.5%', icon: Heart, color: '#ec4899' }, // Pink
    { label: 'Total Reach', value: '2.4M', change: '+8.3%', icon: Eye, color: '#06b6d4' }, // Cyan
    { label: 'Comments', value: '45.2K', change: '-2.1%', icon: MessageCircle, color: '#a855f7', negative: true }, // Purple
    { label: 'Shares', value: '18.7K', change: '+24.8%', icon: Share2, color: '#3b82f6' }, // Blue
    { label: 'Followers Gained', value: '+12.3K', change: '+15.2%', icon: Users, color: '#8b5cf6' }, // Violet
    { label: 'Engagement Rate', value: '5.2%', change: '+0.8%', icon: TrendingUp, color: '#10b981' }, // Emerald
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
    const [activePlatform, setActivePlatform] = useState('All');

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

                {/* Platform Toggles - Glass Pill */}
                <div className="flex p-1 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                    {['All Platforms', 'Instagram', 'YouTube', 'LinkedIn'].map((platform) => (
                        <button
                            key={platform}
                            onClick={() => setActivePlatform(platform)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${activePlatform === platform
                                    ? 'bg-brand-primary text-black shadow-lg shadow-cyan-500/20'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {platform === 'All Platforms' && <Globe size={14} />}
                                {platform === 'Instagram' && <Instagram size={14} />}
                                {platform === 'YouTube' && <Youtube size={14} />}
                                {platform === 'LinkedIn' && <Linkedin size={14} />}
                                {platform}
                            </div>
                        </button>
                    ))}
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
                    />
                    <button className="p-3 rounded-xl bg-brand-primary hover:bg-brand-secondary transition-colors text-black shadow-lg shadow-cyan-500/20">
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* AI Suggested Queries */}
            <div className="flex flex-wrap gap-3">
                {AI_QUERIES.map((query, i) => (
                    <button key={i} className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-gray-400 hover:border-brand-primary/30 hover:text-white hover:bg-white/10 transition-all">
                        {query}
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {STATS_DATA.map((stat, i) => (
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

            {/* Charts & Insights Split */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto xl:h-[400px]">
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
                            <AreaChart data={CHART_DATA}>
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
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Real-time Analysis</p>
                        </div>

                        <div className="space-y-3 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-sm group-hover:text-brand-primary transition-colors">Reels Dominance</h4>
                                    <span className="text-black text-[10px] font-bold bg-emerald-400 px-1.5 py-0.5 rounded">+320%</span>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Reels are outperforming all other formats.
                                </p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-sm group-hover:text-brand-primary transition-colors">Optimal Schedule</h4>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Post between 6-8 PM for max reach.
                                </p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-sm group-hover:text-brand-primary transition-colors">Keyword 'Tutorial'</h4>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    High positive sentiment detected.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModernDashboard;
