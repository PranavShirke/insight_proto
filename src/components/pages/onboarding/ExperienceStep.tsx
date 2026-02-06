import React from 'react';
import { motion } from 'framer-motion';

interface ExperienceStepProps {
    selected: string;
    onSelect: (level: string) => void;
}

const ExperienceStep = ({ selected, onSelect }: ExperienceStepProps) => {
    const options = [
        { id: 'beginner', label: "I'm a beginner", emoji: '🌱' },
        { id: 'comfortable', label: "I'm comfortable", emoji: '👍' },
        { id: 'expert', label: "I'm an expert", emoji: '😎' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="experience"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                    How experienced are you in social media?
                </h1>
                <p className="text-gray-400">
                    To make your product experience more personal
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {options.map((option) => {
                    const isSelected = selected === option.id;
                    return (
                        <button
                            key={option.id}
                            onClick={() => onSelect(option.id)}
                            className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-4 min-h-[140px]
                                ${isSelected
                                    ? 'bg-white/10 border-brand-primary shadow-lg shadow-brand-primary/20'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }
                            `}
                        >
                            <span className="text-4xl">{option.emoji}</span>
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

export default ExperienceStep;
