import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Steps
import SignupForm from '../../components/pages/onboarding/SignupForm';
import VerificationStep from '../../components/pages/onboarding/VerificationStep';
import LoginSurvey from '../../components/pages/onboarding/LoginSurvey';
import BusinessSurvey from '../../components/pages/onboarding/BusinessSurvey';

// Survey data type (defined locally to avoid import issues)
interface SurveyData {
    userType: string;
    experienceLevel: string;
    instagramGoals: string[];
    appGoals: string[];
}

interface BusinessSurveyData {
    industry: string;
    companySize: string;
    marketingBudget: string;
    targetCategories: string[];
    targetRegions: string[];
    campaignGoals: string[];
}

export const OnboardingFlow = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Global Onboarding State
    const [signupData, setSignupData] = useState({ userId: null, email: '', accountType: '' });

    const handleSignupSuccess = (userId: any, email: string, accountType: string) => {
        setSignupData({ userId, email, accountType });
        setStep(2);
    };

    const handleVerificationSuccess = () => {
        setStep(3);
    };

    const handleSurveyComplete = async (surveyData: SurveyData | BusinessSurveyData) => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ answers: surveyData, accountType: signupData.accountType })
            });

            if (res.ok) {
                await checkAuth();
                navigate('/app');
            }
        } catch (e) {
            console.error("Onboarding error", e);
        } finally {
            setLoading(false);
        }
    };

    // Calculate progress for the overall flow
    // Step 1: Signup, Step 2: OTP, Step 3: Survey (which has 4 internal steps)
    const getOverallProgress = () => {
        if (step <= 2) return step;
        return 3; // Survey step
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 transition-all duration-500">

                {/* Progress Bar (for signup and verification steps only) */}
                {step < 3 && (
                    <div className="mb-8 flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= getOverallProgress() ? 'bg-brand-primary' : 'bg-white/10'}`} />
                        ))}
                    </div>
                )}

                <AnimatePresence mode='wait'>
                    {step === 1 && (
                        <SignupForm onSuccess={handleSignupSuccess} key="step1" />
                    )}
                    {step === 2 && (
                        <VerificationStep email={signupData.email} userId={signupData.userId} onSuccess={handleVerificationSuccess} key="step2" />
                    )}
                    {step === 3 && signupData.accountType === 'business' && (
                        <BusinessSurvey onComplete={handleSurveyComplete} loading={loading} key="step3-business" />
                    )}
                    {step === 3 && signupData.accountType === 'influencer' && (
                        <LoginSurvey onComplete={handleSurveyComplete} loading={loading} key="step3-influencer" />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
