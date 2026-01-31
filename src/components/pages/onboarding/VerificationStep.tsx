import React, { useState } from 'react';
import { Mail, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerificationStepProps {
    email: string;
    userId: any;
    onSuccess: () => void;
}

const VerificationStep = ({ email, userId, onSuccess }: VerificationStepProps) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId, code })
            });

            const data = await res.json();

            if (res.ok && data.message === 'Verification successful') {
                onSuccess();
            } else {
                setError(data.error || 'Invalid code');
            }
        } catch (e) {
            setError('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="verification"
        >
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Mail className="w-8 h-8 text-brand-primary" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Check your Email</h1>
                <p className="text-gray-400">We've sent a 6-digit code to <span className="text-brand-primary">{email}</span></p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
                <div>
                    <input
                        type="text"
                        value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 text-center text-4xl font-mono tracking-[0.5em] text-white focus:outline-none focus:border-brand-primary transition-all placeholder-white/10"
                        placeholder="000000"
                        autoFocus
                    />
                </div>

                {error && (
                    <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader className="animate-spin w-5 h-5" /> : <>Verify & Continue <ArrowRight className="w-5 h-5" /></>}
                </button>
            </form>
        </motion.div>
    );
};

export default VerificationStep;
