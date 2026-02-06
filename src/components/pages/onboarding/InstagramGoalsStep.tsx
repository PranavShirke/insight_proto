import React from 'react';
import { motion } from 'framer-motion';

interface InstagramGoalsStepProps {
    selected: string[];
    onToggle: (goal: string) => void;
}

const InstagramGoalsStep = ({ selected, onToggle }: InstagramGoalsStepProps) => {
    const options = [
        { id: 'sales', label: 'More Sales', emoji: '🛍️' },
        { id: 'engagement', label: 'More Engagement', emoji: '💖' },
        { id: 'followers', label: 'More Followers', emoji: '🤩' },
        { id: 'traffic', label: 'Website Traffic', emoji: '🧭' },
        { id: 'showcase', label: 'Product Showcase', emoji: '👓' },
        { id: 'awareness', label: 'More Awareness', emoji: '👋' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="instagram-goals"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                    What are your main Instagram goals?
                </h1>
                <p className="text-gray-400">
                    Pick 2 or more
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {options.map((option) => {
                    const isSelected = selected.includes(option.id);
                    return (
                        <button
                            key={option.id}
                            onClick={() => onToggle(option.id)}
                            className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-4 min-h-[120px]
                                ${isSelected
                                    ? 'bg-white/10 border-brand-primary shadow-lg shadow-brand-primary/20'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }
                            `}
                        >
                            <span className="text-3xl">{option.emoji}</span>
                            <span className={`font-medium text-sm text-center ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default InstagramGoalsStep;
