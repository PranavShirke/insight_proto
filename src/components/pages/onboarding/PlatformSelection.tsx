import React, { useState } from 'react';
import { Instagram, Twitter, Youtube, Facebook, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlatformSelectionProps {
    onNext: (platforms: string[]) => void;
}

const PlatformSelection = ({ onNext }: PlatformSelectionProps) => {
    const [selected, setSelected] = useState<string[]>([]);

    const platforms = [
        { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'hover:bg-pink-500/10 hover:border-pink-500/50' },
        { id: 'twitter', name: 'Twitter / X', icon: Twitter, color: 'text-blue-400', bg: 'hover:bg-blue-400/10 hover:border-blue-400/50' },
        { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500', bg: 'hover:bg-red-500/10 hover:border-red-500/50' },
        { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'hover:bg-blue-600/10 hover:border-blue-600/50' },
    ];

    const togglePlatform = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="platforms"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Active Platforms</h1>
                <p className="text-gray-400">Select where you currently post content</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                {platforms.map(p => {
                    const isSelected = selected.includes(p.id);
                    return (
                        <button
                            key={p.id}
                            onClick={() => togglePlatform(p.id)}
                            className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3
                                ${isSelected
                                    ? `bg-white/10 border-brand-primary ${p.color} shadow-lg shadow-brand-primary/10`
                                    : `bg-white/5 border-white/5 text-gray-400 ${p.bg}`
                                }
                            `}
                        >
                            <p.icon className={`w-8 h-8 ${isSelected ? p.color : ''}`} />
                            <span className="font-medium">{p.name}</span>
                        </button>
                    )
                })}
            </div>

            <button
                onClick={() => onNext(selected)}
                disabled={selected.length === 0}
                className="w-full bg-brand-primary hover:bg-brand-secondary text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Continue <ArrowRight className="w-5 h-5" />
            </button>
        </motion.div>
    );
};

export default PlatformSelection;
