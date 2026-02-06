
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { sentimentData } from '../../data/mockData';

const SentimentWidget = () => {
    return (
        <div className="bg-dark-surface border border-white/5 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 blur-[50px] rounded-full pointer-events-none"></div>

            <h3 className="text-lg font-bold text-white mb-2">Vibe Check</h3>
            <p className="text-xs text-dark-muted mb-4">Audience sentiment analysis</p>

            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={sentimentData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {sentimentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e1e2d', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4 text-center pointer-events-none">
                <div className="text-2xl font-bold text-white">65%</div>
                <div className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Positive</div>
            </div>
        </div>
    );
};

export default SentimentWidget;
