import { useState } from 'react';
import { useInsights } from '../../hooks/useInsights';
import {
    Loader,
    Video,
    Image as ImageIcon,
    Clock,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    BarChart2
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
import { motion, AnimatePresence } from 'framer-motion';

const DetailedAnalysis = () => {
    const { data, loading: insightsLoading } = useInsights();
    const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'youtube'>('instagram');
    const [selectedPost, setSelectedPost] = useState<any | null>(null);

    // Analysis State
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Mock recent posts if none found (for demo/fallback)
    const posts = selectedPlatform === 'instagram'
        ? (data?.instagram?.recent_posts || [])
        : [];
    // Note: YouTube recent posts aren't fully structured in useInsights yet, 
    // need to check if data.youtube has videos array or we mock it.
    // data.youtube only has stats. Let's rely on Instagram mostly or mock YouTube list if needed.

    // If YouTube selected and no list, maybe show manual URL input or mock?
    // Let's add a manual URL input fallback for YouTube.

    const [manualUrl, setManualUrl] = useState('');

    const handleAnalyze = async () => {
        if (!selectedPost && !manualUrl) return;

        setAnalyzing(true);
        setError(null);
        setAnalysisResult(null);

        const urlToAnalyze = selectedPost
            ? (selectedPost.permalink || selectedPost.media_url || "https://placeholder.url") // API needs to return permalink/media_url. 
            // In our current server.js, recent_posts has { id, type, likes, comments, timestamp }. 
            // We might need to fetch permalink in server.js to be useful, but for now we'll pass ID/Type and maybe the user can assume.
            // Actually, for the new detailed analysis, we need the actual asset URL or we simulate it.
            // Let's assume for this proto, we send the ID and the backend constructs/fetches it or we mock the "fileUri" in backend if it's not real public URL.
            // Wait, the user snippet used a direct fileUri. 
            // We'll send the ID and let the backend handle fetching the media URL if possible, or use the manual URL.
            : manualUrl;

        try {
            const res = await fetch('/api/ai/deep-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    platform: selectedPlatform,
                    url: urlToAnalyze,
                    postData: selectedPost
                })
            });

            const json = await res.json();
            if (json.error) throw new Error(json.error);
            setAnalysisResult(json);
        } catch (e: any) {
            setError(e.message || "Analysis failed");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 text-white min-h-screen pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-secondary to-brand-primary w-fit">
                    Deep Content Analysis
                </h1>
                <p className="text-gray-400 mt-1">AI-powered second-by-second breakdown of your content performance.</p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

                {/* Left Panel: Content Selector */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Platform Tabs */}
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
                        <button
                            onClick={() => { setSelectedPlatform('instagram'); setSelectedPost(null); }}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${selectedPlatform === 'instagram' ? 'bg-brand-primary text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            Instagram
                        </button>
                        <button
                            onClick={() => { setSelectedPlatform('youtube'); setSelectedPost(null); }}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${selectedPlatform === 'youtube' ? 'bg-[#ff0000] text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            YouTube
                        </button>
                    </div>

                    {/* Content List */}
                    <div className="bg-[#0f0f1a] border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 border-b border-white/5 bg-white/5">
                            <h3 className="font-bold">Select Content</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                            {selectedPlatform === 'youtube' && (
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-4">
                                    <p className="text-xs text-gray-400 mb-2">Analyze any YouTube Video URL</p>
                                    <input
                                        type="text"
                                        placeholder="Paste video link..."
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-primary outline-none"
                                        value={manualUrl}
                                        onChange={(e) => setManualUrl(e.target.value)}
                                    />
                                </div>
                            )}

                            {insightsLoading ? (
                                <div className="flex justify-center py-10"><Loader className="animate-spin text-gray-500" /></div>
                            ) : posts.length > 0 ? (
                                posts.map((post: any) => (
                                    <div
                                        key={post.id}
                                        onClick={() => setSelectedPost(post)}
                                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${selectedPost?.id === post.id ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white/5 border-transparent hover:border-white/10'}`}
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center text-gray-500 shrink-0">
                                            {post.type === 'VIDEO' ? <Video size={20} /> : <ImageIcon size={20} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate text-white">Post {post.timestamp ? new Date(post.timestamp).toLocaleDateString() : ''}</p>
                                            <div className="flex gap-3 text-xs text-gray-400 mt-1">
                                                <span className="flex items-center gap-1">❤️ {post.likes}</span>
                                                <span className="flex items-center gap-1">💬 {post.comments}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                selectedPlatform === 'instagram' && <div className="text-center text-gray-500 py-10">No recent posts found.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Center/Right Panel: Analysis Results */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Action Area */}
                    <div className="bg-[#0f0f1a] border border-white/5 rounded-3xl p-6 min-h-[200px] flex flex-col items-center justify-center relative overflow-hidden">

                        {!analyzing && (
                            <div className="text-center z-10 max-w-md">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BarChart2 className="w-8 h-8 text-brand-primary" />
                                </div>
                                <h2 className="text-xl font-bold mb-2">Ready to Analyze</h2>
                                <p className="text-gray-400 mb-6 text-sm">Select a post from the left sidebar or paste a URL to generate a deep second-by-second retention analysis.</p>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={(!selectedPost && !manualUrl)}
                                    className="px-8 py-3 bg-brand-primary text-black font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Start Deep Analysis
                                </button>
                            </div>
                        )}

                        {analyzing && (
                            <div className="text-center z-10">
                                <Loader className="w-12 h-12 text-brand-primary animate-spin mx-auto mb-4" />
                                <h3 className="text-xl font-bold animate-pulse">Processing Content...</h3>
                                <p className="text-gray-400 mt-2 text-sm">Analyzing video frames, audio sentiment, and retention patterns.</p>
                            </div>
                        )}

                        {error && (
                            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
                                <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                                <p className="text-red-400 font-bold">{error}</p>
                                <button
                                    onClick={() => setError(null)}
                                    className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />
                    </div>

                    {/* Results Display */}
                    <AnimatePresence>
                        {analysisResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Top Stats Row */}
                                <h1 className="text-2xl font-bold text-white">Deep Analysis Result</h1>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Overall Score</p>
                                        <div className="text-4xl font-bold text-white">{analysisResult.overall_score} <span className="text-lg text-gray-500 font-normal">/ 100</span></div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Est. Avg Watch Time</p>
                                        <div className="text-3xl font-bold text-brand-secondary">{analysisResult.metrics?.avg_watch_time || "N/A"}</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Skip Rate</p>
                                        <div className="text-3xl font-bold text-red-400">{analysisResult.metrics?.skip_rate || "N/A"}</div>
                                    </div>
                                </div>

                                {/* Retention Graph */}
                                <div className="bg-[#0f0f1a] border border-white/5 rounded-3xl p-6 h-[350px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <TrendingUp className="text-brand-primary" size={18} />
                                            Retention Flow
                                        </h3>
                                        <div className="text-xs text-gray-400">Second-by-Second Engagement</div>
                                    </div>
                                    <div className="w-full h-full min-h-0 pb-6">
                                        <ResponsiveContainer width="100%" height="90%">
                                            <AreaChart data={analysisResult.retention_graph || []}>
                                                <defs>
                                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                                <XAxis dataKey="second" stroke="#555" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}s`} />
                                                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Timeline & Insights Split */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Timeline Events */}
                                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                                        <h3 className="font-bold mb-4 flex items-center gap-2">
                                            <Clock className="text-brand-secondary" size={18} />
                                            Key Moments
                                        </h3>
                                        <div className="space-y-4">
                                            {analysisResult.timeline_events?.map((event: any, i: number) => (
                                                <div key={i} className="flex gap-4 items-start group">
                                                    <div className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-brand-primary mt-1">
                                                        {event.time}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-sm text-white">{event.event}</span>
                                                            {event.type === 'positive' ? (
                                                                <CheckCircle2 size={12} className="text-emerald-500" />
                                                            ) : (
                                                                <AlertCircle size={12} className="text-red-500" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{event.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                                        <h3 className="font-bold mb-4">AI Analysis Summary</h3>
                                        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                                            {analysisResult.summary}
                                        </div>
                                    </div>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DetailedAnalysis;
