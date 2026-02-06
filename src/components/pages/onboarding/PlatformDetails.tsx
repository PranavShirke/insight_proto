import React, { useState } from 'react';
import { ArrowRight, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlatformDetailsProps {
    selectedPlatforms: string[];
    onNext: (details: Record<string, string>) => void;
}

const PlatformDetails = ({ selectedPlatforms, onNext }: PlatformDetailsProps) => {
    const [details, setDetails] = useState<Record<string, string>>({});

    const handleChange = (platform: string, value: string) => {
        setDetails(prev => ({ ...prev, [platform]: value }));
    };

    const getIcon = (id: string) => {
        switch (id) {
            case 'instagram': return <Instagram className="w-5 h-5 text-pink-500" />;
            case 'twitter': return <Twitter className="w-5 h-5 text-blue-400" />;
            case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
            case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />;
            default: return null;
        }
    };

    const getLabel = (id: string) => {
        switch (id) {
            case 'instagram': return "Primary Niche (e.g. Travel, Tech)";
            case 'twitter': return "Content Style (e.g. Threads, Memes)";
            case 'youtube': return "Channel Category (e.g. Education, Gaming)";
            case 'facebook': return "Page Category (e.g. Business, Community)";
            default: return "Category";
        }
    };

    const isComplete = selectedPlatforms.every(p => details[p] && details[p].trim().length > 0);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="details"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Content Strategy</h1>
                <p className="text-gray-400">Tell us what you post on each platform</p>
            </div>

            <div className="space-y-6 mb-8">
                {selectedPlatforms.map(platform => (
                    <div key={platform} className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            {getIcon(platform)}
                            <label className="text-sm font-semibold capitalize text-gray-300">{platform}</label>
                        </div>
                        <input
                            type="text"
                            value={details[platform] || ''}
                            onChange={e => handleChange(platform, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder-gray-600"
                            placeholder={getLabel(platform)}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={() => onNext(details)}
                disabled={!isComplete}
                className="w-full bg-brand-primary hover:bg-brand-secondary text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Continue <ArrowRight className="w-5 h-5" />
            </button>
        </motion.div>
    );
};

export default PlatformDetails;
