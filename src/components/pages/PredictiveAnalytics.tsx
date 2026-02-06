import { useState, useMemo } from 'react';
import {
    Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Area, AreaChart, ComposedChart, Bar, Legend
} from 'recharts';
import {
    TrendingUp, Calendar, Target,
    Sparkles, AlertTriangle, ArrowUpRight, ArrowDownRight,
    Users, Heart, DollarSign
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PredictionData {
    month: string;
    followers: number;
    likes: number;
    comments: number;
    engagement: number;
    reach: number;
    revenue: number;
    isPrediction: boolean;
}

// Generate 36 months of historical data + 9 months of predictions
const generateData = (): PredictionData[] => {
    const data: PredictionData[] = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 36);

    // Base values
    let followers = 150000;
    let likes = 8000;
    let comments = 400;
    let reach = 45000;
    let revenue = 5000;

    // Growth rates (monthly)
    const followerGrowth = 1.025; // 2.5% monthly
    const likeGrowth = 1.02;
    const commentGrowth = 1.018;
    const reachGrowth = 1.022;
    const revenueGrowth = 1.03;

    // Generate 45 months of data (36 historical + 9 prediction)
    for (let i = 0; i < 45; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);

        const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        const isPrediction = i >= 36;

        // Add some randomness for historical data
        const noise = isPrediction ? 1 : (0.9 + Math.random() * 0.2);
        
        // Seasonality effect (higher in Dec, lower in Jan-Feb)
        const month = date.getMonth();
        let seasonality = 1;
        if (month === 11) seasonality = 1.15; // December boost
        if (month === 0 || month === 1) seasonality = 0.9; // Jan-Feb dip
        if (month === 6 || month === 7) seasonality = 1.08; // Summer boost

        data.push({
            month: monthStr,
            followers: Math.round(followers * noise * seasonality),
            likes: Math.round(likes * noise * seasonality),
            comments: Math.round(comments * noise * seasonality),
            engagement: parseFloat(((likes * noise + comments * noise * 3) / (followers * noise) * 100).toFixed(2)),
            reach: Math.round(reach * noise * seasonality),
            revenue: Math.round(revenue * noise * seasonality),
            isPrediction
        });

        // Apply growth
        followers *= followerGrowth;
        likes *= likeGrowth;
        comments *= commentGrowth;
        reach *= reachGrowth;
        revenue *= revenueGrowth;
    }

    return data;
};

const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const formatCurrency = (num: number) => {
    return '$' + formatNumber(num);
};

interface MetricCardProps {
    title: string;
    current: number;
    predicted: number;
    icon: LucideIcon;
    format?: 'number' | 'currency' | 'percentage';
    color: string;
}

