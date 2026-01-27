import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import {
    BarChart3,
    ChevronRight,
    Play,
    Zap,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    Users,
    Activity
} from 'lucide-react';

// --- 3D Background Component ---
function StarBackground(props: any) {
    const ref = useRef<any>();
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#06b6d4"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

// --- Main Landing Page Component ---
const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-primary selection:text-white overflow-hidden font-sans">
            {/* 3D Background */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <StarBackground />
                </Canvas>
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-black/20">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            InsightIQ
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                        <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/app" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Log In
                        </Link>
                        <Link
                            to="/app"
                            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-transform active:scale-95 flex items-center gap-2"
                        >
                            Get Started <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-medium mb-8"
                    >
                        <Zap className="w-3 h-3" />
                        <span>Now with AI-powered insights</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                    >
                        Social Media Analytics <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-secondary to-blue-500">
                            That Actually Make Sense
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Stop juggling between platforms. Get unified insights, AI-powered recommendations, and actionable strategies—all in one beautiful dashboard.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        <Link
                            to="/app"
                            className="min-w-[180px] h-12 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand-primary/25 transition-all text-sm"
                        >
                            Start Free Trial <ChevronRight className="w-4 h-4" />
                        </Link>
                        <button
                            className="min-w-[180px] h-12 rounded-full bg-white/5 border border-white/10 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm group"
                        >
                            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" /> Watch Demo
                        </button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-20"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-primary" /> No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-primary" /> 14-day free trial
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-primary" /> Cancel anytime
                        </div>
                    </motion.div>

                    {/* Dashboard Preview / Floating Cards */}
                    <div className="relative max-w-5xl mx-auto mt-10">
                        {/* Glow Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none" />

                        {/* Glassmorphism Cards Container */}
                        <motion.div
                            style={{ y }}
                            className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
                        >
                            {/* Card 1: Engagement */}
                            <div className="bg-[#0f0f1a] p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm">Total Engagement</span>
                                    <Activity className="w-4 h-4 text-brand-primary" />
                                </div>
                                <div className="text-3xl font-bold text-white">1.2M</div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium">+12.5%</span>
                                    <span className="text-gray-500">vs last month</span>
                                </div>
                            </div>

                            {/* Card 2: Reach */}
                            <div className="bg-[#0f0f1a] p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm">Total Reach</span>
                                    <TrendingUp className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="text-3xl font-bold text-white">4.8M</div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium">+8.3%</span>
                                    <span className="text-gray-500">vs last month</span>
                                </div>
                            </div>

                            {/* Card 3: Followers */}
                            <div className="bg-[#0f0f1a] p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm">New Followers</span>
                                    <Users className="w-4 h-4 text-brand-secondary" />
                                </div>
                                <div className="text-3xl font-bold text-white">125K</div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium">+3.2%</span>
                                    <span className="text-gray-500">vs last month</span>
                                </div>
                            </div>

                            {/* Main Chart Area Mockup */}
                            <div className="md:col-span-3 bg-[#0f0f1a] h-64 rounded-xl border border-white/5 relative overflow-hidden flex items-end px-6 pb-0 pt-6">
                                <div className="absolute top-6 left-6 text-sm font-medium text-gray-300">Audience Growth</div>
                                <div className="w-full h-40 flex items-end gap-2">
                                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-t-sm hover:opacity-80 transition-opacity"
                                            style={{
                                                height: `${h}%`,
                                                background: `linear-gradient(to top, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, ${0.5 + (i / 24)}))`
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Features Section (Bento Grid) */}
            <section id="features" className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to grow</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Powerful features designed to help you understand your audience and boost engagement.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
                        {/* Feature 1: Main Large */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="col-span-1 md:col-span-2 row-span-2 bg-[#0f0f1a] border border-white/5 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div>
                                <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center mb-6 text-brand-primary">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Real-time Analytics</h3>
                                <p className="text-gray-400">Track your performance across all platforms in real-time. Never miss a trend again.</p>
                            </div>
                            <div className="mt-8 relative h-48 bg-white/5 rounded-xl border border-white/5 p-4 overflow-hidden">
                                {/* Abstract Chart */}
                                <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-4 gap-2">
                                    {[30, 45, 35, 60, 50, 75, 65, 90, 80].map((h, i) => (
                                        <div key={i} className="w-full bg-brand-primary/50 rounded-t-sm" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 2: Wide Top */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="col-span-1 md:col-span-2 bg-[#0f0f1a] border border-white/5 rounded-3xl p-8 flex items-center justify-between relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-bl from-brand-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">AI Predictions</h3>
                                <p className="text-gray-400 text-sm max-w-xs">Forecasting algorithms that tell you the best time to post.</p>
                            </div>
                            <div className="w-24 h-24 bg-brand-secondary/20 rounded-full flex items-center justify-center relative z-10">
                                <Zap className="w-10 h-10 text-brand-secondary" />
                            </div>
                        </motion.div>

                        {/* Feature 3: Small Bottom Left */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-[#0f0f1a] border border-white/5 rounded-3xl p-6 relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 text-emerald-500">
                                <Users className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Team Access</h3>
                            <p className="text-gray-400 text-xs">Collaborate with your team seamlessly.</p>
                        </motion.div>

                        {/* Feature 4: Small Bottom Right */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-[#0f0f1a] border border-white/5 rounded-3xl p-6 relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 text-pink-500">
                                <Activity className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Smart Alerts</h3>
                            <p className="text-gray-400 text-xs">Get notified when engagement spikes.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6 relative z-10 bg-black/40">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium mb-4">
                            Pricing
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Simple, <span className="text-brand-primary">Transparent</span> Pricing
                        </h2>
                        <p className="text-gray-400">Start free, upgrade when you're ready. No hidden fees.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Free Tier */}
                        <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 flex flex-col">
                            <h3 className="text-gray-400 font-medium mb-2">Starter</h3>
                            <div className="text-4xl font-bold text-white mb-4">Free</div>
                            <p className="text-gray-500 text-sm mb-8">Perfect for individual creators getting started</p>

                            <ul className="flex-1 space-y-4 mb-8">
                                {['1 social platform', 'Basic analytics', '7-day data history', 'Weekly email reports', 'Community support'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                                Get Started Free
                            </button>
                        </div>

                        {/* Pro Tier - Featured */}
                        <div className="bg-[#0f0f1a] border border-brand-primary/50 relative rounded-2xl p-8 flex flex-col shadow-2xl shadow-brand-primary/10">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-primary to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                Most Popular
                            </div>
                            <h3 className="text-white font-medium mb-2">Pro</h3>
                            <div className="text-4xl font-bold text-white mb-4">$29<span className="text-lg text-gray-500 font-normal">/month</span></div>
                            <p className="text-gray-500 text-sm mb-8">For creators who need deeper insights</p>

                            <ul className="flex-1 space-y-4 mb-8">
                                {['3 social platforms', 'Advanced analytics', '90-day data history', 'AI insights & recommendations', 'Natural language queries', 'Custom reports', 'Priority support'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-brand-primary to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-brand-primary/25 transition-all">
                                Start Free Trial
                            </button>
                        </div>

                        {/* Business Tier */}
                        <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-8 flex flex-col">
                            <h3 className="text-gray-400 font-medium mb-2">Business</h3>
                            <div className="text-4xl font-bold text-white mb-4">$99<span className="text-lg text-gray-500 font-normal">/month</span></div>
                            <p className="text-gray-500 text-sm mb-8">For teams and agencies managing multiple accounts</p>

                            <ul className="flex-1 space-y-4 mb-8">
                                {['Unlimited platforms', 'Full analytics suite', 'Unlimited data history', 'Advanced AI insights', 'Team collaboration', 'White-label reports', 'API access', 'Dedicated account manager'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 px-6 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Trusted by Creators</h2>
                </div>

                {/* Marquee */}
                <div className="flex gap-6 relative">
                    <motion.div
                        className="flex gap-6"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    >
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex gap-6">
                                {[
                                    { name: "Sarah J.", role: "Content Creator", text: "InsightIQ changed how I view my data. The AI insights are scary accurate." },
                                    { name: "Mark T.", role: "Marketing Director", text: "Finally, a dashboard that looks good and actually works. Highly recommend." },
                                    { name: "Jessica R.", role: "Influencer", text: "I saved 10 hours a week just by using the auto-scheduling features." },
                                    { name: "David K.", role: "Agency Owner", text: "Standardized our reporting process. Clients love the white-label exports." },
                                    { name: "Emily W.", role: "Social Manager", text: "The cross-platform comparison is a game changer for our strategy." }
                                ].map((testi, j) => (
                                    <div key={j} className="w-[350px] bg-[#0f0f1a] border border-white/5 p-6 rounded-2xl shrink-0">
                                        <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                            {[1, 2, 3, 4, 5].map(star => <div key={star}>★</div>)}
                                        </div>
                                        <p className="text-gray-300 mb-6">"{testi.text}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900" />
                                            <div className="text-left">
                                                <div className="text-white font-medium">{testi.name}</div>
                                                <div className="text-gray-500 text-xs">{testi.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 relative z-10 bg-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">InsightIQ</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        © 2024 InsightIQ Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
