
import { viralityScoreByDraft } from '../../data/mockData';
import { Sparkles } from 'lucide-react';

const ViralityWidget = () => {
    // Creating a gauge-like look with CSS conic gradients
    const score = viralityScoreByDraft;

    return (
        <div className="bg-dark-surface border border-white/5 rounded-2xl p-6 h-full flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none"></div>

            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Virality Score <Sparkles size={16} className="text-yellow-400" />
                    </h3>
                    <p className="text-xs text-dark-muted">Latest Draft Prediction</p>
                </div>
            </div>

            <div className="flex items-center justify-center py-6 z-10">
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Ring background */}
                    <div className="absolute inset-0 rounded-full border-8 border-white/5"></div>
                    {/* Active ring - simplified with svg for 'gauge' feel */}
                    <svg className="w-full h-full -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-brand-accent transition-all duration-1000 ease-out"
                            strokeDasharray="364"
                            strokeDashoffset={364 - (364 * score) / 100}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">{score}</span>
                        <span className="text-[10px] uppercase font-bold text-brand-accent">High</span>
                    </div>
                </div>
            </div>

            <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white transition-colors z-10">
                Analyze New Draft
            </button>
        </div>
    );
};

export default ViralityWidget;
