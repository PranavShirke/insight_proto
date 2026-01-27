import React, { useState } from 'react';
import {
    Trophy,
    Film,
    Layers,
    Image as ImageIcon,
    Globe,
    Instagram,
    Youtube,
    Linkedin,
    TrendingUp
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';

const PLATFORMS = ['All Platforms', 'Instagram', 'YouTube', 'LinkedIn'];

const PERFORMANCE_DATA = [
    { name: 'Mon', Reels: 4000, Carousels: 2400, Static: 2400 },
    { name: 'Tue', Reels: 3000, Carousels: 1398, Static: 2210 },
    { name: 'Wed', Reels: 2000, Carousels: 9800, Static: 2290 },
    { name: 'Thu', Reels: 2780, Carousels: 3908, Static: 2000 },
    { name: 'Fri', Reels: 1890, Carousels: 4800, Static: 2181 },
    { name: 'Sat', Reels: 2390, Carousels: 3800, Static: 2500 },
    { name: 'Sun', Reels: 3490, Carousels: 4300, Static: 2100 },
];

const COMPARISON_CARDS = [
    {
        type: 'Reels',
        icon: Film,
        engagement: '8.5%',
        reach: '450K',
        posts: 24,
        color: '#a855f7', // Purple
        winner: true
    },
    {
        type: 'Carousels',
        icon: Layers,
        engagement: '5.2%',
        reach: '280K',
        posts: 18,
        color: '#06b6d4', // Cyan
        winner: false
    },
    {
        type: 'Static',
        icon: ImageIcon,
        engagement: '2.8%',
        reach: '150K',
        posts: 35,
        color: '#64748b', // Slate
        winner: false
    }
];

const ContentComparison = () => {
    const [activePlatform, setActivePlatform] = useState('All Platforms');

    return (
        <div className="flex flex-col gap-6 text-white min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-secondary to-brand-primary w-fit">
                        Content Comparison
                    </h1>
                    <p className="text-gray-400 mt-1">Compare performance across Reels, Carousels, and Static posts</p>
                </div>

                {/* Platform Toggles */}
                <div className="flex p-1 bg-[#1e1e2d] rounded-full border border-white/5">
                    {PLATFORMS.map((platform) => (
                        <button
                            key={platform}
                            onClick={() => setActivePlatform(platform)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activePlatform === platform
                                    ? 'bg-[#06b6d4] text-white shadow-lg shadow-cyan-500/20'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {platform === 'All Platforms' && <Globe size={14} />}
                                {platform === 'Instagram' && <Instagram size={14} />}
                                {platform === 'YouTube' && <Youtube size={14} />}
                                {platform === 'LinkedIn' && <Linkedin size={14} />}
                                {platform === 'All Platforms' ? 'All' : platform}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Performing Format Highlight */}
            <div className="bg-[#0f0f1a] border border-white/5 rounded-3xl p-6 flex items-center justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#1e1e2d] border border-white/10 flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-medium">Top Performing Format</p>
                        <h2 className="text-3xl font-bold text-white">Reels</h2>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-bold text-brand-secondary">8.5%</div>
                    <p className="text-gray-400 text-sm">Engagement Rate</p>
                </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COMPARISON_CARDS.map((card, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className={`bg-[#0f0f1a] border ${card.winner ? 'border-brand-secondary/50 shadow-lg shadow-brand-secondary/10' : 'border-white/5'} rounded-3xl p-6 flex flex-col relative group`}
                    >
                        {card.winner && (
                            <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                                <Trophy size={12} /> Winner
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-white/5 text-brand-primary">
                                <card.icon size={24} style={{ color: card.color }} />
                            </div>
                            <h3 className="text-xl font-bold">{card.type}</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Engagement Rate</span>
                                <span className="font-bold text-white">{card.engagement}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Total Reach</span>
                                <span className="font-bold text-white">{card.reach}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Posts Published</span>
                                <span className="font-bold text-white">{card.posts}</span>
                            </div>
                        </div>

                        {/* Progress Bar Visual */}
                        <div className="mt-auto">
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: card.engagement, backgroundColor: card.color }}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Weekly Performance Graph */}
            <div className="bg-[#0f0f1a] border border-white/5 rounded-3xl p-6 h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold mb-1">Weekly Performance Trend</h3>
                        <p className="text-sm text-gray-400">Engagement by format over the past week</p>
                    </div>
                </div>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={PERFORMANCE_DATA} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1e1e2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="Reels" fill="#a855f7" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Carousels" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Static" fill="#64748b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ContentComparison;
