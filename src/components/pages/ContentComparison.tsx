import { useState, useEffect } from 'react';
import {
    Trophy,
    Film,
    Layers,
    Image as ImageIcon,
    Globe,
    Instagram,
    Youtube,
    Linkedin,
    Loader
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
import { useInsights } from '../../hooks/useInsights';

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
    const { data, loading } = useInsights();
    const [activePlatform, setActivePlatform] = useState('All Platforms');

    // State for dynamic data
    const [performanceData, setPerformanceData] = useState(PERFORMANCE_DATA);
    const [comparisonCards, setComparisonCards] = useState(COMPARISON_CARDS);
    const [topFormat, setTopFormat] = useState({ type: 'Reels', engagement: '8.5%' });

    useEffect(() => {
        if (data?.instagram?.recent_posts) {
            const posts = data.instagram.recent_posts;

            // 1. Process Chart Data (Weekly Trend)
            const daysMap = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 };
            const newChartData = [
                { name: 'Mon', Reels: 0, Carousels: 0, Static: 0 },
                { name: 'Tue', Reels: 0, Carousels: 0, Static: 0 },
                { name: 'Wed', Reels: 0, Carousels: 0, Static: 0 },
                { name: 'Thu', Reels: 0, Carousels: 0, Static: 0 },
                { name: 'Fri', Reels: 0, Carousels: 0, Static: 0 },
                { name: 'Sat', Reels: 0, Carousels: 0, Static: 0 },
                { name: 'Sun', Reels: 0, Carousels: 0, Static: 0 },
            ];

            // 2. Process Cards Data
            const stats = {
                VIDEO: { type: 'Reels', icon: Film, count: 0, engagement: 0, color: '#a855f7' },
                CAROUSEL_ALBUM: { type: 'Carousels', icon: Layers, count: 0, engagement: 0, color: '#06b6d4' },
                IMAGE: { type: 'Static', icon: ImageIcon, count: 0, engagement: 0, color: '#64748b' }
            };

            posts.forEach((post: any) => {
                const date = new Date(post.timestamp);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const engagement = (post.likes || 0) + (post.comments || 0);
                const type = post.type as keyof typeof stats;

                // Update Chart
                if (daysMap.hasOwnProperty(dayName)) {
                    const index = daysMap[dayName as keyof typeof daysMap];
                    if (type === 'VIDEO') newChartData[index].Reels += engagement;
                    else if (type === 'CAROUSEL_ALBUM') newChartData[index].Carousels += engagement;
                    else if (type === 'IMAGE') newChartData[index].Static += engagement;
                }

                // Update Stats
                if (stats[type]) {
                    stats[type].count += 1;
                    stats[type].engagement += engagement;
                }
            });

            setPerformanceData(newChartData);

            // 3. Create Comparison Cards
            const totalEngagement = Object.values(stats).reduce((acc, curr) => acc + curr.engagement, 0);

            const newCards = Object.values(stats).map(stat => {
                // Using total followers as base for "Reach" proxy if raw reach unavailable per post
                // For rate: (Total Engagement for Type / Total Engagement All Types) * 100 ? Or per post?
                // Let's use simple share of total engagement for now, or just raw numbers.
                // The original design had %, let's do share of total engagement.
                const share = totalEngagement > 0 ? ((stat.engagement / totalEngagement) * 100).toFixed(1) + '%' : '0%';

                return {
                    type: stat.type,
                    icon: stat.icon,
                    engagement: share, // Share of voice
                    reach: Intl.NumberFormat('en-US', { notation: "compact" }).format(stat.engagement), // Using total engagement interactions as "Reach" proxy for now
                    posts: stat.count,
                    color: stat.color,
                    winner: false, // will set later
                    rawEngagement: stat.engagement
                };
            });

            // Determine Winner
            const winner = newCards.reduce((prev, current) => (prev.rawEngagement > current.rawEngagement) ? prev : current);
            newCards.forEach(c => c.winner = c.type === winner.type);

            setComparisonCards(newCards);
            setTopFormat({ type: winner.type, engagement: winner.engagement });
        }
    }, [data]);

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white">
                <Loader className="w-10 h-10 animate-spin text-brand-primary mb-4" />
                <p className="text-gray-400">Loading comparison data...</p>
            </div>
        );
    }

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
                        <h2 className="text-3xl font-bold text-white">{topFormat.type}</h2>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-bold text-brand-secondary">{topFormat.engagement}</div>
                    <p className="text-gray-400 text-sm">Engagement Share</p>
                </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparisonCards.map((card, i) => (
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
                                <span className="text-gray-400 text-sm">Engagement Share</span>
                                <span className="font-bold text-white">{card.engagement}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Total Interactions</span>
                                <span className="font-bold text-white">{card.reach}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Posts Analyzed</span>
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
                        <BarChart data={performanceData} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
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
