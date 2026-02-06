import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Building2, Users, TrendingUp, Target, Search,
    Brain, ChevronRight, Star, Award, DollarSign, CalendarDays,
    Eye, Play, Plus, ArrowUpRight,
    CheckCircle, Clock
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Mock data for dashboard
const campaignData = [
    { month: 'Jan', spend: 4500, roi: 2.1 },
    { month: 'Feb', spend: 5200, roi: 2.4 },
    { month: 'Mar', spend: 6100, roi: 2.8 },
    { month: 'Apr', spend: 5800, roi: 3.1 },
    { month: 'May', spend: 7200, roi: 3.4 },
    { month: 'Jun', spend: 8500, roi: 3.2 }
];

const categoryDistribution = [
    { name: 'Tech', value: 35, color: '#3b82f6' },
    { name: 'Lifestyle', value: 25, color: '#ec4899' },
    { name: 'Fashion', value: 20, color: '#a855f7' },
    { name: 'Business', value: 15, color: '#10b981' },
    { name: 'Other', value: 5, color: '#6b7280' }
];

const activeCampaigns = [
    {
        id: 1,
        name: 'Product Launch Q2',
        influencers: 5,
        budget: 15000,
        spent: 8500,
        status: 'active',
        reach: 2300000,
        engagement: 4.2
    },
    {
        id: 2,
        name: 'Summer Brand Awareness',
        influencers: 8,
        budget: 25000,
        spent: 12000,
        status: 'active',
        reach: 4500000,
        engagement: 3.8
    },
    {
        id: 3,
        name: 'Tech Review Series',
        influencers: 3,
        budget: 8000,
        spent: 8000,
        status: 'completed',
        reach: 890000,
        engagement: 5.1
    }
];

const topInfluencers = [
    { id: 1, name: 'Tech Reviewer Pro', engagement: 4.8, roi: 3.5, image: 'https://i.pravatar.cc/150?u=tr1' },
    { id: 2, name: 'Digital Lifestyle', engagement: 5.2, roi: 4.1, image: 'https://i.pravatar.cc/150?u=dl2' },
    { id: 3, name: 'Gadget Guru', engagement: 4.1, roi: 2.8, image: 'https://i.pravatar.cc/150?u=gg3' },
    { id: 4, name: 'Innovation Hub', engagement: 6.2, roi: 3.9, image: 'https://i.pravatar.cc/150?u=ih4' }
];

const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const formatCurrency = (num: number) => '$' + formatNumber(num);

interface QuickStatProps {
    icon: LucideIcon;
    label: string;
    value: string;
    change: number;
    color: string;
}

const QuickStat = ({ icon: Icon, label, value, change, color }: QuickStatProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
    >
        <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <ArrowUpRight className={`w-4 h-4 ${change < 0 ? 'rotate-90' : ''}`} />
                {Math.abs(change)}%
            </div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
);

const BusinessDashboard = () => {
    useAuth(); // Ensure user is authenticated

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-purple-400" />
                        Business Dashboard
                    </h1>
                    <p className="text-gray-400 mt-1">Welcome back! Here's your campaign overview.</p>
                </div>
                <Link
                    to="/influencer-discovery"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    New Campaign
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickStat
                    icon={Target}
                    label="Active Campaigns"
                    value="2"
                    change={50}
                    color="bg-purple-500"
                />
                <QuickStat
                    icon={Users}
                    label="Partnered Influencers"
                    value="16"
                    change={23}
                    color="bg-blue-500"
                />
                <QuickStat
                    icon={Eye}
                    label="Total Reach"
                    value="7.7M"
                    change={34}
                    color="bg-emerald-500"
                />
                <QuickStat
                    icon={TrendingUp}
                    label="Avg. ROI"
                    value="3.2x"
                    change={12}
                    color="bg-pink-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                <Link
                    to="/influencer-discovery"
                    className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-5 hover:border-blue-500/50 transition-colors group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <Search className="w-8 h-8 text-blue-400 mb-3" />
                            <h3 className="font-bold text-white text-lg">Influencer Discovery</h3>
                            <p className="text-gray-400 text-sm mt-1">Search 200+ verified influencers</p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                </Link>

                <Link
                    to="/ai-matching"
                    className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-5 hover:border-purple-500/50 transition-colors group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <Brain className="w-8 h-8 text-purple-400 mb-3" />
                            <h3 className="font-bold text-white text-lg">AI Matching</h3>
                            <p className="text-gray-400 text-sm mt-1">Find perfect influencer matches</p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-purple-400 transition-colors" />
                    </div>
                </Link>

                <Link
                    to="/predictive-analytics"
                    className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-5 hover:border-emerald-500/50 transition-colors group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <TrendingUp className="w-8 h-8 text-emerald-400 mb-3" />
                            <h3 className="font-bold text-white text-lg">Predictive Analytics</h3>
                            <p className="text-gray-400 text-sm mt-1">Forecast campaign performance</p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Campaign Performance Chart */}
                <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        Campaign Spend & ROI
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={campaignData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="#666" tick={{ fill: '#999', fontSize: 12 }} />
                            <YAxis yAxisId="left" stroke="#666" tick={{ fill: '#999', fontSize: 12 }} tickFormatter={(v) => '$' + (v/1000) + 'K'} />
                            <YAxis yAxisId="right" orientation="right" stroke="#666" tick={{ fill: '#999', fontSize: 12 }} tickFormatter={(v) => v + 'x'} />
                            <Tooltip
                                contentStyle={{ background: 'rgba(17,17,17,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Line yAxisId="left" type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} dot={false} name="Spend" />
                            <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={2} dot={false} name="ROI" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Influencer Categories</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={categoryDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {categoryDistribution.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {categoryDistribution.map((cat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                <span className="text-gray-400">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Campaigns */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-purple-400" />
                        Your Campaigns
                    </h3>
                    <Link to="/campaigns" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="space-y-3">
                    {activeCampaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="bg-white/5 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${
                                    campaign.status === 'active' ? 'bg-emerald-500/20' :
                                    campaign.status === 'completed' ? 'bg-blue-500/20' : 'bg-yellow-500/20'
                                }`}>
                                    {campaign.status === 'active' ? (
                                        <Play className="w-4 h-4 text-emerald-400" />
                                    ) : campaign.status === 'completed' ? (
                                        <CheckCircle className="w-4 h-4 text-blue-400" />
                                    ) : (
                                        <Clock className="w-4 h-4 text-yellow-400" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">{campaign.name}</h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                        <span>{campaign.influencers} influencers</span>
                                        <span>•</span>
                                        <span>{formatNumber(campaign.reach)} reach</span>
                                        <span>•</span>
                                        <span>{campaign.engagement}% ER</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">Budget</div>
                                    <div className="text-sm text-white">{formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}</div>
                                </div>
                                <div className="w-24">
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Performing Influencers */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Top Performing Partners
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {topInfluencers.map((inf, i) => (
                        <div key={inf.id} className="text-center p-4 rounded-xl bg-white/5">
                            <div className="relative inline-block mb-3">
                                <img src={inf.image} alt={inf.name} className="w-16 h-16 rounded-full" />
                                {i === 0 && (
                                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                                        <Star className="w-3 h-3 text-black" />
                                    </div>
                                )}
                            </div>
                            <h4 className="font-semibold text-white text-sm">{inf.name}</h4>
                            <div className="flex justify-center gap-4 mt-2 text-xs">
                                <div>
                                    <div className="text-gray-500">ER</div>
                                    <div className="text-emerald-400">{inf.engagement}%</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">ROI</div>
                                    <div className="text-purple-400">{inf.roi}x</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BusinessDashboard;
