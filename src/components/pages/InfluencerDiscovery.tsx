import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Users, TrendingUp,
    Shield, Globe, Instagram, Youtube, Twitter, Sparkles,
    Activity, Award
} from 'lucide-react';
import { INFLUENCER_DATABASE, CATEGORIES, REGIONS, PLATFORMS, type Influencer } from '../../data/influencerData';

const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const getPlatformIcon = (platform: string) => {
    switch (platform) {
        case 'instagram': return <Instagram className="w-4 h-4 text-pink-500" />;
        case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
        case 'twitter': return <Twitter className="w-4 h-4 text-blue-400" />;
        default: return <Globe className="w-4 h-4 text-gray-400" />;
    }
};

const ScoreBar = ({ score, label, color, tooltip }: { score: number; label: string; color: string; tooltip?: string }) => (
    <div className="space-y-1 group relative">
        <div className="flex justify-between text-xs">
            <span className="text-gray-400">{label}</span>
            <span className="font-semibold text-white">{score.toFixed(1)}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
                className={`h-full rounded-full ${color}`} 
                style={{ width: `${Math.min(100, score)}%` }}
            />
        </div>
        {tooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-xs text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {tooltip}
            </div>
        )}
    </div>
);

// Influencer Card Component using formula-calculated scores
const InfluencerCard = ({ influencer, onSelect }: { influencer: Influencer; onSelect: (inf: Influencer) => void }) => {
    // InfluenceIQ = (Credibility Score + Longevity Score + Engagement Quality Score) / 3
    const influenceIQ = influencer.influenceIQ;
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            onClick={() => onSelect(influencer)}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-purple-500/50 transition-all group"
        >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                    {influencer.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Shield className="w-3 h-3 text-white" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white truncate">{influencer.name}</h3>
                        <span className="text-lg">{influencer.country}</span>
                    </div>
                    <p className="text-sm text-gray-400">{influencer.handle}</p>
                    <div className="flex items-center gap-2 mt-1">
                        {getPlatformIcon(influencer.platform)}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{influencer.category}</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-white/5">
                    <Users className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <div className="text-sm font-bold text-white">{formatNumber(influencer.followers)}</div>
                    <div className="text-[10px] text-gray-500">Followers</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <div className="text-sm font-bold text-white">{influencer.engagement}%</div>
                    <div className="text-[10px] text-gray-500">ER%</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                    <Activity className="w-4 h-4 mx-auto mb-1 text-pink-400" />
                    <div className="text-sm font-bold text-white">{formatNumber(influencer.mediaCount)}</div>
                    <div className="text-[10px] text-gray-500">Media</div>
                </div>
            </div>

            {/* InfluenceIQ Score - Calculated using formula */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-gray-300">InfluenceIQ</span>
                </div>
                <div className="text-xl font-bold text-white">{influenceIQ.toFixed(1)}</div>
            </div>
        </motion.div>
    );
};

// Detailed Influencer Modal with Formula-Based Scoring
const InfluencerModal = ({ influencer, onClose }: { influencer: Influencer; onClose: () => void }) => {
    const influenceIQ = influencer.influenceIQ;
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-start gap-5 mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                        <Users className="w-10 h-10 text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-white">{influencer.name}</h2>
                            <span className="text-2xl">{influencer.country}</span>
                            {influencer.verified && (
                                <Shield className="w-5 h-5 text-blue-500" />
                            )}
                        </div>
                        <p className="text-gray-400 mb-2">{influencer.handle}</p>
                        <p className="text-sm text-gray-500">{influencer.region} • {influencer.category} Creator</p>
                        <div className="flex items-center gap-3 mt-3">
                            {getPlatformIcon(influencer.platform)}
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">{influencer.category}</span>
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">{influencer.region}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                        <Users className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                        <div className="text-xl font-bold text-white">{formatNumber(influencer.followers)}</div>
                        <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                        <TrendingUp className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
                        <div className="text-xl font-bold text-white">{influencer.engagement}%</div>
                        <div className="text-xs text-gray-500">Engagement Rate</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                        <Activity className="w-5 h-5 mx-auto mb-2 text-pink-400" />
                        <div className="text-xl font-bold text-white">{formatNumber(influencer.mediaCount)}</div>
                        <div className="text-xs text-gray-500">Media Posts</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                        <Award className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                        <div className="text-xl font-bold text-white">{(influencer.conversionFactor * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">Conv. Factor</div>
                    </div>
                </div>

                {/* Scoring System with Formulas */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            Advanced Scoring System
                        </h3>
                        <div className="text-3xl font-bold text-white">{influenceIQ.toFixed(1)}<span className="text-lg text-gray-400">/100</span></div>
                    </div>
                    
                    {/* Formula explanations */}
                    <div className="text-xs text-gray-500 mb-4 p-3 rounded-lg bg-black/20">
                        <p className="mb-1"><strong>Credibility</strong> = (0.4 × Influence) + (0.3 × ER × 100) + (0.3 × Reputation)</p>
                        <p className="mb-1"><strong>Engagement Quality</strong> = ER × 10 (scaled to 0-100)</p>
                        <p><strong>InfluenceIQ</strong> = (Credibility + Longevity + Engagement Quality) / 3</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <ScoreBar 
                            score={influencer.influenceScore} 
                            label="Influence Score" 
                            color="bg-purple-500" 
                            tooltip="Based on followers and reach"
                        />
                        <ScoreBar 
                            score={influencer.credibilityScore} 
                            label="Credibility Score" 
                            color="bg-blue-500"
                            tooltip="(0.4 × Influence) + (0.3 × ER × 100) + (0.3 × Reputation)"
                        />
                        <ScoreBar 
                            score={influencer.longevityScore} 
                            label="Longevity Score" 
                            color="bg-emerald-500"
                            tooltip="Based on content count and consistency"
                        />
                        <ScoreBar 
                            score={influencer.engagementQuality} 
                            label="Engagement Quality" 
                            color="bg-pink-500"
                            tooltip="Engagement Rate scaled to 0-100"
                        />
                        <ScoreBar 
                            score={influencer.reputationScore} 
                            label="Reputation Score" 
                            color="bg-cyan-500"
                            tooltip="Based on media count and engagement"
                        />
                        <ScoreBar 
                            score={influencer.influenceIQ} 
                            label="InfluenceIQ" 
                            color="bg-gradient-to-r from-purple-500 to-blue-500"
                            tooltip="Combined score: (Credibility + Longevity + Quality) / 3"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const InfluencerDiscovery = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedPlatform, setSelectedPlatform] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
    const [sortBy, setSortBy] = useState('followers');

    const filteredInfluencers = useMemo(() => {
        let filtered = INFLUENCER_DATABASE.filter(inf => {
            const matchesSearch = inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  inf.handle.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || inf.category === selectedCategory;
            const matchesRegion = selectedRegion === 'All' || inf.region === selectedRegion;
            const matchesPlatform = selectedPlatform === 'All' || inf.platform === selectedPlatform;
            
            return matchesSearch && matchesCategory && matchesRegion && matchesPlatform;
        });

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'followers': return b.followers - a.followers;
                case 'engagement': return b.engagement - a.engagement;
                case 'influenceIQ': return b.influenceIQ - a.influenceIQ;
                case 'credibility': return b.credibilityScore - a.credibilityScore;
                default: return 0;
            }
        });

        return filtered;
    }, [searchQuery, selectedCategory, selectedRegion, selectedPlatform, sortBy]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-purple-400" />
                        Influencer Discovery
                    </h1>
                    <p className="text-gray-400 mt-1">Search and filter from {INFLUENCER_DATABASE.length}+ verified influencers</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">{filteredInfluencers.length}</div>
                    <div className="text-sm text-gray-500">Results found</div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="flex gap-4 items-center">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search influencers by name or handle..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                    </div>

                    {/* Quick Filters */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat} className="bg-gray-900">{cat === 'All' ? 'All Categories' : cat}</option>
                        ))}
                    </select>

                    <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
                    >
                        {REGIONS.map(reg => (
                            <option key={reg} value={reg} className="bg-gray-900">{reg === 'All' ? 'All Regions' : reg}</option>
                        ))}
                    </select>

                    <select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
                    >
                        {PLATFORMS.map(plat => (
                            <option key={plat} value={plat} className="bg-gray-900">{plat === 'All' ? 'All Platforms' : plat.charAt(0).toUpperCase() + plat.slice(1)}</option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
                    >
                        <option value="followers" className="bg-gray-900">Sort by Followers</option>
                        <option value="engagement" className="bg-gray-900">Sort by Engagement</option>
                        <option value="influenceIQ" className="bg-gray-900">Sort by InfluenceIQ</option>
                        <option value="credibility" className="bg-gray-900">Sort by Credibility</option>
                    </select>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <Filter className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Active Filters */}
                {(selectedCategory !== 'All' || selectedRegion !== 'All' || selectedPlatform !== 'All') && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {selectedCategory !== 'All' && (
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm flex items-center gap-1">
                                {selectedCategory}
                                <button onClick={() => setSelectedCategory('All')} className="hover:text-white">×</button>
                            </span>
                        )}
                        {selectedRegion !== 'All' && (
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm flex items-center gap-1">
                                {selectedRegion}
                                <button onClick={() => setSelectedRegion('All')} className="hover:text-white">×</button>
                            </span>
                        )}
                        {selectedPlatform !== 'All' && (
                            <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm flex items-center gap-1">
                                {selectedPlatform}
                                <button onClick={() => setSelectedPlatform('All')} className="hover:text-white">×</button>
                            </span>
                        )}
                        <button 
                            onClick={() => { setSelectedCategory('All'); setSelectedRegion('All'); setSelectedPlatform('All'); }}
                            className="text-sm text-gray-500 hover:text-white"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Influencer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredInfluencers.slice(0, 30).map(influencer => (
                        <InfluencerCard 
                            key={influencer.id} 
                            influencer={influencer} 
                            onSelect={setSelectedInfluencer}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Load More */}
            {filteredInfluencers.length > 30 && (
                <div className="text-center py-8">
                    <button className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors">
                        Load More ({filteredInfluencers.length - 30} remaining)
                    </button>
                </div>
            )}

            {/* No Results */}
            {filteredInfluencers.length === 0 && (
                <div className="text-center py-16">
                    <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No influencers found</h3>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Influencer Detail Modal */}
            <AnimatePresence>
                {selectedInfluencer && (
                    <InfluencerModal 
                        influencer={selectedInfluencer} 
                        onClose={() => setSelectedInfluencer(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default InfluencerDiscovery;
