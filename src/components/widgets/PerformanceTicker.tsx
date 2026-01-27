
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { performanceData } from '../../data/mockData';

const PerformanceTicker = () => {
    // const items = [
    //     { label: 'Total Reach', key: 'likes', icon: Activity }, 
    //     { label: 'Waitlist', key: 'shares', icon: Activity },
    // ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {Object.entries(performanceData).map(([key, data]) => {
                const isPositive = data.trend === 'up';
                return (
                    <div key={key} className="bg-dark-surface border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 transition-colors group">
                        <div className="flex justify-between items-start">
                            <span className="text-dark-muted capitalize font-medium text-sm">{key}</span>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {isPositive ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                                {Math.abs(data.change)}%
                            </span>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mt-4 group-hover:scale-105 transition-transform origin-left">
                                {data.value}
                            </div>
                            <div className="text-xs text-dark-muted mt-1">vs last month</div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default PerformanceTicker;
