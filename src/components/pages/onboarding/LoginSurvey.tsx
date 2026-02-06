import React, { useState } from 'react';
import { ArrowRight, Loader } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Step Components
import UserTypeStep from './UserTypeStep';
import ExperienceStep from './ExperienceStep';
import InstagramGoalsStep from './InstagramGoalsStep';
import AppGoalsStep from './AppGoalsStep';

interface LoginSurveyProps {
    onComplete: (surveyData: SurveyData) => void;
    loading: boolean;
}

export interface SurveyData {
    userType: string;
    experienceLevel: string;
    instagramGoals: string[];
    appGoals: string[];
}

const LoginSurvey = ({ onComplete, loading }: LoginSurveyProps) => {
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    // Survey State
    const [userType, setUserType] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [instagramGoals, setInstagramGoals] = useState<string[]>([]);
    const [appGoals, setAppGoals] = useState<string[]>([]);

    const toggleInstagramGoal = (goal: string) => {
        setInstagramGoals(prev =>
            prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
        );
    };

    const toggleAppGoal = (goal: string) => {
        setAppGoals(prev =>
            prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
        );
    };

    const canProceed = () => {
        switch (step) {
            case 1: return userType !== '';
            case 2: return experienceLevel !== '';
            case 3: return instagramGoals.length >= 2;
            case 4: return appGoals.length >= 2;
            default: return false;
        }
    };

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            // Submit survey data
            onComplete({
                userType,
                experienceLevel,
                instagramGoals,
                appGoals,
            });
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-gray-400 text-sm">Sign-up Survey</span>
                <span className="text-gray-400 text-sm">Step {step} of {totalSteps}</span>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-brand-primary rounded-full transition-all duration-500"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                />
            </div>

            {/* Step Content */}
            <AnimatePresence mode='wait'>
                {step === 1 && (
                    <UserTypeStep
                        key="step1"
                        selected={userType}
                        onSelect={setUserType}
                    />
                )}
                {step === 2 && (
                    <ExperienceStep
                        key="step2"
                        selected={experienceLevel}
                        onSelect={setExperienceLevel}
                    />
                )}
                {step === 3 && (
                    <InstagramGoalsStep
                        key="step3"
                        selected={instagramGoals}
                        onToggle={toggleInstagramGoal}
                    />
                )}
                {step === 4 && (
                    <AppGoalsStep
                        key="step4"
                        selected={appGoals}
                        onToggle={toggleAppGoal}
                    />
                )}
            </AnimatePresence>

            {/* Next Button */}
            <div className="flex justify-end mt-8">
                <button
                    onClick={handleNext}
                    disabled={!canProceed() || loading}
                    className="bg-brand-primary hover:bg-brand-secondary text-black font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader className="animate-spin w-5 h-5" />
                    ) : (
                        <>
                            {step === totalSteps ? 'Complete' : 'Next Step'}
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default LoginSurvey;
