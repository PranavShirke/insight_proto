import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    FileText,
    Download,
    BarChart,
    PieChart,
    TrendingUp,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    Clock
} from 'lucide-react';
import { useInsights } from '../../hooks/useInsights';
const STORAGE_KEY_PREFIX = 'insight_ai_feature_';

const REPORTS = [
    {
        id: "executive_summary",
        title: "Executive Summary",
        description: "High-level overview of your social media performance with key metrics and strategic recommendations.",
        tags: ["KPI Dashboard", "Trend Analysis", "Strategic Insights"],
        popular: true,
        formats: ["Markdown", "PDF"],
        icon: BarChart
    },
    {
        id: "detailed_analytics",
        title: "Detailed Analytics Report",
        description: "Comprehensive breakdown of all metrics, audience demographics, and content performance.",
        tags: ["Full Data Export", "Demographics", "Content Breakdown", "Competitor Benchmarks"],
        popular: false,
        formats: ["Markdown"],
        icon: PieChart
    },
    {
        id: "content_performance",
        title: "Content Performance Report",
        description: "Deep dive into your content performance by format, topic, and posting time.",
        tags: ["Format Comparison", "Best Performing Posts", "Optimal Timing"],
        popular: false,
        formats: ["Markdown"],
        icon: FileText
    },
    {
        id: "growth_strategy",
        title: "Growth Strategy Report",
        description: "AI-powered recommendations for growing your audience and improving engagement.",
        tags: ["Growth Opportunities", "Action Items", "30-Day Plan"],
        popular: false,
        formats: ["Markdown"],
        icon: TrendingUp
    }
];

const Reports = () => {
    const { data: stats } = useInsights();
    const [activeRange, setActiveRange] = useState('30 Days');
    const [loadingReport, setLoadingReport] = useState<string | null>(null);
    const [generatedReport, setGeneratedReport] = useState<{ title: string, content: string } | null>(null);

    const handleGenerate = async (report: typeof REPORTS[0]) => {
        setLoadingReport(report.id);
        setGeneratedReport(null);

        try {
            // Aggregate Context from other agents
            const trendCtx = localStorage.getItem(STORAGE_KEY_PREFIX + 'trend') || "{}";
            const dnaCtx = localStorage.getItem(STORAGE_KEY_PREFIX + 'dna') || "{}";
            const viralCtx = localStorage.getItem(STORAGE_KEY_PREFIX + 'viral') || "{}";
            const audienceCtx = localStorage.getItem(STORAGE_KEY_PREFIX + 'audience') || "{}";

            const res = await fetch('https://3c0l7m9w-5000.inc1.devtunnels.ms/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    feature_type: 'generate-report',
                    query: report.title,
                    context: {
                        range: activeRange,
                        stats: stats,
                        ai_insights: {
                            trend_radar: JSON.parse(trendCtx),
                            content_dna: JSON.parse(dnaCtx),
                            viral_predictor: JSON.parse(viralCtx),
                            audience: JSON.parse(audienceCtx)
                        }
                    }
                })
            });

            const data = await res.json();
            if (data.report) {
                setGeneratedReport({
                    title: report.title,
                    content: data.report
                });
            } else {
                console.error("No report content returned", data);
            }
        } catch (error) {
            console.error("Failed to generate report", error);
        } finally {
            setLoadingReport(null);
        }
    };

    if (generatedReport) {
        return (
            <div className="text-white min-h-screen p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                    onClick={() => setGeneratedReport(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Reports
                </button>

                <div className="max-w-4xl mx-auto bg-[#0f0f1a] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl print:bg-white print:text-black print:shadow-none print:border-none print:max-w-full">
                    <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6 print:border-black/20">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-secondary to-brand-primary w-fit mb-2 print:text-black print:bg-none">
                                {generatedReport.title}
                            </h1>
                            <p className="text-gray-400 print:text-gray-600">Generated on {new Date().toLocaleDateString()} • Range: {activeRange}</p>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors print:hidden"
                            title="Print / Save as PDF"
                        >
                            <Download size={20} />
                        </button>
                    </div>

                    <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-brand-primary prose-li:text-gray-300 print:prose-p:text-black print:prose-headings:text-black print:prose-strong:text-black print:prose-li:text-black">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                img: ({ node, ...props }) => (
                                    <div className="my-8 p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center print:bg-gray-50 print:border-gray-200">
                                        <img {...props} className="max-w-full rounded-lg shadow-lg print:shadow-none" alt={props.alt || "Chart"} />
                                        {props.alt && <p className="text-xs text-gray-500 mt-2 italic">{props.alt}</p>}
                                    </div>
                                ),
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-6 rounded-lg border border-white/10 print:border-black/20">
                                        <table {...props} className="w-full text-left border-collapse" />
                                    </div>
                                ),
                                th: ({ node, ...props }) => (
                                    <th {...props} className="bg-white/10 p-4 font-bold text-white border-b border-white/10 print:text-black print:bg-gray-100 print:border-black/20" />
                                ),
                                td: ({ node, ...props }) => (
                                    <td {...props} className="p-4 border-b border-white/5 text-gray-300 print:text-black print:border-black/10" />
                                )
                            }}
                        >
                            {generatedReport.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Print Styles Injection */}
                <style>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .animate-in {
                            display: block !important;
                            visibility: visible;
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            background: white;
                            color: black;
                            padding: 0;
                            margin: 0;
                            overflow: visible;
                        }
                        .animate-in * {
                            visibility: visible;
                        }
                        .print\\:hidden { // Escaped colon for JS string
                            display: none !important;
                        }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary">
                            <Download className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold">Reports & Exports</h1>
                    </div>
                    <p className="text-gray-400">Generate strategy-ready reports powered by AI analytics</p>
                </div>

                {/* Time Range Filter */}
                <div className="flex p-1 bg-[#1e1e2d] rounded-xl border border-white/5">
                    {['7 Days', '30 Days', '90 Days'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setActiveRange(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeRange === range
                                ? 'bg-[#0f0f1a] text-white shadow-sm border border-white/10'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {REPORTS.map((report, i) => (
                    <div key={i} className="bg-[#0f0f1a] border border-white/5 rounded-3xl p-8 flex flex-col justify-between group hover:border-white/10 transition-colors">
                        <div>
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-xl bg-white/5 text-brand-primary group-hover:bg-brand-primary/10 transition-colors">
                                    <report.icon size={24} />
                                </div>
                                <div className="flex items-center gap-2">
                                    {report.popular && (
                                        <span className="px-2 py-1 rounded text-[10px] bg-brand-secondary/10 text-brand-secondary font-bold uppercase tracking-wider">Popular</span>
                                    )}
                                    {report.formats.map(fmt => (
                                        <span key={fmt} className="px-2 py-1 rounded text-[10px] bg-white/5 text-gray-400 font-bold uppercase">{fmt}</span>
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-3">{report.title}</h3>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed module">{report.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {report.tags.map((tag, j) => (
                                    <div key={j} className="flex items-center gap-1 text-xs text-brand-primary/80 bg-brand-primary/5 px-2 py-1 rounded-md border border-brand-primary/10">
                                        <CheckCircle2 size={10} /> {tag}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer / Action */}
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <button
                                onClick={() => handleGenerate(report)}
                                disabled={loadingReport === report.id}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-brand-secondary to-brand-primary text-white text-sm font-bold shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingReport === report.id ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download size={16} /> Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



export default Reports;

