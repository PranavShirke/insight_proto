import React, { useState } from 'react';
import { User, Lock, Mail, Type, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface SignupFormProps {
    onSuccess: (userId: any, email: string) => void;
}

const SignupForm = ({ onSuccess }: SignupFormProps) => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '', fullName: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.username || !formData.password || !formData.email || !formData.fullName) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok && data.userId) {
                onSuccess(data.userId, formData.email);
            } else {
                setError(data.error || 'Signup failed');
            }
        } catch (e) {
            setError('Signup failed. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="signup"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Create Account</h1>
                <p className="text-gray-400">Join to start analyzing your growth</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Full Name</label>
                    <div className="relative group">
                        <Type className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder-gray-600"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder-gray-600"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Username</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder-gray-600"
                            placeholder="johndoe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder-gray-600"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    {loading ? <Loader className="animate-spin w-5 h-5" /> : <>Next Step <ArrowRight className="w-5 h-5" /></>}
                </button>

                <div className="text-center mt-6">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-primary hover:text-brand-secondary font-semibold hover:underline transition-all">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </motion.div>
    );
};

export default SignupForm;
