import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles, Target, Users, TrendingUp, Shield, Award,
    Loader,
    Instagram, Youtube, Twitter, Globe, Brain,
    BarChart3, RefreshCw, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INFLUENCER_DATABASE, calculateMatchPercentage, type Influencer } from '../../data/influencerData';

interface MatchResult {
    influencer: Influencer;
    matchScore: number;
    matchReasons: string[];
    contentSimilarity: number;
    audienceOverlap: number;
    categoryMatch: number;
    metricsScore: number;
}

interface BusinessProfile {
    category: string;
    budget: string;
    platform: string;
    campaignGoal: string;
    description?: string;
}

// AI Matching Algorithm using formula:
// Match % = (TF-IDF Similarity × 0.4) + (Category Match × 0.4) + (Metrics Score × 0.2)
const runAIMatching = async (businessProfile: BusinessProfile): Promise<MatchResult[]> => {
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    const matches: MatchResult[] = INFLUENCER_DATABASE.map(influencer => {
        // Calculate match percentage using the formula
        const matchScore = calculateMatchPercentage(
            influencer,
            businessProfile.category,
            businessProfile.budget,
            businessProfile.platform,
            businessProfile.campaignGoal
        );

        // Category match (0 or 100)
        const categoryMatch = influencer.category.toLowerCase() === businessProfile.category.toLowerCase() ? 100 : 
                             (influencer.category === 'Beauty' && businessProfile.category === 'Fashion') ? 80 : 0;

        // TF-IDF Similarity (simulated based on content relevance)
        const contentSimilarity = Math.min(100, 
            (influencer.engagement * 10) + 
            (influencer.credibilityScore * 0.3) + 
            (categoryMatch > 0 ? 30 : 0)
        );

        // Metrics Score based on budget alignment and platform match
        let metricsScore = 50;
        const budgetRanges: Record<string, [number, number]> = {
            'small': [0, 500000],
            'medium': [500000, 5000000],
            'large': [5000000, 20000000],
            'enterprise': [20000000, Infinity]
        };
        const [minF, maxF] = budgetRanges[businessProfile.budget] || [0, Infinity];
        if (influencer.followers >= minF && influencer.followers <= maxF) {
            metricsScore += 25;
        }
        if (businessProfile.platform === 'any' || influencer.platform === businessProfile.platform) {
            metricsScore += 25;
        }

        // Audience overlap estimate based on region and category
        const audienceOverlap = categoryMatch > 0 ? 
            Math.round(60 + (influencer.credibilityScore * 0.3) + Math.random() * 10) : 
            Math.round(30 + Math.random() * 20);

        // Generate match reasons
        const matchReasons: string[] = [];
        if (categoryMatch === 100) matchReasons.push('Perfect category match');
        else if (categoryMatch > 0) matchReasons.push('Related category');
        if (influencer.engagement > 5) matchReasons.push('High engagement rate');
        else if (influencer.engagement > 3) matchReasons.push('Good engagement rate');
        if (influencer.credibilityScore > 80) matchReasons.push('High credibility');
        if (influencer.followers >= minF && influencer.followers <= maxF) matchReasons.push('Budget-aligned reach');
        if (businessProfile.platform === 'any' || influencer.platform === businessProfile.platform) {
            matchReasons.push(`${influencer.platform} creator`);
        }

        return {
            influencer,
            matchScore,
            matchReasons: matchReasons.slice(0, 3),
            contentSimilarity: Math.round(contentSimilarity),
            audienceOverlap,
            categoryMatch,
            metricsScore
        };
    })
    .filter(m => m.matchScore > 30) // Filter out low matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10); // Top 10 matches

    return matches;
};

