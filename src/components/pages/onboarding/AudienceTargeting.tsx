import React, { useState } from 'react';
import { ArrowRight, Users, Globe, Target, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudienceTargetingProps {
    onFinish: (audience: any) => void;
    loading: boolean;
}

const AudienceTargeting = ({ onFinish, loading }: AudienceTargetingProps) => {
    const [audience, setAudience] = useState({
        ageRange: '',
        location: '',
        interests: ''
    });

    const isComplete = audience.ageRange && audience.location && audience.interests;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="audience"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Target Audience</h1>
                <p className="text-gray-400">Who are you trying to reach?</p>
            </div>

            <div className="space-y-6 mb-8">

                {/* Age Range */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-brand-primary" />
                        <label className="text-sm font-semibold text-gray-300">Target Age Range</label>
                    </div>
                    <select
                        value={audience.ageRange}
                        onChange={e => setAudience({ ...audience, ageRange: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all [&>option]:bg-gray-900"
                    >
                        <option value="">Select Age Range</option>
                        <option value="13-17">13 - 17 (Gen Z)</option>
                        <option value="18-24">18 - 24 (Young Adults)</option>
                        <option value="25-34">25 - 34 (Professionals)</option>
                        <option value="35-44">35 - 44 (Mid-Career)</option>
                        <option value="45+">45+ (Established)</option>
                    </select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4 text-brand-primary" />
                        <label className="text-sm font-semibold text-gray-300">Primary Location</label>
                    </div>
                    <input
                        type="text"
                        value={audience.location}
                        onChange={e => setAudience({ ...audience, location: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder-gray-600"
                        placeholder="e.g. USA, India, Global"
                    />
                </div>

                {/* Interests */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-brand-primary" />
                        <label className="text-sm font-semibold text-gray-300">Audience Interests</label>
                    </div>
                    <input
                        type="text"
                        value={audience.interests}
                        onChange={e => setAudience({ ...audience, interests: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder-gray-600"
                        placeholder="e.g. Technology, Fitness, Finance"
                    />
                </div>

            </div>

            <button
                onClick={() => onFinish(audience)}
                disabled={!isComplete || loading}
                className="w-full bg-brand-primary hover:bg-brand-secondary text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader className="animate-spin w-5 h-5" /> : <>Complete Setup <ArrowRight className="w-5 h-5" /></>}
            </button>
        </motion.div>
    );
};

export default AudienceTargeting;
