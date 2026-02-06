import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
    BarChart3,
    ChevronRight,
    Play,
    Zap,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    Users,
    Activity,
    Sparkles,
    Target,
    Globe,
    Shield,
    Star
} from 'lucide-react';

// --- Cursor Glow Effect Hook ---
const useCursorGlow = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return { position, isVisible };
};

// --- Animated Counter Component ---
const AnimatedCounter = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <span ref={ref} className="tabular-nums">
            {isInView ? value : '0'}{suffix}
        </span>
    );
};

// --- Feature Card Component ---
const FeatureCard = ({
    icon: Icon,
    title,
    description,
    gradient,
    delay = 0
}: {
    icon: any;
    title: string;
    description: string;
    gradient: string;
    delay?: number;
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="group glass-card glass-card-hover rounded-3xl p-8 hover-lift cursor-pointer"
        >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </motion.div>
    );
};

// --- Testimonial Card ---
const TestimonialCard = ({
    name,
    role,
    text,
    rating = 5,
    accent
}: {
    name: string;
    role: string;
    text: string;
    rating?: number;
    accent: string;
}) => (
    <div className="w-[380px] glass-card rounded-3xl p-8 shrink-0 hover-lift group">
        <div className="flex items-center gap-1 mb-6">
            {Array(rating).fill(0).map((_, i) => (
                <Star key={i} className={`w-5 h-5 fill-current ${accent}`} />
            ))}
        </div>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">"{text}"</p>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${accent === 'text-yellow-400' ? 'from-yellow-400 to-orange-500' : accent === 'text-emerald-400' ? 'from-emerald-400 to-cyan-500' : 'from-purple-400 to-pink-500'} flex items-center justify-center text-white font-bold text-lg`}>
                {name.charAt(0)}
            </div>
            <div>
                <div className="text-white font-semibold">{name}</div>
                <div className="text-gray-500 text-sm">{role}</div>
            </div>
        </div>
    </div>
);

