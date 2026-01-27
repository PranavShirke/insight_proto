import React, { useState, useRef, useEffect } from 'react';
import {
    MessageSquare,
    Send,
    TrendingUp,
    Clock,
    Film,
    BarChart2,
    Sparkles,
    Bot,
    User
} from 'lucide-react';

const SUGGESTIONS = [
    { icon: TrendingUp, text: "Which post performed best last month?" },
    { icon: BarChart2, text: "What format gives highest engagement?" },
    { icon: Clock, text: "When should I post for maximum reach?" },
    { icon: Film, text: "Compare my Reels vs Carousels" }
];

const AskAI = () => {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = async (text: string = query) => {
        if (!text.trim()) return;

        const userMsg = { role: 'user' as const, content: text };
        setHistory(prev => [...prev, userMsg]);
        setQuery('');
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            const aiMsg = { role: 'ai' as const, content: generateResponse(text) };
            setHistory(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (text: string) => {
        const t = text.toLowerCase();
        if (t.includes('best') || t.includes('highest')) return "Your Reel titled 'Morning Routine' posted on Jan 12th had the highest engagement (12.4%), driven by 450 shares.";
        if (t.includes('time') || t.includes('when')) return "Based on your audience activity, the best time to post is between 6 PM and 8 PM EST on Weekdays.";
        if (t.includes('compare') || t.includes('vs')) return "Reels are outperforming Carousels by 320% in engagement, but Carousels have a 15% higher save rate.";
        return "That's an interesting question. Reviewing your data... It seems your overall engagement is up 12% this month compared to last month. Keep focusing on short-form video content!";
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isTyping]);

    return (
        <div className="flex flex-col h-[calc(100vh-40px)] text-white relative">
            {/* Header */}
            <div className="shrink-0 mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-primary">
                        <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">Ask AI</h1>
                </div>
                <p className="text-gray-400">Natural language queries about your social media performance</p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto mb-24 custom-scrollbar pr-4" ref={scrollRef}>
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full -mt-20">
                        {/* Empty State / Suggestions */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-brand-primary/40 blur-[40px] rounded-full" />
                            <div className="relative w-24 h-24 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-3xl flex items-center justify-center shadow-2xl">
                                <Sparkles className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <h2 className="text-4xl font-bold mb-4">What would you like to know?</h2>
                        <p className="text-gray-400 text-center max-w-lg mb-12">
                            Ask me anything about your social media performance. I'll analyze your data and provide actionable insights.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                            {SUGGESTIONS.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(item.text)}
                                    className="bg-white/5 border border-white/5 hover:border-brand-primary/50 hover:bg-white/10 p-6 rounded-2xl flex items-center gap-4 transition-all group text-left"
                                >
                                    <item.icon className="w-6 h-6 text-gray-400 group-hover:text-brand-primary transition-colors shrink-0" />
                                    <span className="text-gray-300 group-hover:text-white transition-colors text-sm font-medium">{item.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {history.map((msg, i) => (
                            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center shrink-0">
                                        <Bot size={20} />
                                    </div>
                                )}
                                <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user'
                                        ? 'bg-brand-primary text-black font-medium rounded-tr-none'
                                        : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center shrink-0">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-4 justify-start">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center shrink-0">
                                    <Sparkles size={20} className="animate-pulse" />
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-2">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Search Bar */}
            <div className="absolute bottom-6 left-0 right-0">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative bg-[#0f0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shrink-0">
                            <Sparkles className="text-white w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about your social media performance..."
                            className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder-gray-500 text-white h-full outline-none"
                        />
                        <button
                            onClick={() => handleSend()}
                            className="p-2 rounded-lg bg-brand-primary hover:bg-brand-secondary transition-colors text-white shadow-lg shadow-brand-primary/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AskAI;
