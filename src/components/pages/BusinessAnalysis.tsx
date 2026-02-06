import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Calculator, Target, Users, Search, ChevronDown, ChevronUp } from 'lucide-react';

// Influencer data (parsed from CSV)
const INFLUENCER_DATA = [
    { id: 1, region: 'Global', category: 'Tech', name: 'Marques Brownlee (MKBHD)', followers: '19.2M', mediaCount: 1620, er: 2.50, convFactor: 0.012 },
    { id: 2, region: 'India', category: 'Tech', name: 'Technical Guruji', followers: '23.5M', mediaCount: 5400, er: 1.10, convFactor: 0.01 },
    { id: 3, region: 'India', category: 'Tech', name: 'Shlok Srivastava (TechBurner)', followers: '4.8M', mediaCount: 950, er: 4.20, convFactor: 0.018 },
    { id: 4, region: 'Global', category: 'Tech', name: 'Mrwhosetheboss', followers: '18.1M', mediaCount: 1100, er: 3.10, convFactor: 0.014 },
    { id: 5, region: 'India', category: 'Tech', name: 'Trakin Tech (Arun)', followers: '14.2M', mediaCount: 3200, er: 1.80, convFactor: 0.013 },
    { id: 6, region: 'Global', category: 'Tech', name: 'Linus Tech Tips', followers: '15.8M', mediaCount: 6200, er: 2.90, convFactor: 0.015 },
    { id: 7, region: 'India', category: 'Tech', name: 'Geekyranjit', followers: '3.3M', mediaCount: 3100, er: 1.20, convFactor: 0.009 },
    { id: 8, region: 'Global', category: 'Tech', name: 'iJustine', followers: '7.1M', mediaCount: 4500, er: 1.50, convFactor: 0.011 },
    { id: 9, region: 'India', category: 'Tech', name: 'Beebom', followers: '3.2M', mediaCount: 1200, er: 3.80, convFactor: 0.016 },
    { id: 10, region: 'Global', category: 'Tech', name: 'Austin Evans', followers: '5.4M', mediaCount: 2100, er: 2.00, convFactor: 0.012 },
    { id: 11, region: 'India', category: 'Tech', name: 'Dave2D', followers: '3.7M', mediaCount: 850, er: 4.50, convFactor: 0.019 },
    { id: 12, region: 'Global', category: 'Tech', name: 'Unbox Therapy', followers: '21.5M', mediaCount: 2900, er: 1.20, convFactor: 0.008 },
    { id: 21, region: 'India', category: 'Fashion', name: 'Nancy Tyagi', followers: '3.2M', mediaCount: 450, er: 8.50, convFactor: 0.045 },
    { id: 22, region: 'Global', category: 'Fashion', name: 'Chiara Ferragni', followers: '29.5M', mediaCount: 16200, er: 0.80, convFactor: 0.015 },
    { id: 23, region: 'India', category: 'Fashion', name: 'Komal Pandey', followers: '1.9M', mediaCount: 1550, er: 3.80, convFactor: 0.035 },
    { id: 24, region: 'Global', category: 'Fashion', name: 'Wisdom Kaye', followers: '12.0M', mediaCount: 1100, er: 7.20, convFactor: 0.04 },
    { id: 25, region: 'India', category: 'Fashion', name: 'Siddharth Batra', followers: '310k', mediaCount: 1400, er: 4.10, convFactor: 0.03 },
    { id: 26, region: 'Global', category: 'Fashion', name: 'Huda Kattan', followers: '54.1M', mediaCount: 8200, er: 0.60, convFactor: 0.012 },
    { id: 27, region: 'India', category: 'Fashion', name: 'Malvika Sitlani', followers: '650k', mediaCount: 2800, er: 2.50, convFactor: 0.028 },
    { id: 28, region: 'Global', category: 'Fashion', name: 'Leonie Hanne', followers: '4.7M', mediaCount: 5100, er: 2.20, convFactor: 0.025 },
    { id: 29, region: 'India', category: 'Fashion', name: 'Kritika Khurana', followers: '1.8M', mediaCount: 3100, er: 2.90, convFactor: 0.022 },
    { id: 30, region: 'Global', category: 'Fashion', name: 'James Charles', followers: '24.5M', mediaCount: 1400, er: 1.80, convFactor: 0.02 },
    { id: 41, region: 'Global', category: 'Lifestyle', name: 'Emma Chamberlain', followers: '16.2M', mediaCount: 1400, er: 5.50, convFactor: 0.015 },
    { id: 42, region: 'India', category: 'Lifestyle', name: 'Prajakta Koli (MostlySane)', followers: '8.8M', mediaCount: 2100, er: 2.10, convFactor: 0.012 },
    { id: 43, region: 'India', category: 'Lifestyle', name: 'Kusha Kapila', followers: '3.7M', mediaCount: 1850, er: 3.40, convFactor: 0.018 },
    { id: 44, region: 'Global', category: 'Lifestyle', name: 'Logan Paul', followers: '27.1M', mediaCount: 1200, er: 2.80, convFactor: 0.009 },
    { id: 45, region: 'India', category: 'Lifestyle', name: 'Ranveer Allahbadia', followers: '3.5M', mediaCount: 2400, er: 3.20, convFactor: 0.022 },
    { id: 46, region: 'Global', category: 'Lifestyle', name: 'Alex Cooper', followers: '5.2M', mediaCount: 800, er: 4.80, convFactor: 0.014 },
    { id: 47, region: 'India', category: 'Lifestyle', name: 'Dolly Singh', followers: '1.6M', mediaCount: 1700, er: 3.90, convFactor: 0.02 },
    { id: 48, region: 'Global', category: 'Lifestyle', name: 'David Dobrik', followers: '10.5M', mediaCount: 600, er: 6.10, convFactor: 0.007 },
    { id: 49, region: 'India', category: 'Lifestyle', name: 'Gaurav Taneja (Flying Beast)', followers: '3.9M', mediaCount: 1400, er: 4.50, convFactor: 0.025 },
    { id: 50, region: 'Global', category: 'Lifestyle', name: 'MrBeast', followers: '240M', mediaCount: 780, er: 12.00, convFactor: 0.005 },
    { id: 51, region: 'India', category: 'Lifestyle', name: 'Bhuvan Bam', followers: '19.5M', mediaCount: 500, er: 7.20, convFactor: 0.011 },
    { id: 52, region: 'India', category: 'Lifestyle', name: 'CarryMinati', followers: '21.2M', mediaCount: 600, er: 6.80, convFactor: 0.006 },
    { id: 53, region: 'India', category: 'Lifestyle', name: 'Ashish Chanchlani', followers: '15.1M', mediaCount: 550, er: 5.40, convFactor: 0.009 },
    { id: 61, region: 'Global', category: 'Travel', name: 'Chris Burkard', followers: '4.0M', mediaCount: 3850, er: 1.50, convFactor: 0.008 },
    { id: 62, region: 'India', category: 'Travel', name: 'Anunay Sood', followers: '1.2M', mediaCount: 950, er: 5.40, convFactor: 0.012 },
    { id: 63, region: 'India', category: 'Travel', name: 'Larissa D\'Sa', followers: '750k', mediaCount: 2100, er: 4.10, convFactor: 0.015 },
    { id: 64, region: 'Global', category: 'Travel', name: 'Sam Kolder', followers: '1.8M', mediaCount: 420, er: 7.10, convFactor: 0.02 },
    { id: 65, region: 'India', category: 'Travel', name: 'Varun Aditya', followers: '3.9M', mediaCount: 1150, er: 6.50, convFactor: 0.007 },
    { id: 91, region: 'India', category: 'Finance', name: 'Sharan Hegde', followers: '2.6M', mediaCount: 850, er: 4.50, convFactor: 0.028 },
    { id: 92, region: 'India', category: 'Finance', name: 'Ankur Warikoo', followers: '3.2M', mediaCount: 4100, er: 2.20, convFactor: 0.02 },
    { id: 93, region: 'Global', category: 'Finance', name: 'Graham Stephan', followers: '4.6M', mediaCount: 1200, er: 2.10, convFactor: 0.022 },
    { id: 94, region: 'India', category: 'Gaming', name: 'Mortal (Naman)', followers: '5.5M', mediaCount: 1400, er: 4.10, convFactor: 0.012 },
    { id: 95, region: 'India', category: 'Gaming', name: 'Techno Gamerz', followers: '35M', mediaCount: 950, er: 3.80, convFactor: 0.009 },
    { id: 96, region: 'Global', category: 'Gaming', name: 'PewDiePie', followers: '111M', mediaCount: 4700, er: 1.50, convFactor: 0.005 },
    { id: 97, region: 'India', category: 'Education', name: 'PhysicsWallah', followers: '12M', mediaCount: 5000, er: 5.20, convFactor: 0.045 },
    { id: 98, region: 'India', category: 'Food', name: 'Your Food Lab', followers: '4.5M', mediaCount: 2100, er: 3.90, convFactor: 0.031 },
];

