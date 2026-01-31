
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Calculator, Loader, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BusinessAnalysis = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [formData, setFormData] = useState({
        niche: 'Tech',
        platform: 'Instagram',
        followers: 100000,
        engagement: 5000,
        duration: 7,
        price: 50
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setResults(null);
        try {
            const res = await fetch('/api/business/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setResults(data);
        } catch (e) {
            console.error(e);
            alert("Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Calculator className="text-brand-primary" /> Business Impact Analysis
                </h1>
                <p className="text-dark-muted">Predict ROI and campaign performance using advanced AI models.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Input Form */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-dark-surface border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Target className="text-brand-secondary" size={20} /> Parameters
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">Niche</label>
                                <select name="niche" value={formData.niche} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors">
                                    <option>Tech</option>
                                    <option>Fashion</option>
                                    <option>Lifestyle</option>
                                    <option>Health</option>
                                    <option>Gaming</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">Platform</label>
                                <select name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors">
                                    <option>Instagram</option>
                                    <option>YouTube</option>
                                    <option>TikTok</option>
                                    <option>Twitter</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">Followers</label>
                                    <input type="number" name="followers" value={formData.followers} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary" />
                                </div>
                                <div>
                                    <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">Engagement</label>
                                    <input type="number" name="engagement" value={formData.engagement} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">Duration (Days)</label>
                                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary" />
                                </div>
                                <div>
                                    <label className="text-xs text-dark-muted uppercase font-bold tracking-wider mb-2 block">Avg Price ($)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary" />
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-secondary hover:to-brand-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? <Loader className="animate-spin" /> : <><Calculator size={20} /> Run Analysis</>}
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
                                {/* Key Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><DollarSign size={20} /></div>
                                            <span className="text-sm text-green-200">Predicted Revenue</span>
                                        </div>
                                        <div className="text-4xl font-bold text-white">${results.revenue.toLocaleString()}</div>
                                        <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
                                            <TrendingUp size={12} /> {results.predicted_sales} Unit Sales
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Target size={20} /></div>
                                            <span className="text-sm text-blue-200">Net ROI</span>
                                        </div>
                                        <div className="text-4xl font-bold text-white">{results.net_roi}%</div>
                                        <div className="text-xs text-blue-400 mt-2">
                                            Cost: ${results.total_cost.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* AI Analysis */}
                                <section className="bg-dark-surface border border-white/5 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500" />
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <TrendingUp className="text-purple-400" /> AI Strategic Insight
                                    </h3>
                                    <div className="prose prose-invert max-w-none text-gray-300">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {results.analysis}
                                        </ReactMarkdown>
                                    </div>
                                </section>

                            </motion.div>
                        ) : (
                            !loading && (
                                <div className="h-full flex flex-col items-center justify-center bg-dark-bg/50 border border-white/5 rounded-3xl border-dashed p-12 text-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <Calculator className="w-10 h-10 text-dark-muted" />
                                    </div>
                                    <h3 className="text-xl font-medium text-white mb-2">Ready to Analyze</h3>
                                    <p className="text-dark-muted max-w-xs">Enter your campaign parameters to get AI-powered predictions and ROI analysis.</p>
                                </div>
                            )
                        )}

                        {loading && (
                            <div className="h-64 flex flex-col items-center justify-center">
                                <Loader className="w-12 h-12 text-brand-primary animate-spin mb-4" />
                                <p className="text-white font-medium animate-pulse">Running Prediction Model...</p>
                                <p className="text-xs text-dark-muted mt-2">Connecting to Neural Engine...</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default BusinessAnalysis;
