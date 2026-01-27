
import { heatmapData } from '../../data/mockData';

const Heatmap = () => {
    // Simplified heatmap rendering for demo
    return (
        <div className="bg-dark-surface border border-white/5 rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Engagement Heatmap</h3>
            <div className="flex-1 grid grid-cols-3 gap-2">
                {/* Creating a 3x3 grid visualization logic based on dummy data logic */}
                {heatmapData.slice(0, 9).map((item, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden">
                        <div
                            className="absolute inset-0 bg-brand-primary transition-opacity duration-500"
                            style={{ opacity: item.value / 100 }}
                        ></div>
                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white opacity-80 group-hover:opacity-100 shadow-sm">{item.time}</span>
                        </div>
                    </div>
                ))}
                <div className="col-span-3 text-center text-xs text-dark-muted mt-2">
                    Best time to post: <span className="text-brand-accent font-bold">Mon 6pm</span>
                </div>
            </div>
        </div>
    );
};

export default Heatmap;
