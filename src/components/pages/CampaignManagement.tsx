import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target, Plus, Search, MoreVertical, Calendar,
    DollarSign, Users, TrendingUp, CheckCircle,
    Play, Pause, Edit2, Eye, X, Star,
    Instagram, Youtube, Twitter
} from 'lucide-react';

interface Campaign {
    id: number;
    name: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    budget: number;
    spent: number;
    startDate: string;
    endDate: string;
    influencers: {
        id: number;
        name: string;
        image: string;
        platform: string;
        status: 'invited' | 'accepted' | 'declined' | 'completed';
        deliverables: number;
        completed: number;
    }[];
    reach: number;
    engagement: number;
    conversions: number;
    roi: number;
    goals: string[];
}

const mockCampaigns: Campaign[] = [
    {
        id: 1,
        name: 'Product Launch Q2 2024',
        status: 'active',
        budget: 25000,
        spent: 12500,
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        influencers: [
            { id: 1, name: 'Tech Reviewer Pro', image: 'https://i.pravatar.cc/150?u=tr1', platform: 'youtube', status: 'accepted', deliverables: 3, completed: 2 },
            { id: 2, name: 'Digital Lifestyle', image: 'https://i.pravatar.cc/150?u=dl2', platform: 'instagram', status: 'accepted', deliverables: 5, completed: 3 },
            { id: 3, name: 'Gadget Guru', image: 'https://i.pravatar.cc/150?u=gg3', platform: 'youtube', status: 'completed', deliverables: 2, completed: 2 },
        ],
        reach: 4500000,
        engagement: 4.2,
        conversions: 1250,
        roi: 3.2,
        goals: ['Brand Awareness', 'Sales']
    },
    {
        id: 2,
        name: 'Summer Brand Awareness',
        status: 'active',
        budget: 15000,
        spent: 8200,
        startDate: '2024-05-15',
        endDate: '2024-08-31',
        influencers: [
            { id: 4, name: 'Fashion Forward', image: 'https://i.pravatar.cc/150?u=ff4', platform: 'instagram', status: 'accepted', deliverables: 10, completed: 4 },
            { id: 5, name: 'Lifestyle Queen', image: 'https://i.pravatar.cc/150?u=lq5', platform: 'instagram', status: 'accepted', deliverables: 8, completed: 2 },
        ],
        reach: 2800000,
        engagement: 5.1,
        conversions: 890,
        roi: 2.8,
        goals: ['Brand Awareness', 'Engagement']
    },
    {
        id: 3,
        name: 'Tech Review Series',
        status: 'completed',
        budget: 10000,
        spent: 9800,
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        influencers: [
            { id: 1, name: 'Tech Reviewer Pro', image: 'https://i.pravatar.cc/150?u=tr1', platform: 'youtube', status: 'completed', deliverables: 4, completed: 4 },
        ],
        reach: 1200000,
        engagement: 6.2,
        conversions: 520,
        roi: 4.1,
        goals: ['Product Reviews', 'Sales']
    },
    {
        id: 4,
        name: 'Holiday Promo 2024',
        status: 'draft',
        budget: 50000,
        spent: 0,
        startDate: '2024-11-15',
        endDate: '2024-12-31',
        influencers: [],
        reach: 0,
        engagement: 0,
        conversions: 0,
        roi: 0,
        goals: ['Sales', 'Brand Awareness']
    }
];

const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
};

const formatCurrency = (num: number) => '$' + formatNumber(num);

