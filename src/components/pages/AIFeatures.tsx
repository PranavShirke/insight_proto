import React, { useState } from 'react';
import {
    Sparkles,
    Radar,
    Dna,
    Users,
    Wand2,
    Skull,
    Ghost,
    FileSearch,
    Scale,
    Calendar,
} from 'lucide-react';
import { useInsights } from '../../hooks/useInsights';
import { motion } from 'framer-motion';

const TABS = [
    { id: 'viral', label: 'Viral Predictor', icon: Sparkles },
    { id: 'trend', label: 'Trend Radar', icon: Radar },
    { id: 'dna', label: 'Content DNA', icon: Dna },
    { id: 'audience', label: 'Audience Clone', icon: Users },
    { id: 'caption', label: 'Caption Wizard', icon: Wand2 },
    { id: 'postmortem', label: 'Post Mortem', icon: Skull },
    { id: 'competitor', label: 'Competitor Ghost', icon: Ghost },
    { id: 'content', label: 'Content Strategy', icon: FileSearch },
    { id: 'comparison', label: 'Benchmarker', icon: Scale },
    { id: 'scheduling', label: 'Smart Schedule', icon: Calendar },
];

const STORAGE_KEY_PREFIX = 'insight_ai_feature_';

const TrendRadar = ({ stats }: { stats: any }) => {
    const [nicheInput, setNicheInput] = useState('');
    const [trendLoading, setTrendLoading] = useState(false);
    const [trendResult, setTrendResult] = useState<any>(null);

    // Initial Load
    React.useEffect(() => {
        const cached = localStorage.getItem(STORAGE_KEY_PREFIX + 'trend');
        if (cached) setTrendResult(JSON.parse(cached));
    }, []);

    const handleTrendScan = async () => {
        if (!nicheInput && !trendResult) setNicheInput("General"); // Default

        setTrendLoading(true);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    feature_type: 'trend-radar',
                    query: nicheInput || "Technology",
                    context: { user_profile: stats }
                })
            });
            const json = await res.json();
            setTrendResult(json);
            localStorage.setItem(STORAGE_KEY_PREFIX + 'trend', JSON.stringify(json));
        } catch (e) {
            console.error(e);
        } finally {
            setTrendLoading(false);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col items-center relative overflow-hidden">

            {/* Input Overlay */}
            <div className="absolute top-8 right-8 z-30 flex gap-2">
                <input
                    type="text"
                    value={nicheInput}
                    onChange={(e) => setNicheInput(e.target.value)}
                    placeholder="Enter Niche (e.g. AI, Fashion)..."
                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-brand-primary outline-none transition-colors w-[200px]"
                    onKeyDown={(e) => e.key === 'Enter' && handleTrendScan()}
                />
                <button
                    onClick={handleTrendScan}
                    disabled={trendLoading}
                    className="p-2 bg-brand-primary rounded-lg text-black hover:bg-brand-secondary transition-colors disabled:opacity-50"
                >
                    {trendLoading ? <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" /> : <Radar size={20} />}
                </button>
            </div>

            {/* Text Content */}
            <div className="absolute top-8 left-8 z-20">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-primary">
                        <Radar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Trend Radar</h2>
                        <p className="text-xs text-gray-400">Scanning: {trendResult?.niche || "Global"}</p>
                    </div>
                </div>
            </div>

            {/* Radar Visualization */}
            <div className="relative w-[400px] h-[400px] flex items-center justify-center mt-10">
                {/* Concentric Circles */}
                <div className="absolute inset-0 border border-white/5 rounded-full" />
                <div className="absolute inset-[50px] border border-white/5 rounded-full" />
                <div className="absolute inset-[100px] border border-white/5 rounded-full" />
                <div className="absolute inset-[150px] border border-white/5 rounded-full" />

                {/* Rotating Scanner Line */}
                <div className={`absolute inset-0 ${trendLoading ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_8s_linear_infinite]'}`}>
                    <div className="w-1/2 h-1/2 bg-gradient-to-t from-transparent via-brand-primary/20 to-brand-primary/50 origin-bottom-right rounded-tl-full blur-sm"
                        style={{ clipPath: 'polygon(100% 100%, 0 0, 100% 0)' }}
                    />
                </div>

                {/* Trend Dots (Mapped from API) */}
                {trendResult && trendResult.trends?.map((trend: any, i: number) => {
                    // Random positions for visual flair (deterministic based on index)
                    const angle = (i * (360 / (trendResult.trends.length || 1))) * (Math.PI / 180);
                    const distance = 120 + (i % 2) * 50; // Vary distance
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;

                    return (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="absolute w-auto flex flex-col items-center group cursor-pointer z-40"
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                        >
                            <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${i === 0 ? 'bg-brand-primary text-brand-primary' : i === 1 ? 'bg-brand-secondary text-brand-secondary' : 'bg-pink-500 text-pink-500'}`} />

                            {/* Label */}
                            <div className="absolute top-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                <p className="text-xs font-bold text-white">{trend.name}</p>
                                <p className="text-[10px] text-emerald-400">{trend.growth}</p>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Default Dots if no result yet */}
                {!trendResult && !trendLoading && (
                    <>
                        <div className="absolute top-20 right-30 w-3 h-3 bg-white/10 rounded-full" />
                        <div className="absolute bottom-32 left-24 w-3 h-3 bg-white/10 rounded-full" />
                    </>
                )}

            </div>

            {/* List View Below */}
            {trendResult && (
                <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-20">
                    {trendResult.trends?.map((trend: any, i: number) => (
                        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors">
                            <div>
                                <h4 className="font-bold text-sm text-white">{trend.name}</h4>
                                <span className="text-xs text-gray-500">{trend.category}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-emerald-400 text-sm font-bold">{trend.growth}</div>
                                <span className="text-[10px] uppercase tracking-wide text-gray-600 font-bold">{trend.relevance} Relevance</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};



const ContentDNAView = ({ stats }: { stats: any }) => {
    const [dnaLoading, setDnaLoading] = useState(false);
    const [dnaResult, setDnaResult] = useState<any>(null);

    React.useEffect(() => {
        const cached = localStorage.getItem(STORAGE_KEY_PREFIX + 'dna');
        if (cached) setDnaResult(JSON.parse(cached));
    }, []);

    const handleDnaScan = async () => {
        setDnaLoading(true);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    feature_type: 'content-dna',
                    context: {
                        stats: stats || "New user, minimal data.",
                        note: "Analyze based on available metrics"
                    }
                })
            });
            const json = await res.json();
            setDnaResult(json);
            localStorage.setItem(STORAGE_KEY_PREFIX + 'dna', JSON.stringify(json));
        } catch (e) {
            console.error(e);
        } finally {
            setDnaLoading(false);
        }
    };

    if (!dnaResult && !dnaLoading) {
        return (
            <div className="text-center max-w-lg">
                <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Dna className="w-10 h-10 text-brand-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Decode Your Content DNA</h2>
                <p className="text-gray-400 mb-8">Let AI analyze your unique voice, winning formats, and brand archetype.</p>
                <button
                    onClick={handleDnaScan}
                    className="px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                >
                    Start Analysis
                </button>
            </div>
        );
    }

    if (dnaLoading) {
        return (
            <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400 animate-pulse">Sequencing your content...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 bg-black/20 rounded-2xl p-6 border border-brand-primary/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-primary/5 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 z-10">Your Archetype</h3>
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-primary to-purple-600 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(6,182,212,0.4)] z-10">
                    <Dna className="text-white w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold z-10">{dnaResult.archetype}</h2>
                <div className="flex flex-wrap justify-center gap-2 mt-4 z-10">
                    {dnaResult.voice?.map((v: string, i: number) => (
                        <span key={i} className="px-2 py-1 rounded bg-white/10 text-[10px] uppercase font-bold text-gray-300">{v}</span>
                    ))}
                </div>
            </div>

            <div className="col-span-2 space-y-4">
                <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Dominant Traits</h3>
                    <div className="space-y-4">
                        {dnaResult.traits?.map((trait: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-white">{trait.name}</span>
                                    <span className="text-brand-primary">{trait.score}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${trait.score}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="h-full bg-brand-primary"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl p-6 border border-brand-primary/20">
                    <h3 className="text-xs font-bold text-brand-primary uppercase mb-2">Winning Formula</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        "{dnaResult.winning_formula}"
                    </p>
                </div>
                <div className="text-center mt-4">
                    <button onClick={handleDnaScan} className="px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                        Rescan
                    </button>
                </div>
            </div>
        </div>
    );
};

const AudienceCloneView = ({ stats }: { stats: any }) => {
    const [audienceLoading, setAudienceLoading] = useState(false);
    const [audienceResult, setAudienceResult] = useState<any>(null);

    React.useEffect(() => {
        const cached = localStorage.getItem(STORAGE_KEY_PREFIX + 'audience');
        if (cached) setAudienceResult(JSON.parse(cached));
    }, []);

    const handleAudienceScan = async () => {
        setAudienceLoading(true);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    feature_type: 'audience-clone',
                    context: {
                        analytics: stats || "General audience data"
                    }
                })
            });
            const json = await res.json();
            setAudienceResult(json);
            localStorage.setItem(STORAGE_KEY_PREFIX + 'audience', JSON.stringify(json));
        } catch (e) {
            console.error(e);
        } finally {
            setAudienceLoading(false);
        }
    };

    if (!audienceResult && !audienceLoading) {
        return (
            <div className="text-center max-w-lg">
                <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-brand-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Clone Your Audience</h2>
                <p className="text-gray-400 mb-8">Identify your "Superfans". AI analyzes who *really* loves your content so you can find more of them.</p>
                <button
                    onClick={handleAudienceScan}
                    className="px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                >
                    Find My Superfans
                </button>
            </div>
        );
    }

    if (audienceLoading) {
        return (
            <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400 animate-pulse">Scanning engagement patterns...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-primary to-blue-600 mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                    <Users className="text-white w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl">Top Persona</h3>
                <p className="text-brand-primary font-medium mt-1">"{audienceResult.top_persona}"</p>
                <div className="mt-6 w-full space-y-3 text-sm text-left bg-white/5 p-4 rounded-xl">
                    <div className="flex justify-between text-gray-400 border-b border-white/5 pb-2">
                        <span>Age</span>
                        <span className="text-white font-medium">{audienceResult.demographics?.age}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 border-b border-white/5 pb-2">
                        <span>Active</span>
                        <span className="text-white font-medium">{audienceResult.demographics?.active_hours}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Loc</span>
                        <span className="text-white font-medium">{audienceResult.demographics?.location}</span>
                    </div>
                </div>
            </div>

            <div className="col-span-2 space-y-6">
                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-left">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <FileSearch className="w-4 h-4 text-brand-primary" />
                        Content Preferences
                    </h3>
                    <div className="space-y-4">
                        {audienceResult.content_preferences?.map((pref: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{pref.type}</span>
                                    <span className="text-brand-primary">{pref.score}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pref.score}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`h-full ${i === 0 ? 'bg-brand-primary' : i === 1 ? 'bg-brand-secondary' : 'bg-purple-500'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-brand-secondary/10 p-6 rounded-2xl border border-white/10 text-left">
                    <h3 className="font-bold text-lg mb-2 text-purple-400">Psychographics</h3>
                    <div className="flex flex-wrap gap-2">
                        {audienceResult.psychographics?.map((trait: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-200">
                                {trait}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button onClick={handleAudienceScan} className="text-xs text-gray-500 hover:text-white underline decoration-dotted">
                        Re-analyze Audience
                    </button>
                </div>
            </div>
        </div>
    );
};

const CaptionWizardView = ({ stats }: { stats: any }) => {
    const [captionInput, setCaptionInput] = useState('');
    const [captionLoading, setCaptionLoading] = useState(false);
    const [captionResult, setCaptionResult] = useState<any>(null);

    React.useEffect(() => {
        const cached = localStorage.getItem(STORAGE_KEY_PREFIX + 'caption');
        if (cached) setCaptionResult(JSON.parse(cached));
    }, []);

    const handleCaptionGen = async () => {
        if (!captionInput) return;
        setCaptionLoading(true);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    feature_type: 'caption-wizard',
                    query: captionInput,
                    context: {
                        style_reference: stats
                    }
                })
            });
            const json = await res.json();
            setCaptionResult(json);
            localStorage.setItem(STORAGE_KEY_PREFIX + 'caption', JSON.stringify(json));
        } catch (e) {
            console.error(e);
        } finally {
            setCaptionLoading(false);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Caption Wizard</h2>
                        <p className="text-gray-400 text-sm">Describe your post, get viral captions.</p>
                    </div>
                    <textarea
                        value={captionInput}
                        onChange={(e) => setCaptionInput(e.target.value)}
                        className="flex-1 bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:ring-1 focus:ring-brand-primary outline-none resize-none min-h-[200px]"
                        placeholder="e.g. A photo of me working at a coffee shop on a rainy day, focusing on productivity..."
                    ></textarea>
                    <button
                        onClick={handleCaptionGen}
                        disabled={captionLoading || !captionInput}
                        className="bg-brand-primary text-black font-bold py-3 rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50"
                    >
                        {captionLoading ? 'Generating...' : 'Generate Captions'}
                    </button>
                </div>
                <div className="bg-black/20 border border-white/10 rounded-2xl p-6 overflow-y-auto custom-scrollbar">
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">AI Suggestions</h3>

                    {!captionResult && !captionLoading && (
                        <div className="text-center text-gray-500 mt-10">
                            <Wand2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Enter a description to get started.</p>
                        </div>
                    )}

                    {captionLoading && (
                        <div className="flex flex-col items-center justify-center h-40 gap-4">
                            <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full" />
                            <p className="text-xs text-brand-primary animate-pulse">Writing viral hooks...</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {captionResult?.captions?.map((caption: any, i: number) => (
                            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-primary/30 cursor-pointer transition-colors group relative">
                                <p className="text-sm text-gray-300 mb-2 group-hover:text-white leading-relaxed">{caption.text}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-2 mt-2">
                                    <span className={caption.score > 90 ? 'text-emerald-400 font-bold' : 'text-brand-primary'}>{caption.score}/100 Score</span>
                                    <span className="italic opacity-0 group-hover:opacity-100 transition-opacity line-clamp-1 max-w-[150px]">{caption.explanation}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(caption.text)}
                                        className="text-white bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PostMortemView = ({ stats }: { stats: any }) => {
    const [pmInput, setPmInput] = useState('');
    const [pmLoading, setPmLoading] = useState(false);
    const [pmResult, setPmResult] = useState<any>(null);

    React.useEffect(() => {
        const cached = localStorage.getItem(STORAGE_KEY_PREFIX + 'postmortem');
        if (cached) setPmResult(JSON.parse(cached));
    }, []);

    const handleAutopsy = async () => {
        if (!pmInput) return;
        setPmLoading(true);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    feature_type: 'post-mortem',
                    query: pmInput,
                    context: {
                        // Sending general stats alongside the specific query allows AI to compare
                        channel_baseline: stats,
                        query_note: "User thinks this underperformed."
                    }
                })
            });
            const json = await res.json();
            setPmResult(json);
            localStorage.setItem(STORAGE_KEY_PREFIX + 'postmortem', JSON.stringify(json));
        } catch (e) {
            console.error(e);
        } finally {
            setPmLoading(false);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">

            {!pmResult && !pmLoading && (
                <div className="max-w-xl w-full">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Skull className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3">Content Autopsy</h2>
                    <p className="text-gray-400 mb-8">Paste your underperforming post (or a description of it) to find out exactly why it flopped and how to revive it.</p>

                    <div className="flex gap-4 w-full mb-8">
                        <input
                            type="text"
                            value={pmInput}
                            onChange={(e) => setPmInput(e.target.value)}
                            placeholder="e.g. Video about my morning routine, got only 100 views..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-red-500 outline-none transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && handleAutopsy()}
                        />
                        <button
                            onClick={handleAutopsy}
                            disabled={pmLoading}
                            className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20 disabled:opacity-50"
                        >
                            Diagnose
                        </button>
                    </div>
                </div>
            )}

            {pmLoading && (
                <div>
                    <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-red-400 animate-pulse">Examining the evidence...</p>
                </div>
            )}

            {pmResult && (
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="col-span-1 bg-black/20 p-6 rounded-2xl border border-red-500/30 flex flex-col items-center text-center">
                        <h3 className="font-bold text-lg text-red-400 mb-2">Health Score</h3>
                        <div className="text-6xl font-black text-white mb-2">{pmResult.score}</div>
                        <div className="px-3 py-1 bg-red-500/20 rounded-full text-xs text-red-300 uppercase font-bold">Critical Condition</div>
                    </div>

                    <div className="col-span-2 space-y-4">
                        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                            <h3 className="font-bold text-lg mb-1">Diagnosis</h3>
                            <p className="text-gray-300 italic">"{pmResult.diagnosis}"</p>
                        </div>

                        <div className="space-y-2">
                            {pmResult.autopsy_report?.map((item: any, i: number) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${item.severity === 'Critical' ? 'bg-red-500 shadow-[0_0_10px_red]' : item.severity === 'Moderate' ? 'bg-orange-400' : 'bg-yellow-400'}`} />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-sm">{item.issue}</span>
                                            <span className="text-[10px] uppercase tracking-wider opacity-50 border border-white/20 px-1.5 rounded">{item.severity}</span>
                                        </div>
                                        <p className="text-xs text-gray-400">Rx: <span className="text-emerald-400">{item.fix}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-3 bg-gradient-to-r from-emerald-500/10 to-brand-primary/10 p-6 rounded-2xl border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-emerald-400 mb-1">Revived Version</h3>
                            <p className="text-sm text-gray-300">{pmResult.revived_version}</p>
                        </div>
                        <button
                            onClick={() => setPmResult(null)}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors whitespace-nowrap"
                        >
                            New Autopsy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CompetitorGhostView = () => {
    const [ghostInput, setGhostInput] = useState('');
    const [ghostLoading, setGhostLoading] = useState(false);
    const [ghostResult, setGhostResult] = useState<any>(null);

    React.useEffect(() => {
        const cached = localStorage.getItem(STORAGE_KEY_PREFIX + 'ghost');
        if (cached) setGhostResult(JSON.parse(cached));
    }, []);

    const handleGhostScan = async () => {
        if (!ghostInput) return;
        setGhostLoading(true);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    feature_type: 'competitor-ghost',
                    query: ghostInput
                })
            });
            const json = await res.json();
            setGhostResult(json);
            localStorage.setItem(STORAGE_KEY_PREFIX + 'ghost', JSON.stringify(json));
        } catch (e) {
            console.error(e);
        } finally {
            setGhostLoading(false);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
            {!ghostResult && !ghostLoading && (
                <div className="max-w-xl w-full">
                    <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Ghost className="w-10 h-10 text-purple-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3">Ghost Mode</h2>
                    <p className="text-gray-400 mb-8">Enter a competitor's handle to expose their weak spots and steal their winning tactics.</p>

                    <div className="flex gap-4 w-full mb-8">
                        <input
                            type="text"
                            value={ghostInput}
                            onChange={(e) => setGhostInput(e.target.value)}
                            placeholder="e.g. @MrBeast, @CompetitorX..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && handleGhostScan()}
                        />
                        <button
                            onClick={handleGhostScan}
                            disabled={ghostLoading}
                            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50"
                        >
                            Ghost Them
                        </button>
                    </div>
                </div>
            )}

            {ghostLoading && (
                <div>
                    <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-purple-400 animate-pulse">Infiltrating strategy...</p>
                </div>
            )}

            {ghostResult && (
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-purple-900/40 to-black/40 p-6 rounded-2xl border border-purple-500/30 flex items-center justify-between">
                        <div>
                            <h3 className="text-purple-300 text-sm uppercase tracking-widest font-bold mb-1">Target Acquired</h3>
                            <h2 className="text-3xl font-bold text-white mb-1">{ghostResult.competitor_profile?.name}</h2>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400 uppercase">Identified Weakness</div>
                            <div className="text-red-400 font-bold">{ghostResult.competitor_profile?.weakness}</div>
                        </div>
                    </div>

                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                        <h3 className="font-bold text-lg mb-4 text-emerald-400 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Exploitable Gaps
                        </h3>
                        <div className="space-y-4">
                            {ghostResult.gaps?.map((gap: any, i: number) => (
                                <div key={i} className="p-3 bg-white/5 rounded-lg">
                                    <div className="text-sm font-bold text-white mb-1">Gap: {gap.gap}</div>
                                    <div className="text-xs text-gray-400">Opportunity: <span className="text-emerald-400">{gap.opportunity}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                        <h3 className="font-bold text-lg mb-4 text-purple-400 flex items-center gap-2">
                            <Ghost className="w-4 h-4" />
                            Tactical Theft
                        </h3>
                        <ul className="space-y-2">
                            {ghostResult.stealable_tactics?.map((tact: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    {tact}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setGhostResult(null)}
                            className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors text-gray-400 hover:text-white"
                        >
                            Scan Another Competitor
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ContentStrategyView = ({ stats }: { stats: any }) => {
    const [strategyInput, setStrategyInput] = useState('');
    const [strategyLoading, setStrategyLoading] = useState(false);
    const [strategyResult, setStrategyResult] = useState<any>(null);

    React.useEffect(() => {
        const cached = localStorage.getItem(STORAGE_KEY_PREFIX + 'strategy');
        if (cached) setStrategyResult(JSON.parse(cached));
    }, []);

    const handleStrategyScan = async () => {
        if (!strategyInput) return;
        setStrategyLoading(true);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    feature_type: 'content-strategy',
                    query: strategyInput,
                    context: { stats: stats || "User stats not available" }
                })
            });
            const json = await res.json();
            setStrategyResult(json);
            localStorage.setItem(STORAGE_KEY_PREFIX + 'strategy', JSON.stringify(json));
        } catch (e) {
            console.error(e);
        } finally {
            setStrategyLoading(false);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
            {!strategyResult && !strategyLoading && (
                <div className="max-w-xl w-full">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileSearch className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3">Goal-Based Strategy</h2>
                    <p className="text-gray-400 mb-8">What is your main goal right now? (e.g. "Grow followers", "Sell e-book", "Build community")</p>

                    <div className="flex gap-4 w-full mb-8">
                        <input
                            type="text"
                            value={strategyInput}
                            onChange={(e) => setStrategyInput(e.target.value)}
                            placeholder="e.g. Increase engagement on my Reels..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && handleStrategyScan()}
                        />
                        <button
                            onClick={handleStrategyScan}
                            disabled={strategyLoading}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                        >
                            Generate Plan
                        </button>
                    </div>
                </div>
            )}

            {strategyLoading && (
                <div>
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-blue-400 animate-pulse">Designing your roadmap...</p>
                </div>
            )}

            {strategyResult && (
                <div className="w-full max-w-5xl text-left">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b border-white/5 pb-6">
                        <div>
                            <h3 className="text-blue-400 text-sm uppercase tracking-widest font-bold mb-1">Your Protocol</h3>
                            <h2 className="text-3xl font-bold text-white max-w-2xl">{strategyResult.strategy_name}</h2>
                            <p className="text-gray-400 mt-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                Focus: <span className="text-white">{strategyResult.focus}</span>
                            </p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-lg text-sm text-blue-200 mt-4 md:mt-0">
                            💡 Hack: {strategyResult.growth_hack}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {strategyResult.calendar?.map((day: any, i: number) => (
                            <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-bold text-gray-500 uppercase">{day.day}</span>
                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">{day.format}</span>
                                </div>
                                <h4 className="font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">{day.topic}</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">{day.why}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <button
                            onClick={() => setStrategyResult(null)}
                            className="text-gray-500 hover:text-white text-sm underline decoration-dotted"
                        >
                            Reset Strategy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ComparisonView = ({ stats }: { stats: any }) => {
    const [compInput, setCompInput] = useState('');
    const [compLoading, setCompLoading] = useState(false);
    const [compResult, setCompResult] = useState<any>(null);

    React.useEffect(() => {
        const cached = localStorage.getItem(STORAGE_KEY_PREFIX + 'comparison');
        if (cached) setCompResult(JSON.parse(cached));
    }, []);

    const handleCompScan = async () => {
        if (!compInput) return;
        setCompLoading(true);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    feature_type: 'comparison',
                    query: compInput,
                    context: { stats: stats || "User stats not available" }
                })
            });
            const json = await res.json();
            setCompResult(json);
            localStorage.setItem(STORAGE_KEY_PREFIX + 'comparison', JSON.stringify(json));
        } catch (e) {
            console.error(e);
        } finally {
            setCompLoading(false);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">

            {!compResult && !compLoading && (
                <div className="max-w-xl w-full">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Scale className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3">Benchmarker</h2>
                    <p className="text-gray-400 mb-8">Compare your performance against top creators in your niche.</p>

                    <div className="flex gap-4 w-full mb-8">
                        <input
                            type="text"
                            value={compInput}
                            onChange={(e) => setCompInput(e.target.value)}
                            placeholder="e.g. Finance, Beauty, Gaming..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && handleCompScan()}
                        />
                        <button
                            onClick={handleCompScan}
                            disabled={compLoading}
                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                        >
                            Compare
                        </button>
                    </div>
                </div>
            )}

            {compLoading && (
                <div>
                    <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-emerald-400 animate-pulse">Gathering industry data...</p>
                </div>
            )}

            {compResult && (
                <div className="w-full max-w-4xl text-left">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold">Niche Benchmark</h3>
                            <h2 className="text-3xl font-bold text-white">{compResult.niche}</h2>
                        </div>
                        <div className="text-right">
                            <button
                                onClick={() => setCompResult(null)}
                                className="text-sm text-gray-500 hover:text-white underline decoration-dotted"
                            >
                                Change Niche
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {compResult.metrics?.map((m: any, i: number) => (
                            <div key={i} className="bg-black/20 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                                <div>
                                    <div className="text-gray-400 text-sm font-medium mb-1">{m.label}</div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-bold text-white">{m.user}</span>
                                        <span className="text-xs text-gray-500 mb-1">vs {m.benchmark}</span>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${m.status === 'Elite' ? 'bg-purple-500/20 text-purple-300' :
                                    m.status === 'Good' ? 'bg-emerald-500/20 text-emerald-300' :
                                        m.status === 'Underperforming' ? 'bg-yellow-500/20 text-yellow-300' :
                                            'bg-red-500/20 text-red-300'
                                    }`}>
                                    {m.status}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-emerald-900/20 to-black/20 p-6 rounded-2xl border border-emerald-500/20">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-emerald-400 mb-1">Analyst Insight</h3>
                                <p className="text-gray-300 italic mb-4">"{compResult.insight}"</p>

                                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Recommended Action</h4>
                                    <p className="text-white text-sm font-medium">{compResult.action_plan}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SmartSchedulingView = ({ stats }: { stats: any }) => {
    const [schedInput, setSchedInput] = useState('');
    const [schedLoading, setSchedLoading] = useState(false);
    const [schedResult, setSchedResult] = useState<any>(null);

    React.useEffect(() => {
        const cached = localStorage.getItem(STORAGE_KEY_PREFIX + 'scheduling');
        if (cached) setSchedResult(JSON.parse(cached));
    }, []);

    const handleOptimize = async () => {
        setSchedLoading(true);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    feature_type: 'smart-scheduling',
                    query: schedInput || "Max Engagement",
                    context: {
                        audience_behavior: stats || "General behavior"
                    }
                })
            });
            const json = await res.json();
            setSchedResult(json);
            localStorage.setItem(STORAGE_KEY_PREFIX + 'scheduling', JSON.stringify(json));
        } catch (e) {
            console.error(e);
        } finally {
            setSchedLoading(false);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">

            {!schedResult && !schedLoading && (
                <div className="max-w-xl w-full">
                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-orange-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3">Smart Scheduler</h2>
                    <p className="text-gray-400 mb-8">Let AI analyze your audience's active hours to find your perfect posting windows.</p>

                    <div className="flex gap-4 w-full mb-8">
                        <input
                            type="text"
                            value={schedInput}
                            onChange={(e) => setSchedInput(e.target.value)}
                            placeholder="Optimization Goal (e.g. Comments, Views)..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-orange-500 outline-none transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && handleOptimize()}
                        />
                        <button
                            onClick={handleOptimize}
                            disabled={schedLoading}
                            className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50"
                        >
                            Optimize
                        </button>
                    </div>
                </div>
            )}

            {schedLoading && (
                <div>
                    <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-orange-400 animate-pulse">Syncing with audience timezones...</p>
                </div>
            )}

            {schedResult && (
                <div className="w-full max-w-4xl text-left">
                    <div className="mb-8 text-center md:text-left">
                        <h3 className="text-orange-400 uppercase tracking-widest text-xs font-bold mb-1">Optimal Strategy</h3>
                        <p className="text-xl font-medium text-white">"{schedResult.strategy_note}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-400 text-sm uppercase">Best Slots</h3>
                            {schedResult.best_times?.map((slot: any, i: number) => (
                                <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center justify-between hover:border-orange-500/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/10 p-2 rounded-lg font-bold text-lg w-16 text-center">{slot.time.split(' ')[0]} <span className="text-xs block font-normal text-gray-400">{slot.time.split(' ')[1]}</span></div>
                                        <div>
                                            <div className="font-bold text-white">{slot.day}</div>
                                            <div className="text-xs text-gray-400">{slot.reason}</div>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${slot.confidence === 'Very High' ? 'text-green-400 bg-green-500/10' : slot.confidence === 'High' ? 'text-emerald-400 bg-emerald-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>
                                        {slot.confidence}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                            <h3 className="font-bold text-gray-400 text-sm uppercase mb-6">Weekly Heatmap</h3>
                            <div className="grid grid-cols-7 gap-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <div key={day} className="flex flex-col items-center gap-2">
                                        <div className="relative w-full h-32 bg-white/5 rounded-lg overflow-hidden flex items-end">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(schedResult.heatmap_data[day] || 0) * 10}%` }}
                                                className="w-full bg-orange-500/50 hover:bg-orange-400 transition-colors"
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 font-bold">{day}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setSchedResult(null)}
                                className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors text-gray-400 hover:text-white"
                            >
                                Recalculate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AIFeatures = () => {
    const { data: stats } = useInsights();
    const [activeTab, setActiveTab] = useState('viral'); // Start with Viral as requested

    // Viral Predictor State
    const [viralInput, setViralInput] = useState('');
    const [viralLoading, setViralLoading] = useState(false);
    const [viralResult, setViralResult] = useState<any>(null);

    // Initial Load from Cache
    React.useEffect(() => {
        const cached = localStorage.getItem(STORAGE_KEY_PREFIX + 'viral');
        if (cached) setViralResult(JSON.parse(cached));
    }, []);

    const handleViralPredictor = async () => {
        if (!viralInput) return;
        setViralLoading(true);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    feature_type: 'viral-predictor',
                    query: viralInput,
                    context: {
                        recent_top_posts: stats || "New user"
                    }
                })
            });
            const json = await res.json();
            setViralResult(json);
            localStorage.setItem(STORAGE_KEY_PREFIX + 'viral', JSON.stringify(json));
        } catch (e) {
            console.error(e);
        } finally {
            setViralLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 text-white min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-secondary to-brand-primary w-fit">
                    AI Features
                </h1>
                <p className="text-gray-400 mt-2">10 unique AI-powered tools to supercharge your content</p>
            </div>

            {/* Navigation Tabs (Scrollable) */}
            <div className="flex gap-2 overflow-x-auto pb-4 border-b border-white/5 no-scrollbar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                            ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-brand-secondary/20 to-brand-primary/20 border-brand-primary/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                : 'bg-[#1e1e2d] border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                            }
                        `}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-brand-primary' : ''} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1">
                {activeTab === 'trend' && <TrendRadar stats={stats} />}

                {activeTab === 'viral' && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
                        <div className="relative z-10 w-full max-w-2xl">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold mb-2">Viral Predictor</h2>
                                <p className="text-gray-400">Describe your content idea to check its virality score</p>
                            </div>

                            <div className="flex gap-4 w-full mb-8">
                                <input
                                    type="text"
                                    value={viralInput}
                                    onChange={(e) => setViralInput(e.target.value)}
                                    placeholder="e.g. 'Day in the life of a software engineer at Google...'"
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-brand-primary outline-none transition-colors"
                                    onKeyDown={(e) => e.key === 'Enter' && handleViralPredictor()}
                                />
                                <button
                                    onClick={handleViralPredictor}
                                    disabled={viralLoading}
                                    className="px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                                >
                                    {viralLoading ? 'Analyzing...' : 'Predict'}
                                </button>
                            </div>

                            {/* Result Display */}
                            {viralResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left w-full"
                                >
                                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Virality Score</div>
                                        <div className="text-4xl font-bold text-brand-primary">{viralResult.score}/100</div>
                                        <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-brand-primary h-full transition-all duration-1000"
                                                style={{ width: `${viralResult.score}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Prediction</div>
                                        <p className="text-sm font-medium text-white">{viralResult.prediction}</p>
                                    </div>

                                    <div className="col-span-3 bg-black/20 p-4 rounded-xl border border-white/5">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-2">Key Factors</div>
                                        <div className="flex flex-wrap gap-2">
                                            {viralResult.factors?.map((f: any, i: number) => (
                                                <div key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs flex items-center gap-2">
                                                    <span className={f.score > 80 ? 'text-emerald-400' : 'text-yellow-400'}>{f.name}</span>
                                                    <span className="opacity-50">|</span>
                                                    <span className="text-gray-300">{f.comment}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'dna' && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                        <ContentDNAView stats={stats} />
                    </div>
                )}



                {activeTab === 'caption' && <CaptionWizardView stats={stats} />}

                {activeTab === 'audience' && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <AudienceCloneView stats={stats} />
                    </div>
                )}

                {activeTab === 'postmortem' && <PostMortemView stats={stats} />}

                {activeTab === 'competitor' && <CompetitorGhostView />}

                {activeTab === 'content' && <ContentStrategyView stats={stats} />}

                {activeTab === 'comparison' && <ComparisonView stats={stats} />}

                {activeTab === 'scheduling' && <SmartSchedulingView stats={stats} />}

                {/* Fallback for others */}
                {!['trend', 'viral', 'caption', 'audience', 'dna', 'postmortem', 'competitor', 'content', 'comparison', 'scheduling'].includes(activeTab) && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Select a Tool</h3>
                        <p className="text-gray-500 max-w-md">
                            This feature is currently being generated by our AI agents. Please check back later or try the Trend Radar.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIFeatures;
