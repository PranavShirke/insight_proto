import React, { useState } from 'react';
import {
    FileText,
    Download,
    Calendar,
    BarChart,
    PieChart,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';

const REPORTS = [
    {
        title: "Executive Summary",
        description: "High-level overview of your social media performance with key metrics and strategic recommendations.",
        tags: ["KPI Dashboard", "Trend Analysis", "Strategic Insights"],
        popular: true,
        formats: ["PDF"],
        time: "2 min to generate",
        icon: BarChart
    },
    {
        title: "Detailed Analytics Report",
        description: "Comprehensive breakdown of all metrics, audience demographics, and content performance.",
        tags: ["Full Data Export", "Demographics", "Content Breakdown", "Competitor Benchmarks"],
        popular: false,
        formats: ["PDF", "Excel"],
        time: "5 min to generate",
        icon: PieChart
    },
    {
        title: "Content Performance Report",
        description: "Deep dive into your content performance by format, topic, and posting time.",
        tags: ["Format Comparison", "Best Performing Posts", "Optimal Timing"],
        popular: false,
        formats: ["PDF"],
        time: "3 min to generate",
        icon: FileText
    },
    {
        title: "Growth Strategy Report",
        description: "AI-powered recommendations for growing your audience and improving engagement.",
        tags: ["Growth Opportunities", "Action Items", "30-Day Plan"],
        popular: false,
        formats: ["PDF"],
        time: "4 min to generate",
        icon: TrendingUp
    }
];

const Reports = () => {
    const [activeRange, setActiveRange] = useState('30 Days');

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
                    <p className="text-gray-400">Generate strategy-ready reports and download your data</p>
                </div>

                {/* Time Range Filter */}
                <div className="flex p-1 bg-[#1e1e2d] rounded-xl border border-white/5">
                    {['7 Days', '30 Days', '90 Days', 'Custom'].map((range) => (
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
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <ClockIcon size={12} /> {report.time}
                            </div>
                            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-brand-secondary to-brand-primary text-white text-sm font-bold shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all active:scale-95">
                                <Download size={16} /> Generate
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ClockIcon = ({ size }: { size: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export default Reports;