const getStatusConfig = (status: Campaign['status']) => {
    switch (status) {
        case 'active': return { icon: Play, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Active' };
        case 'paused': return { icon: Pause, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Paused' };
        case 'completed': return { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Completed' };
        case 'draft': return { icon: Edit2, color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Draft' };
    }
};

const getPlatformIcon = (platform: string) => {
    switch (platform) {
        case 'instagram': return <Instagram className="w-3.5 h-3.5 text-pink-500" />;
        case 'youtube': return <Youtube className="w-3.5 h-3.5 text-red-500" />;
        case 'twitter': return <Twitter className="w-3.5 h-3.5 text-blue-400" />;
        default: return null;
    }
};

interface CampaignCardProps {
    campaign: Campaign;
    onViewDetails: (campaign: Campaign) => void;
}

const CampaignCard = ({ campaign, onViewDetails }: CampaignCardProps) => {
    const statusConfig = getStatusConfig(campaign.status);
    const progress = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                        <statusConfig.icon className={`w-4 h-4 ${statusConfig.color}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{campaign.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {campaign.startDate} - {campaign.endDate}
                        </div>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                    {statusConfig.label}
                </span>
            </div>

            {/* Budget Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-400">Budget</span>
                    <span className="text-white">{formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-white/5">
                    <div className="text-lg font-bold text-white">{campaign.influencers.length}</div>
                    <div className="text-xs text-gray-500">Influencers</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                    <div className="text-lg font-bold text-white">{formatNumber(campaign.reach)}</div>
                    <div className="text-xs text-gray-500">Reach</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                    <div className="text-lg font-bold text-emerald-400">{campaign.engagement}%</div>
                    <div className="text-xs text-gray-500">ER</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                    <div className="text-lg font-bold text-purple-400">{campaign.roi}x</div>
                    <div className="text-xs text-gray-500">ROI</div>
                </div>
            </div>

            {/* Influencer Avatars */}
            {campaign.influencers.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center -space-x-2">
                        {campaign.influencers.slice(0, 4).map(inf => (
                            <img
                                key={inf.id}
                                src={inf.image}
                                alt={inf.name}
                                className="w-8 h-8 rounded-full border-2 border-dark-surface"
                                title={inf.name}
                            />
                        ))}
                        {campaign.influencers.length > 4 && (
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 border-2 border-dark-surface flex items-center justify-center text-xs text-purple-400 font-semibold">
                                +{campaign.influencers.length - 4}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Goals */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {campaign.goals.map((goal, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-gray-400">
                        {goal}
                    </span>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => onViewDetails(campaign)}
                    className="flex-1 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    View Details
                </button>
                <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

interface CampaignModalProps {
    campaign: Campaign;
    onClose: () => void;
}

const CampaignModal = ({ campaign, onClose }: CampaignModalProps) => {
    const statusConfig = getStatusConfig(campaign.status);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-dark-surface border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                                    {statusConfig.label}
                                </span>
                                <span className="text-sm text-gray-400">
                                    {campaign.startDate} - {campaign.endDate}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Budget & Stats */}
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <DollarSign className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{formatCurrency(campaign.spent)}</div>
                            <div className="text-xs text-gray-500">of {formatCurrency(campaign.budget)}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{formatNumber(campaign.reach)}</div>
                            <div className="text-xs text-gray-500">Total Reach</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <TrendingUp className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{campaign.engagement}%</div>
                            <div className="text-xs text-gray-500">Engagement Rate</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{campaign.roi}x</div>
                            <div className="text-xs text-gray-500">ROI</div>
                        </div>
                    </div>

                    {/* Influencers */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-400" />
                            Campaign Influencers ({campaign.influencers.length})
                        </h3>
                        {campaign.influencers.length > 0 ? (
                            <div className="space-y-2">
                                {campaign.influencers.map(inf => (
                                    <div key={inf.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <img src={inf.image} alt={inf.name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-white">{inf.name}</span>
                                                    {getPlatformIcon(inf.platform)}
                                                </div>
                                                <span className={`text-xs ${
                                                    inf.status === 'completed' ? 'text-emerald-400' :
                                                    inf.status === 'accepted' ? 'text-blue-400' :
                                                    inf.status === 'declined' ? 'text-red-400' : 'text-yellow-400'
                                                }`}>
                                                    {inf.status.charAt(0).toUpperCase() + inf.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-white">{inf.completed}/{inf.deliverables}</div>
                                            <div className="text-xs text-gray-500">Deliverables</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No influencers added yet
                            </div>
                        )}
                    </div>

                    {/* Goals */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <Target className="w-5 h-5 text-emerald-400" />
                            Campaign Goals
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {campaign.goals.map((goal, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                                    {goal}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 flex gap-3">
                    {campaign.status === 'draft' && (
                        <button className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors">
                            Launch Campaign
                        </button>
                    )}
                    {campaign.status === 'active' && (
                        <>
                            <button className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-colors">
                                Pause Campaign
                            </button>
                            <button className="flex-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold transition-colors">
                                Add Influencers
                            </button>
                        </>
                    )}
                    <button className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors">
                        Edit
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const CampaignManagement = () => {
    const [campaigns] = useState<Campaign[]>(mockCampaigns);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCampaigns = campaigns.filter(c => {
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: campaigns.length,
        active: campaigns.filter(c => c.status === 'active').length,
        totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
        totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
        avgRoi: campaigns.filter(c => c.roi > 0).reduce((sum, c) => sum + c.roi, 0) / campaigns.filter(c => c.roi > 0).length || 0
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Target className="w-8 h-8 text-purple-400" />
                        Campaign Management
                    </h1>
                    <p className="text-gray-400 mt-1">Manage your influencer marketing campaigns</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity">
                    <Plus className="w-5 h-5" />
                    New Campaign
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                    <div className="text-sm text-gray-400">Total Campaigns</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-emerald-400">{stats.active}</div>
                    <div className="text-sm text-gray-400">Active</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalBudget)}</div>
                    <div className="text-sm text-gray-400">Total Budget</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-400">{formatCurrency(stats.totalSpent)}</div>
                    <div className="text-sm text-gray-400">Total Spent</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-yellow-400">{stats.avgRoi.toFixed(1)}x</div>
                    <div className="text-sm text-gray-400">Avg. ROI</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                >
                    <option value="all" className="bg-gray-900">All Status</option>
                    <option value="active" className="bg-gray-900">Active</option>
                    <option value="paused" className="bg-gray-900">Paused</option>
                    <option value="completed" className="bg-gray-900">Completed</option>
                    <option value="draft" className="bg-gray-900">Draft</option>
                </select>
            </div>

            {/* Campaign Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCampaigns.map(campaign => (
                    <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onViewDetails={setSelectedCampaign}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredCampaigns.length === 0 && (
                <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Campaigns Found</h3>
                    <p className="text-gray-400">Try adjusting your filters or create a new campaign.</p>
                </div>
            )}

            {/* Campaign Detail Modal */}
            <AnimatePresence>
                {selectedCampaign && (
                    <CampaignModal
                        campaign={selectedCampaign}
                        onClose={() => setSelectedCampaign(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CampaignManagement;