// --- Main Landing Page Component ---
const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
    const { position, isVisible } = useCursorGlow();

    const features = [
        {
            icon: BarChart3,
            title: "Real-time Analytics",
            description: "Track every metric across all platforms with live updates. Never miss a trending moment.",
            gradient: "from-emerald-500 to-cyan-500"
        },
        {
            icon: Zap,
            title: "AI-Powered Insights",
            description: "Our ML models analyze patterns and predict the best times to post for maximum engagement.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: Target,
            title: "Audience Targeting",
            description: "Understand who your audience is, what they want, and how to reach them effectively.",
            gradient: "from-orange-500 to-red-500"
        },
        {
            icon: Globe,
            title: "Multi-Platform",
            description: "Connect Instagram, YouTube, TikTok, Twitter and more. One dashboard to rule them all.",
            gradient: "from-blue-500 to-indigo-500"
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Invite team members, assign roles, and manage permissions for seamless workflow.",
            gradient: "from-teal-500 to-emerald-500"
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-level encryption, SOC 2 compliance, and advanced access controls built in.",
            gradient: "from-gray-500 to-slate-600"
        }
    ];

    const testimonials = [
        { name: "Sarah Johnson", role: "Content Creator • 2.1M followers", text: "Social Sense completely transformed how I understand my audience. The AI insights are genuinely mind-blowing.", accent: "text-yellow-400" },
        { name: "Marcus Chen", role: "Marketing Director • Fortune 500", text: "We consolidated 5 different tools into one. It's faster, cleaner, and actually looks premium.", accent: "text-emerald-400" },
        { name: "Jessica Rivera", role: "Influencer & Brand Consultant", text: "I save 15+ hours every week. The auto-generated reports alone are worth the subscription.", accent: "text-purple-400" },
        { name: "David Kim", role: "Agency Owner • 50+ clients", text: "The white-label exports make us look incredibly professional. Clients think we built it ourselves.", accent: "text-yellow-400" },
        { name: "Emily Watson", role: "Social Media Manager", text: "Finally, a platform that doesn't look like it was designed in 2010. Clean, intuitive, powerful.", accent: "text-emerald-400" }
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-emerald-500/30 selection:text-white overflow-x-hidden font-sans">
            {/* Noise Overlay */}
            <div className="noise-overlay" />

            {/* Cursor Glow */}
            {isVisible && (
                <div
                    className="cursor-glow"
                    style={{ left: position.x, top: position.y }}
                />
            )}

            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[150px] animate-blob" />
                <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[130px] animate-blob-delay-2" />
                <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] rounded-full bg-purple-500/10 blur-[160px] animate-blob-delay-4" />
            </div>

            {/* Grid Pattern */}
            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5">
                <div className="backdrop-blur-2xl bg-black/40">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Social Sense
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-400">
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/app" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">
                                Log In
                            </Link>
                            <Link
                                to="/app"
                                className="text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-2"
                            >
                                Get Started <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <motion.section
                style={{ y: heroY, opacity: heroOpacity }}
                className="relative z-10 pt-40 pb-32 px-6 sm:px-8"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Content */}
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Powered by Advanced AI</span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
                            >
                                Understand Social Media
                                <br />
                                <span className="gradient-text-animated">
                                    before it explodes
                                </span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
                            >
                                Stop drowning in data. Get unified insights, AI-powered recommendations, and actionable strategies—all in one stunning dashboard.
                            </motion.p>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
                            >
                                <Link
                                    to="/app"
                                    className="w-full sm:w-auto min-w-[200px] h-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-emerald-500/25 transition-all shimmer-effect"
                                >
                                    Start Free Trial <ChevronRight className="w-5 h-5" />
                                </Link>
                                <button className="w-full sm:w-auto min-w-[200px] h-14 rounded-full glass-card text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition-all group">
                                    <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                                    Watch Demo
                                </button>
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500"
                            >
                                {['No credit card', '14-day trial', 'Cancel anytime'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        {item}
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right: Dashboard Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, rotateY: -10 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative perspective-card animate-float-slow hidden lg:block"
                        >
                            {/* Glow Behind */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 blur-[80px] rounded-3xl" />

                            {/* Main Dashboard Card */}
                            <div className="relative glass-card rounded-3xl p-6 border-2 border-white/10 glow-emerald">
                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {[
                                        { label: 'Engagement', value: '1.2M', change: '+12.5%', icon: Activity, color: 'text-emerald-400' },
                                        { label: 'Reach', value: '4.8M', change: '+8.3%', icon: TrendingUp, color: 'text-cyan-400' },
                                        { label: 'Followers', value: '125K', change: '+3.2%', icon: Users, color: 'text-purple-400' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/5 rounded-2xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-500 text-xs">{stat.label}</span>
                                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                            </div>
                                            <div className="text-2xl font-bold text-white">
                                                <AnimatedCounter value={stat.value} />
                                            </div>
                                            <div className="text-emerald-400 text-xs font-medium">{stat.change}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Chart Mockup */}
                                <div className="bg-white/5 rounded-2xl p-6 h-48 relative overflow-hidden">
                                    <div className="absolute top-4 left-4 text-sm font-medium text-gray-400">Growth Trend</div>
                                    <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end px-4 gap-2">
                                        {[35, 45, 40, 65, 55, 80, 70, 90, 75, 95, 85, 100].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                                                className="flex-1 rounded-t-md"
                                                style={{
                                                    background: `linear-gradient(to top, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, ${0.4 + i * 0.05}))`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-32 px-6 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6"
                        >
                            Features
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold mb-6"
                        >
                            Everything you need
                            <br />
                            <span className="text-gray-500">to dominate social</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-gray-400 text-lg max-w-2xl mx-auto"
                        >
                            Powerful tools designed to help you understand, engage, and grow your audience across every platform.
                        </motion.p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <FeatureCard key={i} {...feature} delay={i * 0.1} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="relative z-10 py-32 px-6 sm:px-8 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
                        >
                            Pricing
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold mb-6"
                        >
                            Simple, <span className="gradient-text-animated">transparent</span> pricing
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-lg"
                        >
                            Start free. Upgrade when you're ready. No surprises.
                        </motion.p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Starter */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0 }}
                            className="glass-card rounded-3xl p-8 flex flex-col hover-lift"
                        >
                            <h3 className="text-gray-400 font-medium mb-3">Starter</h3>
                            <div className="text-5xl font-bold text-white mb-2">Free</div>
                            <p className="text-gray-500 text-sm mb-8">For individual creators</p>

                            <ul className="flex-1 space-y-4 mb-8">
                                {['1 social platform', 'Basic analytics', '7-day history', 'Community support'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                                Get Started Free
                            </button>
                        </motion.div>

                        {/* Pro - Featured */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="glass-card gradient-border rounded-3xl p-8 flex flex-col relative glow-emerald hover-lift"
                        >
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                                Most Popular
                            </div>
                            <h3 className="text-white font-medium mb-3">Pro</h3>
                            <div className="text-5xl font-bold text-white mb-2">
                                $29<span className="text-lg text-gray-500 font-normal">/mo</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-8">For serious creators</p>

                            <ul className="flex-1 space-y-4 mb-8">
                                {['3 platforms', 'Advanced analytics', '90-day history', 'AI insights', 'Priority support', 'Custom reports'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:shadow-xl hover:shadow-emerald-500/25 transition-all shimmer-effect">
                                Start Free Trial
                            </button>
                        </motion.div>

                        {/* Business */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="glass-card rounded-3xl p-8 flex flex-col hover-lift"
                        >
                            <h3 className="text-gray-400 font-medium mb-3">Business</h3>
                            <div className="text-5xl font-bold text-white mb-2">
                                $99<span className="text-lg text-gray-500 font-normal">/mo</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-8">For teams & agencies</p>

                            <ul className="flex-1 space-y-4 mb-8">
                                {['Unlimited platforms', 'Full analytics', 'Unlimited history', 'Team access', 'API access', 'White-label', 'Dedicated support'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                                Contact Sales
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="relative z-10 py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold mb-4"
                    >
                        Loved by <span className="gradient-text-animated">creators</span>
                    </motion.h2>
                    <p className="text-gray-400 text-lg">Join thousands of creators who trust Social Sense</p>
                </div>

                {/* Marquee */}
                <div className="flex gap-8">
                    <motion.div
                        className="flex gap-8"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    >
                        {[...testimonials, ...testimonials].map((t, i) => (
                            <TestimonialCard key={i} {...t} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 px-6 sm:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-card gradient-border rounded-[40px] p-12 md:p-16 relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10 pointer-events-none" />

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">
                            Ready to make sense of your data?
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
                            Join 50,000+ creators and brands who already use Social Sense to grow smarter.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <Link
                                to="/app"
                                className="w-full sm:w-auto min-w-[220px] h-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-emerald-500/25 transition-all shimmer-effect"
                            >
                                Start Free Trial <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="w-full sm:w-auto min-w-[220px] h-14 rounded-full glass-card text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                                Talk to Sales
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-16 px-6 sm:px-8 border-t border-white/5 bg-black/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Social Sense</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                    <div className="text-gray-500 text-sm">
                        © 2024 Social Sense Inc.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
