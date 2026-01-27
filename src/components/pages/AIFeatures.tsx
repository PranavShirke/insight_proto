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
    ChevronRight
} from 'lucide-react';
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
];

const TrendRadar = () => {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col justify-center items-center relative overflow-hidden">

            {/* Text Content */}
            <div className="absolute top-8 left-8 z-20">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-primary">
                        <Radar className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Trend Radar</h2>
                </div>
                <p className="text-gray-400">Catch trends before they peak in your niche</p>
            </div>

            {/* Radar Visualization */}
            <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                {/* Concentric Circles */}
                <div className="absolute inset-0 border border-white/5 rounded-full" />
                <div className="absolute inset-[50px] border border-white/5 rounded-full" />
                <div className="absolute inset-[100px] border border-white/5 rounded-full" />
                <div className="absolute inset-[150px] border border-white/5 rounded-full" />

                {/* Rotating Scanner Line */}
                <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
                    <div className="w-1/2 h-1/2 bg-gradient-to-t from-transparent via-brand-primary/20 to-brand-primary/50 origin-bottom-right rounded-tl-full blur-sm"
                        style={{ clipPath: 'polygon(100% 100%, 0 0, 100% 0)' }}
                    />
                </div>

                {/* Dots representing trends */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    className="absolute top-20 right-30 w-3 h-3 bg-brand-primary rounded-full shadow-[0_0_10px_#06b6d4]"
                />
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: 1.2 }}
                    className="absolute bottom-32 left-24 w-4 h-4 bg-brand-secondary rounded-full shadow-[0_0_15px_#3b82f6]"
                />
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3, delay: 0.2 }}
                    className="absolute top-1/2 left-32 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]"
                />

            </div>

            <div className="absolute bottom-8 text-center w-full z-20">
                <p className="text-sm text-gray-500">4 trends detected in your niche</p>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        </div>
    );
};

const AIFeatures = () => {
    const [activeTab, setActiveTab] = useState('trend');

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
                {activeTab === 'trend' && <TrendRadar />}

                {activeTab === 'viral' && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
                        <div className="relative z-10 w-full max-w-2xl">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold mb-2">Viral Predictor</h2>
                                <p className="text-gray-400">Upload your content to check its virality score before posting</p>
                            </div>

                            <div className="bg-black/40 border border-white/10 rounded-2xl p-8 border-dashed flex flex-col items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors group">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-8 h-8 text-brand-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Drop your thumbnail or video here</h3>
                                    <p className="text-sm text-gray-500">Supports JPG, PNG, MP4</p>
                                </div>
                            </div>

                            {/* Mock Result Preview */}
                            <div className="mt-8 grid grid-cols-3 gap-4 text-left">
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Predicted Views</div>
                                    <div className="text-2xl font-bold text-white">45.2K</div>
                                    <div className="text-xs text-emerald-400">+12% vs avg</div>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Virality Score</div>
                                    <div className="text-2xl font-bold text-brand-primary">8.5/10</div>
                                    <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                                        <div className="bg-brand-primary h-full w-[85%]" />
                                    </div>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">RetentionEst</div>
                                    <div className="text-2xl font-bold text-white">45s</div>
                                    <div className="text-xs text-gray-500">Avg watch time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'caption' && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col relative overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">Caption Wizard</h2>
                                    <p className="text-gray-400 text-sm">Describe your post, get viral captions.</p>
                                </div>
                                <textarea
                                    className="flex-1 bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:ring-1 focus:ring-brand-primary outline-none resize-none"
                                    placeholder="e.g. A photo of me working at a coffee shop on a rainy day, focusing on productivity..."
                                ></textarea>
                                <button className="bg-brand-primary text-black font-bold py-3 rounded-xl hover:bg-brand-secondary transition-colors">
                                    Generate Captions
                                </button>
                            </div>
                            <div className="bg-black/20 border border-white/10 rounded-2xl p-6 overflow-y-auto custom-scrollbar">
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">AI Suggestions</h3>
                                <div className="space-y-4">
                                    {[
                                        "Rainy days = Deep focus mode 🌧️☕ What's your go-to productivity hack? #WorkLife #Productivity",
                                        "POV: You found the perfect corner to get work done. 💻✨ #DigitalNomad #CoffeeShopVibes",
                                        "Just me, my laptop, and the sound of rain. Productive bliss. ⛈️🚀"
                                    ].map((caption, i) => (
                                        <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-primary/30 cursor-pointer transition-colors group">
                                            <p className="text-sm text-gray-300 mb-2 group-hover:text-white">{caption}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>94/100 Score</span>
                                                <button className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">Copy</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'audience' && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                            <div className="col-span-1 bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-primary to-blue-600 mb-4" />
                                <h3 className="font-bold text-xl">Top Persona</h3>
                                <p className="text-brand-primary font-medium">"Aspiring Creator"</p>
                                <div className="mt-4 w-full space-y-2 text-sm text-left px-4">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Age</span>
                                        <span className="text-white">18-24</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Focus</span>
                                        <span className="text-white">Growth</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Active</span>
                                        <span className="text-white">6pm - 9pm</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2 bg-black/20 p-6 rounded-2xl border border-white/5 text-left">
                                <h3 className="font-bold text-lg mb-4">Content Preferences</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Educational Reels</span>
                                            <span className="text-brand-primary">85%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-primary w-[85%]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Behind The Scenes</span>
                                            <span className="text-brand-secondary">62%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-secondary w-[62%]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Lifestyle Vlogs</span>
                                            <span className="text-purple-500">40%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 w-[40%]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fallback for others */}
                {!['trend', 'viral', 'caption', 'audience'].includes(activeTab) && (
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