// ROI Prediction Logic (based on Python model)
const calculateROI = (
    niche: string,
    platform: string,
    reach: number,
    engagementRatePercent: number,
    duration: number,
    productPrice: number
) => {
    // Calculate raw engagements from ER%
    const calculatedEngagements = Math.round((engagementRatePercent / 100) * reach);

    // Clip ER to 1.0-5.0 range (as per model training)
    const erClipped = Math.max(1.0, Math.min(5.0, engagementRatePercent));

    // Simplified prediction model (approximates the trained RandomForest)
    // Base prediction considers engagements, reach, duration, and ER
    const nicheFactor = niche === 'Tech' ? 1.0 : niche === 'Fashion' ? 1.15 : niche === 'Gaming' ? 0.9 : 1.05;
    const platformFactor = platform === 'YouTube' ? 1.0 : platform === 'Instagram' ? 1.1 : platform === 'TikTok' ? 0.95 : 0.85;

    // Model approximation: weighted combination of features
    const rawPrediction = (
        (calculatedEngagements * 0.85) +
        (reach / 50000) * 50 +
        (duration * 8) +
        (erClipped * 100)
    ) * nicheFactor * platformFactor;

    const predictedSales = Math.round(rawPrediction * 0.8);

    // ROI Calculation (from Python code)
    const cpm = niche === 'Tech' ? 35 : 20;
    const fixedFee = (reach / 1000) * cpm;
    const talentFee = fixedFee * (1 + (erClipped / 10));
    const revenue = predictedSales * productPrice;
    const totalCost = talentFee + (revenue * 0.10);
    const netProfit = revenue - totalCost - (revenue * 0.40);
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    return {
        calculatedEngagements,
        erClipped,
        predictedSales,
        revenue: Math.round(revenue),
        totalCost: Math.round(totalCost),
        talentFee: Math.round(talentFee),
        netProfit: Math.round(netProfit),
        roi: parseFloat(roi.toFixed(2))
    };
};