const MetricCard = ({ title, current, predicted, icon: Icon, format = 'number', color }: MetricCardProps) => {
    const change = ((predicted - current) / current) * 100;
    const isPositive = change > 0;

    const formatValue = (val: number) => {
        if (format === 'currency') return formatCurrency(val);
        if (format === 'percentage') return val.toFixed(2) + '%';
        return formatNumber(val);
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(change).toFixed(1)}%
                </div>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
            <div className="flex items-end justify-between">
                <div>
                    <div className="text-xs text-gray-500">Current</div>
                    <div className="text-xl font-bold text-white">{formatValue(current)}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500">9-Month Forecast</div>
                    <div className="text-xl font-bold text-purple-400">{formatValue(predicted)}</div>
                </div>
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-white">{label}</span>
                    {data.isPrediction && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300">Predicted</span>
                    )}
                </div>
                <div className="space-y-1 text-sm">
                    {payload.map((p: any, i: number) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                            <span className="text-gray-400">{p.name}:</span>
                            <span className="font-semibold" style={{ color: p.color }}>
                                {p.name === 'Revenue' ? formatCurrency(p.value) : 
                                 p.name === 'Engagement' ? p.value + '%' : 
                                 formatNumber(p.value)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const PredictiveAnalytics = () => {
    const [selectedMetric, setSelectedMetric] = useState<'followers' | 'likes' | 'engagement' | 'revenue'>('followers');
    const [timeRange, setTimeRange] = useState<'all' | '12m' | '6m'>('all');

    const allData = useMemo(() => generateData(), []);

    const filteredData = useMemo(() => {
        if (timeRange === 'all') return allData;
        if (timeRange === '12m') return allData.slice(-21); // 12 historical + 9 prediction
        return allData.slice(-15); // 6 historical + 9 prediction
    }, [allData, timeRange]);

    const historicalData = allData.filter(d => !d.isPrediction);
    const predictionData = allData.filter(d => d.isPrediction);

    const currentMetrics = historicalData[historicalData.length - 1];
    const predictedMetrics = predictionData[predictionData.length - 1];

    const metrics = [
        { key: 'followers', label: 'Followers', icon: Users, color: 'bg-blue-500' },
        { key: 'likes', label: 'Likes', icon: Heart, color: 'bg-pink-500' },
        { key: 'engagement', label: 'Engagement', icon: TrendingUp, color: 'bg-emerald-500' },
        { key: 'revenue', label: 'Revenue', icon: DollarSign, color: 'bg-purple-500' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-emerald-400" />
                        Predictive Analytics
                    </h1>
                    <p className="text-gray-400 mt-1">36 months historical data • 9 months forecast</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Time Range:</span>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    >
                        <option value="all" className="bg-gray-900">All Data (45 months)</option>
                        <option value="12m" className="bg-gray-900">Last 12 + 9 Pred</option>
                        <option value="6m" className="bg-gray-900">Last 6 + 9 Pred</option>
                    </select>
                </div>
            </div>

            {/* AI Prediction Info */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/20">
                        <Sparkles className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">AI-Powered Predictions</h3>
                        <p className="text-gray-400 text-sm">
                            Our machine learning model uses linear regression and seasonal decomposition to project future metrics.
                            Predictions are based on your historical performance patterns and industry benchmarks.
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-gray-400">Historical Data</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-gray-400">AI Prediction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Followers"
                    current={currentMetrics.followers}
                    predicted={predictedMetrics.followers}
                    icon={Users}
                    color="bg-blue-500"
                />
                <MetricCard
                    title="Avg. Likes"
                    current={currentMetrics.likes}
                    predicted={predictedMetrics.likes}
                    icon={Heart}
                    color="bg-pink-500"
                />
                <MetricCard
                    title="Engagement Rate"
                    current={currentMetrics.engagement}
                    predicted={predictedMetrics.engagement}
                    icon={TrendingUp}
                    format="percentage"
                    color="bg-emerald-500"
                />
                <MetricCard
                    title="Est. Revenue"
                    current={currentMetrics.revenue}
                    predicted={predictedMetrics.revenue}
                    icon={DollarSign}
                    format="currency"
                    color="bg-purple-500"
                />
            </div>

            {/* Main Chart */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Growth Forecast</h3>
                    <div className="flex gap-2">
                        {metrics.map(m => (
                            <button
                                key={m.key}
                                onClick={() => setSelectedMetric(m.key as any)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                    selectedMetric === m.key
                                        ? 'bg-white/20 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                            dataKey="month" 
                            stroke="#666" 
                            tick={{ fill: '#999', fontSize: 11 }}
                            interval={Math.floor(filteredData.length / 10)}
                        />
                        <YAxis 
                            stroke="#666" 
                            tick={{ fill: '#999', fontSize: 11 }}
                            tickFormatter={(val) => selectedMetric === 'revenue' ? formatCurrency(val) : formatNumber(val)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey={selectedMetric}
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#historicalGradient)"
                            name={metrics.find(m => m.key === selectedMetric)?.label}
                            dot={false}
                            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span>← Historical Data</span>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <span>Predictions →</span>
                </div>
            </div>

            {/* Multi-Metric Comparison */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Multi-Metric Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                            dataKey="month" 
                            stroke="#666" 
                            tick={{ fill: '#999', fontSize: 11 }}
                            interval={Math.floor(filteredData.length / 8)}
                        />
                        <YAxis 
                            yAxisId="left"
                            stroke="#666" 
                            tick={{ fill: '#999', fontSize: 11 }}
                            tickFormatter={formatNumber}
                        />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            stroke="#666" 
                            tick={{ fill: '#999', fontSize: 11 }}
                            tickFormatter={(v) => v + '%'}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="likes" fill="#ec4899" opacity={0.6} name="Likes" />
                        <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} dot={false} name="Engagement" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Prediction Confidence & Insights */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Model Confidence */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-400" />
                        Prediction Confidence
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Followers', confidence: 92, accuracy: '±3.2%' },
                            { label: 'Engagement', confidence: 87, accuracy: '±5.1%' },
                            { label: 'Revenue', confidence: 78, accuracy: '±8.5%' },
                            { label: 'Reach', confidence: 84, accuracy: '±6.2%' }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-400">{item.label}</span>
                                    <span className="text-white">{item.confidence}% <span className="text-gray-500">({item.accuracy})</span></span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                                        style={{ width: `${item.confidence}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insights */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        AI Insights
                    </h3>
                    <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                                <TrendingUp className="w-4 h-4" />
                                Strong Growth Trajectory
                            </div>
                            <p className="text-gray-400 text-xs">
                                Follower growth rate exceeds industry average by 34%. Maintain current content strategy.
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <div className="flex items-center gap-2 text-yellow-400 font-semibold text-sm mb-1">
                                <AlertTriangle className="w-4 h-4" />
                                Engagement Plateau Risk
                            </div>
                            <p className="text-gray-400 text-xs">
                                Engagement may plateau in Q3. Consider diversifying content formats.
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1">
                                <DollarSign className="w-4 h-4" />
                                Revenue Opportunity
                            </div>
                            <p className="text-gray-400 text-xs">
                                Projected 40% revenue increase possible with 2 more brand partnerships.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalytics;
