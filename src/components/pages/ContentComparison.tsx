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
    Twitter,
    Loader,
    Facebook
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
import { useAuth } from '../../context/AuthContext';

const PERFORMANCE_DATA = [
    { name: 'Mon', Reels: 0, Carousels: 0, Static: 0 },
    { name: 'Tue', Reels: 0, Carousels: 0, Static: 0 },
    { name: 'Wed', Reels: 0, Carousels: 0, Static: 0 },
    { name: 'Thu', Reels: 0, Carousels: 0, Static: 0 },
    { name: 'Fri', Reels: 0, Carousels: 0, Static: 0 },
    { name: 'Sat', Reels: 0, Carousels: 0, Static: 0 },
    { name: 'Sun', Reels: 0, Carousels: 0, Static: 0 },
];

const COMPARISON_CARDS = [
    {
        type: 'Reels',
        icon: Film,
        engagement: '0%',
        reach: '0',
        posts: 0,
        color: '#a855f7', // Purple
        winner: false
    },
    {
        type: 'Carousels',
        icon: Layers,
        engagement: '0%',
        reach: '0',
        posts: 0,
        color: '#06b6d4', // Cyan
        winner: false
    },
    {
        type: 'Static',
        icon: ImageIcon,
        engagement: '0%',
        reach: '0',
        posts: 0,
        color: '#64748b', // Slate
        winner: false
    }
];

const ContentComparison = () => {
    const { user } = useAuth();
    const { data, loading } = useInsights();

    // Determine available platforms
    const availablePlatforms = [{ id: 'all', label: 'All Platforms', icon: Globe }];
    if (user?.connections?.instagram) availablePlatforms.push({ id: 'instagram', label: 'Instagram', icon: Instagram });
    if (user?.connections?.facebook) availablePlatforms.push({ id: 'facebook', label: 'Facebook', icon: Facebook });
    if (user?.connections?.youtube) availablePlatforms.push({ id: 'youtube', label: 'YouTube', icon: Youtube });
    if (user?.connections?.twitter) availablePlatforms.push({ id: 'twitter', label: 'Twitter', icon: Twitter });

    // Always keep LinkedIn for demo/mock if needed, or hide if we want strict real data.
    // Making it strict:
    if (user?.connections?.twitter) { /* Just ensuring logic is consistent */ }

    const [activePlatform, setActivePlatform] = useState({ id: 'all', label: 'All Platforms', icon: Globe });

    useEffect(() => {
        // Fix: Use ID check instead of reference check to avoid infinite loop
        const isValid = availablePlatforms.some(p => p.id === activePlatform.id);
        if (!isValid) {
            setActivePlatform({ id: 'all', label: 'All Platforms', icon: Globe });
        }
        // Remove activePlatform from dependency to avoid loop if object ref changes
        // Actually, we only need to check when availablePlatforms changes (user connects/disconnects)
    }, [user, availablePlatforms.length]); // Use length or user as proxy

    // State for dynamic data
    const [performanceData, setPerformanceData] = useState(PERFORMANCE_DATA);
    const [comparisonCards, setComparisonCards] = useState(COMPARISON_CARDS);
    const [topFormat, setTopFormat] = useState({ type: '-', engagement: '0%' });

    useEffect(() => {
        let allPosts: any[] = [];

        if (data?.instagram?.recent_posts) allPosts = [...allPosts, ...data.instagram.recent_posts];
        if (data?.facebook?.recent_posts) allPosts = [...allPosts, ...data.facebook.recent_posts];
        if (data?.twitter?.recent_posts) allPosts = [...allPosts, ...data.twitter.recent_posts];

        let postsToProcess: any[] = [];

        if (activePlatform.id === 'all') {
            postsToProcess = allPosts;
        } else if (activePlatform.id === 'instagram') {
            postsToProcess = data?.instagram?.recent_posts || [];
        } else if (activePlatform.id === 'facebook') {
            postsToProcess = data?.facebook?.recent_posts || [];
        } else if (activePlatform.id === 'twitter') {
            postsToProcess = data?.twitter?.recent_posts || [];
        } else if (activePlatform.id === 'youtube') {
            postsToProcess = []; // No posts for YT yet
        }

        if (postsToProcess.length > 0) {
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

            postsToProcess.forEach((post: any) => {
                const date = new Date(post.timestamp);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const engagement = (post.likes || 0) + (post.comments || 0);

                // Map Instagram types to our Categories
                let type: keyof typeof stats = 'IMAGE';
                if (post.type === 'VIDEO') type = 'VIDEO';
                else if (post.type === 'CAROUSEL_ALBUM') type = 'CAROUSEL_ALBUM';
                else type = 'IMAGE';

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
        } // End if filteredPosts > 0
    }, [data, activePlatform]);

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