const BusinessAnalysis = () => {
    const [results, setResults] = useState<any>(null);
    const [showInfluencers, setShowInfluencers] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        niche: 'Tech',
        platform: 'YouTube',
        followers: 100000,
        engagementRate: 2.55,
        duration: 20,
        price: 10
    });

    // Get unique niches for filtering
    const niches = useMemo(() => {
        const uniqueNiches = [...new Set(INFLUENCER_DATA.map(i => i.category))];
        return uniqueNiches.sort();
    }, []);

    // Filter influencers by selected niche and search query
    const filteredInfluencers = useMemo(() => {
        return INFLUENCER_DATA.filter(inf => {
            const matchesNiche = inf.category.toLowerCase() === formData.niche.toLowerCase() ||
                (formData.niche === 'Fashion' && inf.category === 'Fashion');
            const matchesSearch = searchQuery === '' ||
                inf.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesNiche && matchesSearch;
        });
    }, [formData.niche, searchQuery]);

    const handleChange = (e: any) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleAnalyze = () => {
        const result = calculateROI(
            formData.niche,
            formData.platform,
            formData.followers,
            formData.engagementRate,
            formData.duration,
            formData.price
        );
        setResults(result);
    };

    // Auto-analyze on form change
    useEffect(() => {
        if (formData.followers > 0 && formData.engagementRate > 0) {
            handleAnalyze();
        }
    }, [formData]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Calculator className="text-brand-primary" /> Business Impact Analysis
                </h1>
                <p className="text-dark-muted">Predict ROI and campaign performance using our prediction model.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Input Form */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-dark-surface border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Target className="text-brand-secondary" size={20} /> Campaign Parameters
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">Niche</label>
                                <select name="niche" value={formData.niche} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors">
                                    <option>Tech</option>
                                    <option>Fashion</option>
                                    <option>Lifestyle</option>
                                    <option>Travel</option>
                                    <option>Gaming</option>
                                    <option>Finance</option>
                                    <option>Education</option>
                                    <option>Food</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">Platform</label>
                                <select name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors">
                                    <option>YouTube</option>
                                    <option>Instagram</option>
                                    <option>TikTok</option>
                                    <option>Twitter</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">Reach / Followers</label>
                                <input
                                    type="number"
                                    name="followers"
                                    value={formData.followers}
                                    onChange={handleChange}
                                    className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">
                                    Engagement Rate % <span className="text-brand-primary">(e.g., 3.5)</span>
                                </label>
                                <input
                                    type="number"
                                    name="engagementRate"
                                    value={formData.engagementRate}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">Duration (Days)</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">Product Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                className="w-full bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-secondary hover:to-brand-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <Calculator size={20} /> Calculate ROI
                            </button>
                        </div>
                    </section>
                </div>

                {/* Results Display */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {results ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Analysis Header */}
                                <div className="bg-gradient-to-r from-brand-primary/10 to-purple-500/10 border border-brand-primary/20 rounded-2xl p-4">
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        === ROI ANALYSIS: {formData.niche.toUpperCase()} ===
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        Input ER: <span className="text-brand-primary font-bold">{formData.engagementRate}%</span> |
                                        Calculated Raw Engagements: <span className="text-brand-primary font-bold">{results.calculatedEngagements.toLocaleString()}</span>
                                    </p>
                                </div>

                                {/* Key Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><DollarSign size={20} /></div>
                                            <span className="text-sm text-green-200">Predicted Sales</span>
                                        </div>
                                        <div className="text-3xl font-bold text-white">{results.predictedSales.toLocaleString()}</div>
                                        <div className="text-xs text-green-400 mt-2">units</div>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Target size={20} /></div>
                                            <span className="text-sm text-blue-200">Net ROI</span>
                                        </div>
                                        <div className={`text-3xl font-bold ${results.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {results.roi}%
                                        </div>
                                        <div className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                                            <TrendingUp size={12} /> Return on Investment
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><DollarSign size={20} /></div>
                                            <span className="text-sm text-purple-200">Campaign Cost</span>
                                        </div>
                                        <div className="text-3xl font-bold text-white">${results.totalCost.toLocaleString()}</div>
                                        <div className="text-xs text-purple-400 mt-2">total investment</div>
                                    </div>
                                </div>

                                {/* Detailed Breakdown */}
                                <section className="bg-dark-surface border border-white/5 rounded-2xl p-6 shadow-xl">
                                    <h3 className="text-lg font-bold text-white mb-4">Financial Breakdown</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-white/5 rounded-xl">
                                            <div className="text-2xl font-bold text-white">${results.revenue.toLocaleString()}</div>
                                            <div className="text-xs text-dark-muted mt-1">Gross Revenue</div>
                                        </div>
                                        <div className="text-center p-4 bg-white/5 rounded-xl">
                                            <div className="text-2xl font-bold text-white">${results.talentFee.toLocaleString()}</div>
                                            <div className="text-xs text-dark-muted mt-1">Talent Fee</div>
                                        </div>
                                        <div className="text-center p-4 bg-white/5 rounded-xl">
                                            <div className="text-2xl font-bold text-white">${results.totalCost.toLocaleString()}</div>
                                            <div className="text-xs text-dark-muted mt-1">Total Cost</div>
                                        </div>
                                        <div className="text-center p-4 bg-white/5 rounded-xl">
                                            <div className={`text-2xl font-bold ${results.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                ${results.netProfit.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-dark-muted mt-1">Net Profit</div>
                                        </div>
                                    </div>
                                </section>

                            </motion.div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center bg-dark-bg/50 border border-white/5 rounded-3xl border-dashed p-12 text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                    <Calculator className="w-10 h-10 text-dark-muted" />
                                </div>
                                <h3 className="text-xl font-medium text-white mb-2">Ready to Analyze</h3>
                                <p className="text-dark-muted max-w-xs">Enter your campaign parameters to get ROI predictions.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* Influencer List Section */}
            <section className="bg-dark-surface border border-white/5 rounded-2xl p-6 shadow-xl">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowInfluencers(!showInfluencers)}
                >
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <Users className="text-brand-primary" />
                        {formData.niche} Influencers
                        <span className="text-sm font-normal text-dark-muted">({filteredInfluencers.length} found)</span>
                    </h2>
                    {showInfluencers ? <ChevronUp className="text-dark-muted" /> : <ChevronDown className="text-dark-muted" />}
                </div>

                <AnimatePresence>
                    {showInfluencers && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            {/* Search */}
                            <div className="relative mt-4 mb-4">
                                <Search className="absolute left-4 top-3.5 text-dark-muted" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search influencers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-dark-bg border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-dark-muted focus:outline-none focus:border-brand-primary"
                                />
                            </div>

                            {/* Influencer Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {filteredInfluencers.length > 0 ? (
                                    filteredInfluencers.map((inf) => (
                                        <div
                                            key={inf.id}
                                            className="bg-dark-bg/50 border border-white/5 rounded-xl p-4 hover:border-brand-primary/30 transition-all cursor-pointer"
                                            onClick={() => {
                                                // Parse followers to number and set form data
                                                let followersNum = 0;
                                                const followersStr = inf.followers.replace(/,/g, '');
                                                if (followersStr.includes('M')) {
                                                    followersNum = parseFloat(followersStr) * 1000000;
                                                } else if (followersStr.includes('k')) {
                                                    followersNum = parseFloat(followersStr) * 1000;
                                                } else {
                                                    followersNum = parseFloat(followersStr);
                                                }
                                                setFormData(prev => ({
                                                    ...prev,
                                                    followers: Math.round(followersNum),
                                                    engagementRate: inf.er
                                                }));
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-white text-sm leading-tight">{inf.name}</h4>
                                                <span className="text-xs bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full">{inf.region}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 mt-3">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-white">{inf.followers}</div>
                                                    <div className="text-xs text-dark-muted">Followers</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-brand-primary">{inf.er}%</div>
                                                    <div className="text-xs text-dark-muted">ER</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-purple-400">{inf.mediaCount}</div>
                                                    <div className="text-xs text-dark-muted">Posts</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8 text-dark-muted">
                                        No influencers found for this niche. Try selecting a different category.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default BusinessAnalysis;