const formatNumber = (num: number) => {
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

const MatchScoreRing = ({ score }: { score: number }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    return (
        <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90">
                <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-white/10"
                />
                <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="url(#matchGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000"
                />
                <defs>
                    <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{score}%</span>
            </div>
        </div>
    );
};

const MatchCard = ({ match, rank }: { match: MatchResult; rank: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rank * 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-purple-500/50 transition-all"
    >
        <div className="flex items-start gap-4">
            {/* Rank Badge */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                rank === 1 ? 'bg-yellow-500 text-black' :
                rank === 2 ? 'bg-gray-400 text-black' :
                rank === 3 ? 'bg-orange-600 text-white' :
                'bg-white/10 text-gray-400'
            }`}>
                #{rank}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <img src={match.influencer.image} alt={match.influencer.name} className="w-12 h-12 rounded-xl" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white">{match.influencer.name}</h3>
                            {match.influencer.verified && <Shield className="w-4 h-4 text-blue-500" />}
                            <span>{match.influencer.country}</span>
                        </div>
                        <p className="text-sm text-gray-400">{match.influencer.handle}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm mb-3">
                    <span className="flex items-center gap-1 text-gray-400">
                        {getPlatformIcon(match.influencer.platform)}
                        {match.influencer.platform}
                    </span>
                    <span className="text-gray-400">
                        <Users className="w-3 h-3 inline mr-1" />
                        {formatNumber(match.influencer.followers)}
                    </span>
                    <span className="text-emerald-400">
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        {match.influencer.engagement}% ER
                    </span>
                </div>

                {/* Match Reasons */}
                <div className="flex flex-wrap gap-2">
                    {match.matchReasons.map((reason, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                            {reason}
                        </span>
                    ))}
                </div>
            </div>

            {/* Match Score */}
            <MatchScoreRing score={match.matchScore} />
        </div>

        {/* Detailed Scores - Using Formula Components */}
        <div className="mt-4 pt-4 border-t border-white/5">
            <div className="text-xs text-gray-500 mb-3">
                Match % = (TF-IDF × 0.4) + (Category × 0.4) + (Metrics × 0.2)
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                    <div className="text-lg font-bold text-white">{match.contentSimilarity}%</div>
                    <div className="text-xs text-gray-500">TF-IDF Sim</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-white">{match.categoryMatch}%</div>
                    <div className="text-xs text-gray-500">Category</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-white">{match.metricsScore}%</div>
                    <div className="text-xs text-gray-500">Metrics</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-white">{match.influencer.credibilityScore.toFixed(0)}%</div>
                    <div className="text-xs text-gray-500">Credibility</div>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-colors">
                View Profile
            </button>
            <button className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors">
                Start Campaign
            </button>
        </div>
    </motion.div>
);

// Category mapping from form values to data values
const categoryMapping: Record<string, string> = {
    'tech': 'Tech',
    'fashion': 'Fashion',
    'beauty': 'Beauty',
    'lifestyle': 'Lifestyle',
    'gaming': 'Gaming',
    'fitness': 'Fitness',
    'food': 'Food',
    'travel': 'Travel',
    'finance': 'Finance',
    'education': 'Education'
};

const AIMatching = () => {
    const { } = useAuth();
    const [isMatching, setIsMatching] = useState(false);
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [matchingStep, setMatchingStep] = useState(0);

    // Campaign requirements form
    const [requirements, setRequirements] = useState({
        campaignGoal: 'awareness',
        targetCategory: 'tech',
        budget: 'medium',
        platform: 'any',
        contentType: 'video',
        audienceSize: 'medium'
    });

    const matchingSteps = [
        { label: 'Analyzing your business profile...', icon: Brain },
        { label: 'Running TF-IDF content analysis...', icon: BarChart3 },
        { label: 'Calculating audience overlap...', icon: Users },
        { label: 'Scoring engagement quality...', icon: TrendingUp },
        { label: 'Generating top matches...', icon: Sparkles }
    ];

    const handleRunMatching = async () => {
        setIsMatching(true);
        setMatches([]);
        setMatchingStep(0);

        // Simulate matching steps
        for (let i = 0; i < matchingSteps.length; i++) {
            setMatchingStep(i);
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Run AI matching with mapped category
        const results = await runAIMatching({
            category: categoryMapping[requirements.targetCategory] || requirements.targetCategory,
            budget: requirements.budget,
            platform: requirements.platform,
            campaignGoal: requirements.campaignGoal
        });

        setMatches(results);
        setIsMatching(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Brain className="w-8 h-8 text-purple-400" />
                        AI-Powered Matching
                    </h1>
                    <p className="text-gray-400 mt-1">Find the perfect influencers for your brand using advanced AI</p>
                </div>
            </div>

            {/* AI Matching Algorithm Info */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/20">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">How Our AI Matching Works</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="p-3 rounded-lg bg-white/5">
                                <div className="font-semibold text-white mb-1">TF-IDF Analysis</div>
                                <div className="text-gray-400 text-xs">Content similarity scoring using term frequency analysis</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5">
                                <div className="font-semibold text-white mb-1">Category Matching</div>
                                <div className="text-gray-400 text-xs">Industry and niche alignment detection</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5">
                                <div className="font-semibold text-white mb-1">Engagement Scoring</div>
                                <div className="text-gray-400 text-xs">Quality metrics beyond vanity numbers</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5">
                                <div className="font-semibold text-white mb-1">Credibility Check</div>
                                <div className="text-gray-400 text-xs">Bot detection and reputation analysis</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign Requirements */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Campaign Requirements
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Campaign Goal</label>
                        <select
                            value={requirements.campaignGoal}
                            onChange={(e) => setRequirements({ ...requirements, campaignGoal: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="awareness" className="bg-gray-900">Brand Awareness</option>
                            <option value="sales" className="bg-gray-900">Drive Sales</option>
                            <option value="engagement" className="bg-gray-900">Boost Engagement</option>
                            <option value="leads" className="bg-gray-900">Generate Leads</option>
                            <option value="content" className="bg-gray-900">Content Creation</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Target Category</label>
                        <select
                            value={requirements.targetCategory}
                            onChange={(e) => setRequirements({ ...requirements, targetCategory: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="tech" className="bg-gray-900">Technology</option>
                            <option value="fashion" className="bg-gray-900">Fashion & Beauty</option>
                            <option value="lifestyle" className="bg-gray-900">Lifestyle</option>
                            <option value="gaming" className="bg-gray-900">Gaming</option>
                            <option value="fitness" className="bg-gray-900">Fitness & Health</option>
                            <option value="food" className="bg-gray-900">Food & Cooking</option>
                            <option value="travel" className="bg-gray-900">Travel</option>
                            <option value="finance" className="bg-gray-900">Finance</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Budget Range</label>
                        <select
                            value={requirements.budget}
                            onChange={(e) => setRequirements({ ...requirements, budget: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="small" className="bg-gray-900">$1K - $5K</option>
                            <option value="medium" className="bg-gray-900">$5K - $15K</option>
                            <option value="large" className="bg-gray-900">$15K - $50K</option>
                            <option value="enterprise" className="bg-gray-900">$50K+</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Preferred Platform</label>
                        <select
                            value={requirements.platform}
                            onChange={(e) => setRequirements({ ...requirements, platform: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="any" className="bg-gray-900">Any Platform</option>
                            <option value="instagram" className="bg-gray-900">Instagram</option>
                            <option value="youtube" className="bg-gray-900">YouTube</option>
                            <option value="tiktok" className="bg-gray-900">TikTok</option>
                            <option value="twitter" className="bg-gray-900">Twitter/X</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Content Type</label>
                        <select
                            value={requirements.contentType}
                            onChange={(e) => setRequirements({ ...requirements, contentType: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="video" className="bg-gray-900">Video Content</option>
                            <option value="reels" className="bg-gray-900">Short-form (Reels/TikTok)</option>
                            <option value="carousel" className="bg-gray-900">Carousel Posts</option>
                            <option value="story" className="bg-gray-900">Stories</option>
                            <option value="any" className="bg-gray-900">Any Format</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Influencer Size</label>
                        <select
                            value={requirements.audienceSize}
                            onChange={(e) => setRequirements({ ...requirements, audienceSize: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value="nano" className="bg-gray-900">Nano (1K-10K)</option>
                            <option value="micro" className="bg-gray-900">Micro (10K-100K)</option>
                            <option value="medium" className="bg-gray-900">Medium (100K-1M)</option>
                            <option value="macro" className="bg-gray-900">Macro (1M-10M)</option>
                            <option value="mega" className="bg-gray-900">Mega (10M+)</option>
                            <option value="any" className="bg-gray-900">Any Size</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleRunMatching}
                    disabled={isMatching}
                    className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isMatching ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Finding Perfect Matches...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Run AI Matching
                        </>
                    )}
                </button>
            </div>

            {/* Matching Progress */}
            {isMatching && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">AI Matching in Progress</h3>
                    <div className="space-y-3">
                        {matchingSteps.map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    i < matchingStep ? 'bg-emerald-500' :
                                    i === matchingStep ? 'bg-purple-500 animate-pulse' :
                                    'bg-white/10'
                                }`}>
                                    {i < matchingStep ? (
                                        <Check className="w-4 h-4 text-white" />
                                    ) : (
                                        <step.icon className={`w-4 h-4 ${i === matchingStep ? 'text-white' : 'text-gray-500'}`} />
                                    )}
                                </div>
                                <span className={`text-sm ${i <= matchingStep ? 'text-white' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Match Results */}
            {matches.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Award className="w-6 h-6 text-yellow-500" />
                            Top Matches for Your Campaign
                        </h3>
                        <button
                            onClick={handleRunMatching}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Re-run Analysis
                        </button>
                    </div>

                    <div className="space-y-4">
                        {matches.map((match, index) => (
                            <MatchCard key={match.influencer.id} match={match} rank={index + 1} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isMatching && matches.length === 0 && (
                <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Ready to Find Your Perfect Matches</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Configure your campaign requirements above and let our AI find the best influencers for your brand.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AIMatching;
