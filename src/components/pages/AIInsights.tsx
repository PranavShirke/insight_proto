import React from 'react';
import {
    Sparkles,
    TrendingUp,
    AlertTriangle,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Lightbulb,
    AlertCircle
} from 'lucide-react';

const AIInsights = () => {
    return (
        <div className="flex flex-col gap-8 text-white min-h-screen">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">AI Insights</h1>
                </div>
                <p className="text-gray-400">Intelligent analysis and actionable recommendations</p>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Insights', value: '12', icon: Sparkles, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
                    { label: 'Opportunities', value: '5', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { label: 'Warnings', value: '2', icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-400/10' },
                    { label: 'Quick Wins', value: '5', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Insight Cards */}
            <div className="space-y-6">
                {/* Card 1: High Impact */}
                <div className="bg-[#0f0f1a] border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5 text-emerald-400">
                                <TrendingUp size={20} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Content Performance</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">High Impact</span>
                        </div>
                        <div className="text-emerald-400 text-3xl font-bold">+320%</div>
                    </div>

                    <h2 className="text-xl font-bold mb-2">Reels are your engagement powerhouse</h2>
                    <p className="text-gray-400 mb-6 max-w-4xl text-sm leading-relaxed">
                        Your Reels content consistently outperforms other formats by 3.2x in engagement rate. The algorithm is clearly favoring your short-form video content.
                    </p>

                    <div className="bg-[#1e1e2d] rounded-xl p-4 border border-white/5">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-brand-primary mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Recommended Action</h4>
                                <p className="text-sm text-gray-400">Increase Reels posting frequency from 3 to 5 per week. Focus on trending audio and quick hooks in the first 0.5 seconds.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Medium Impact - Opportunity */}
                <div className="bg-[#0f0f1a] border border-brand-primary/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-brand-primary" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5 text-brand-primary">
                                <Lightbulb size={20} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Timing Optimization</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-brand-primary/10 text-brand-primary font-bold border border-brand-primary/20">Medium Impact</span>
                        </div>
                        <div className="text-emerald-400 text-3xl font-bold">+45%</div>
                    </div>

                    <h2 className="text-xl font-bold mb-2">Peak engagement window identified</h2>
                    <p className="text-gray-400 mb-6 max-w-4xl text-sm leading-relaxed">
                        Your audience shows highest activity between 6-8 PM EST on weekdays and 10 AM-12 PM on weekends. Posts during these windows see 45% more engagement.
                    </p>

                    <div className="bg-[#1e1e2d] rounded-xl p-4 border border-white/5">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-brand-primary mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Recommended Action</h4>
                                <p className="text-sm text-gray-400">Schedule your most important content drops during these peak windows. Use scheduling tools to maintain consistency.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Medium Impact - Warning */}
                <div className="bg-[#0f0f1a] border border-orange-500/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5 text-orange-400">
                                <AlertCircle size={20} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Format Analysis</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500/10 text-orange-400 font-bold border border-orange-500/20">Medium Impact</span>
                        </div>
                        <div className="text-orange-400 text-3xl font-bold">-15%</div>
                    </div>

                    <h2 className="text-xl font-bold mb-2">Carousel reach needs attention</h2>
                    <p className="text-gray-400 mb-6 max-w-4xl text-sm leading-relaxed">
                        Carousel posts have seen a 15% dip in reach over the last 30 days compared to previous periods.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AIInsights;
