import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Building2, Users, DollarSign, Target, Globe, Rocket,
    ArrowRight, ArrowLeft, Loader, Check
} from 'lucide-react';

interface BusinessSurveyData {
    industry: string;
    companySize: string;
    marketingBudget: string;
    targetCategories: string[];
    targetRegions: string[];
    campaignGoals: string[];
}

interface BusinessSurveyProps {
    onComplete: (data: BusinessSurveyData) => void;
    loading: boolean;
}

const INDUSTRIES = [
    { id: 'tech', label: 'Technology', icon: '💻' },
    { id: 'fashion', label: 'Fashion & Beauty', icon: '👗' },
    { id: 'food', label: 'Food & Beverage', icon: '🍔' },
    { id: 'health', label: 'Health & Fitness', icon: '💪' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'other', label: 'Other', icon: '🏢' },
];

const COMPANY_SIZES = [
    { id: 'startup', label: 'Startup', desc: '1-10 employees' },
    { id: 'small', label: 'Small Business', desc: '11-50 employees' },
    { id: 'medium', label: 'Medium Enterprise', desc: '51-200 employees' },
    { id: 'large', label: 'Large Enterprise', desc: '200+ employees' },
];

const BUDGET_RANGES = [
    { id: 'starter', label: '$1K - $5K', desc: 'Per month' },
    { id: 'growth', label: '$5K - $15K', desc: 'Per month' },
    { id: 'scale', label: '$15K - $50K', desc: 'Per month' },
    { id: 'enterprise', label: '$50K+', desc: 'Per month' },
];

const INFLUENCER_CATEGORIES = [
    { id: 'tech', label: 'Tech & Gadgets' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'beauty', label: 'Beauty & Skincare' },
    { id: 'fitness', label: 'Fitness & Health' },
    { id: 'food', label: 'Food & Cooking' },
    { id: 'travel', label: 'Travel' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'finance', label: 'Finance & Business' },
    { id: 'education', label: 'Education' },
];

const TARGET_REGIONS = [
    { id: 'us', label: '🇺🇸 United States' },
    { id: 'uk', label: '🇬🇧 United Kingdom' },
    { id: 'india', label: '🇮🇳 India' },
    { id: 'global', label: '🌍 Global' },
    { id: 'eu', label: '🇪🇺 Europe' },
    { id: 'asia', label: '🌏 Asia Pacific' },
    { id: 'latam', label: '🌎 Latin America' },
    { id: 'mena', label: '🌍 Middle East' },
];

const CAMPAIGN_GOALS = [
    { id: 'awareness', label: 'Brand Awareness', icon: '📣' },
    { id: 'engagement', label: 'Increase Engagement', icon: '💬' },
    { id: 'sales', label: 'Drive Sales', icon: '🛒' },
    { id: 'leads', label: 'Generate Leads', icon: '📧' },
    { id: 'content', label: 'Content Creation', icon: '🎥' },
    { id: 'launch', label: 'Product Launch', icon: '🚀' },
];

const BusinessSurvey = ({ onComplete, loading }: BusinessSurveyProps) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<BusinessSurveyData>({
        industry: '',
        companySize: '',
        marketingBudget: '',
        targetCategories: [],
        targetRegions: [],
        campaignGoals: [],
    });

    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
        else onComplete(data);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const toggleArrayItem = (arr: string[], item: string) => {
        return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
    };

    const canProceed = () => {
        switch (step) {
            case 1: return data.industry && data.companySize;
            case 2: return data.marketingBudget;
            case 3: return data.targetCategories.length > 0 && data.targetRegions.length > 0;
            case 4: return data.campaignGoals.length > 0;
            default: return false;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Progress */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Business Profile</span>
                    <span>{step} of {totalSteps}</span>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-purple-500' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Industry & Company Size */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-7 h-7 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Tell us about your business</h2>
                            <p className="text-gray-400 mt-1">This helps us find the right influencers for you</p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Industry</label>
                            <div className="grid grid-cols-2 gap-2">
                                {INDUSTRIES.map(ind => (
                                    <button
                                        key={ind.id}
                                        type="button"
                                        onClick={() => setData({ ...data, industry: ind.id })}
                                        className={`p-3 rounded-xl border text-left transition-all ${
                                            data.industry === ind.id
                                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                    >
                                        <span className="mr-2">{ind.icon}</span>
                                        {ind.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Company Size</label>
                            <div className="grid grid-cols-2 gap-2">
                                {COMPANY_SIZES.map(size => (
                                    <button
                                        key={size.id}
                                        type="button"
                                        onClick={() => setData({ ...data, companySize: size.id })}
                                        className={`p-3 rounded-xl border text-left transition-all ${
                                            data.companySize === size.id
                                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="font-semibold">{size.label}</div>
                                        <div className="text-xs opacity-60">{size.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Budget */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-7 h-7 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Marketing Budget</h2>
                            <p className="text-gray-400 mt-1">What's your monthly influencer marketing budget?</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {BUDGET_RANGES.map(budget => (
                                <button
                                    key={budget.id}
                                    type="button"
                                    onClick={() => setData({ ...data, marketingBudget: budget.id })}
                                    className={`p-5 rounded-xl border text-center transition-all ${
                                        data.marketingBudget === budget.id
                                            ? 'bg-green-500/20 border-green-500 text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                    }`}
                                >
                                    <div className="text-xl font-bold">{budget.label}</div>
                                    <div className="text-xs opacity-60">{budget.desc}</div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Target Categories & Regions */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                <Target className="w-7 h-7 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Target Audience</h2>
                            <p className="text-gray-400 mt-1">Select influencer categories & target regions</p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Influencer Categories <span className="text-brand-primary">(select multiple)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {INFLUENCER_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setData({ ...data, targetCategories: toggleArrayItem(data.targetCategories, cat.id) })}
                                        className={`px-4 py-2 rounded-full border text-sm transition-all ${
                                            data.targetCategories.includes(cat.id)
                                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                    >
                                        {data.targetCategories.includes(cat.id) && <Check className="w-3 h-3 inline mr-1" />}
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Target Regions <span className="text-brand-primary">(select multiple)</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {TARGET_REGIONS.map(region => (
                                    <button
                                        key={region.id}
                                        type="button"
                                        onClick={() => setData({ ...data, targetRegions: toggleArrayItem(data.targetRegions, region.id) })}
                                        className={`p-3 rounded-xl border text-left transition-all ${
                                            data.targetRegions.includes(region.id)
                                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                    >
                                        {region.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Campaign Goals */}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                                <Rocket className="w-7 h-7 text-orange-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Campaign Goals</h2>
                            <p className="text-gray-400 mt-1">What do you want to achieve with influencer marketing?</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {CAMPAIGN_GOALS.map(goal => (
                                <button
                                    key={goal.id}
                                    type="button"
                                    onClick={() => setData({ ...data, campaignGoals: toggleArrayItem(data.campaignGoals, goal.id) })}
                                    className={`p-4 rounded-xl border text-center transition-all ${
                                        data.campaignGoals.includes(goal.id)
                                            ? 'bg-orange-500/20 border-orange-500 text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{goal.icon}</div>
                                    <div className="font-semibold">{goal.label}</div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
                {step > 1 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 bg-white/5 border border-white/10 text-white font-semibold py-3.5 rounded-xl transition-all hover:bg-white/10 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed() || loading}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader className="animate-spin w-5 h-5" />
                    ) : step === totalSteps ? (
                        <>Complete Setup <Check className="w-5 h-5" /></>
                    ) : (
                        <>Continue <ArrowRight className="w-5 h-5" /></>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default BusinessSurvey;
