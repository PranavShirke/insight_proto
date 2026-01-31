
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';

// Mock Data for Flags
const MOCK_FLAGS = [
    {
        id: 'FLAG-001',
        type: 'sentiment',
        severity: 'high',
        platform: 'twitter',
        content: "This product is absolute garbage! #fail and others..." ,
        reason: "Negative Sentiment Detected (>0.9)",
        status: 'pending',
        timestamp: '2025-05-15T10:30:00Z',
        url: 'https://twitter.com/user/status/123456789'
    },
    {
        id: 'FLAG-002',
        type: 'competitor',
        severity: 'medium',
        platform: 'instagram',
        content: "Checking out the new release from @atharva9167j...",
        reason: "Competitor Mention",
        status: 'pending',
        timestamp: '2025-05-14T15:20:00Z',
        url: 'https://instagram.com/p/abcdef123'
    },
    {
        id: 'FLAG-003',
        type: 'policy',
        severity: 'low',
        platform: 'youtube',
        content: "Content A-Rated for violence",
        reason: "Potential Policy Violation",
        status: 'resolved',
        timestamp: '2025-05-10T09:00:00Z',
        url: 'https://youtube.com/watch?v=xyz789'
    },
];

const Flags = () => {
    const [filter, setFilter] = useState('all'); // all, pending, resolved
    const [flags, setFlags] = useState(MOCK_FLAGS);

    const handleResolve = (id: string) => {
        setFlags(prev => prev.map(flag =>
            flag.id === id ? { ...flag, status: 'resolved' } : flag
        ));
    };

    const handleDismiss = (id: string) => {
        setFlags(prev => prev.filter(flag => flag.id !== id));
    };

    const filteredFlags = flags.filter(flag => {
        if (filter === 'all') return true;
        return flag.status === filter;
    });

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'low': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-8 pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Flag className="text-brand-primary" /> Flagged Content
                    </h1>
                    <p className="text-dark-muted">Review and manage content flagged by AI agents.</p>
                </div>

                {/* Filters */}
                <div className="flex bg-dark-bg border border-white/5 p-1 rounded-xl">
                    {['all', 'pending', 'resolved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content List */}
            <div className="grid gap-4">
                <AnimatePresence>
                    {filteredFlags.map(flag => (
                        <motion.div
                            key={flag.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-dark-surface border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row gap-6">

                                {/* Status & Icon */}
                                <div className="flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${flag.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {flag.status === 'resolved' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityColor(flag.severity)} uppercase font-bold tracking-wider`}>
                                                    {flag.severity} Severity
                                                </span>
                                                <span className="text-xs text-dark-muted flex items-center gap-1">
                                                    <Clock size={12} /> {new Date(flag.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white">{flag.reason}</h3>
                                        </div>
                                        <a href={flag.url} target="_blank" rel="noopener noreferrer" className="text-dark-muted hover:text-white transition-colors">
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>

                                    <div className="bg-dark-bg/50 p-4 rounded-xl border border-white/5">
                                        <p className="text-gray-300 italic">"{flag.content}"</p>
                                        <div className="mt-2 text-xs text-brand-primary uppercase font-medium tracking-wider">
                                            Platform: {flag.platform}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row lg:flex-col gap-2 justify-end">
                                    {flag.status !== 'resolved' && (
                                        <>
                                            <button
                                                onClick={() => handleResolve(flag.id)}
                                                className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-xl text-sm font-medium transition-all"
                                            >
                                                Resolve
                                            </button>
                                            <button
                                                onClick={() => handleDismiss(flag.id)}
                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5 rounded-xl text-sm font-medium transition-all"
                                            >
                                                Dismiss
                                            </button>
                                        </>
                                    )}
                                    {flag.status === 'resolved' && (
                                        <span className="px-4 py-2 text-green-500 font-medium text-sm flex items-center justify-center bg-green-500/5 rounded-xl border border-green-500/10">
                                            Resolved
                                        </span>
                                    )}
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredFlags.length === 0 && (
                    <div className="text-center py-20 text-dark-muted">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No flags found for this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Flags;
