
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { competitorComparison } from '../../data/mockData';
import { Search } from 'lucide-react';

const CompetitorWidget = () => {
    return (
        <div className="bg-dark-surface border border-white/5 rounded-2xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Competitor Spy</h3>
                    <p className="text-xs text-dark-muted">Engagement Comparison</p>
                </div>
                <div className="flex items-center bg-dark-bg/50 border border-white/10 rounded-full px-3 py-1.5">
                    <Search size={14} className="text-dark-muted mr-2" />
                    <input type="text" placeholder="@competitor" className="bg-transparent border-none text-xs text-white placeholder-dark-muted focus:outline-none w-20" />
                </div>
            </div>

            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={competitorComparison}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e1e2d', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Line type="monotone" dataKey="user" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="competitor" stroke="#f87171" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex gap-4 mt-4 justify-center">
                <div className="flex items-center text-xs text-dark-muted">
                    <div className="w-2 h-2 rounded-full bg-brand-primary mr-2"></div> You
                </div>
                <div className="flex items-center text-xs text-dark-muted">
                    <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div> Competitor
                </div>
            </div>
        </div>
    );
};

export default CompetitorWidget;
