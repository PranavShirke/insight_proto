import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Steps
import SignupForm from '../../components/pages/onboarding/SignupForm';
import VerificationStep from '../../components/pages/onboarding/VerificationStep';
import PlatformSelection from '../../components/pages/onboarding/PlatformSelection';
import PlatformDetails from '../../components/pages/onboarding/PlatformDetails';
import AudienceTargeting from '../../components/pages/onboarding/AudienceTargeting';

export const OnboardingFlow = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Global Onboarding State
    const [signupData, setSignupData] = useState({ userId: null, email: '' });
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [platformDetails, setPlatformDetails] = useState<Record<string, string>>({}); // { instagram: 'Tech', twitter: 'Memes' }
    const [audienceData, setAudienceData] = useState({});

    const handleSignupSuccess = (userId: any, email: string) => {
        setSignupData({ userId, email });
        setStep(2);
    };

    const handleVerificationSuccess = () => {
        setStep(3);
    };

    const handlePlatformsSelected = (selected: string[]) => {
        setPlatforms(selected);
        setStep(4);
    };

    const handleDetailsSubmitted = (details: any) => {
        setPlatformDetails(details);
        setStep(5);
    };

    const handleFinalSubmit = async (audience: any) => {
        setLoading(true);
        try {
            // Save everything to backend
            const finalData = {
                platforms,
                platformDetails,
                audience,
            };

            const res = await fetch('/api/user/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ answers: finalData })
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

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 transition-all duration-500">

                {/* Progress Bar */}
                <div className="mb-8 flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-brand-primary' : 'bg-white/10'}`} />
                    ))}
                </div>

                <AnimatePresence mode='wait'>
                    {step === 1 && (
                        <SignupForm onSuccess={handleSignupSuccess} key="step1" />
                    )}
                    {step === 2 && (
                        <VerificationStep email={signupData.email} userId={signupData.userId} onSuccess={handleVerificationSuccess} key="step2" />
                    )}
                    {step === 3 && (
                        <PlatformSelection onNext={handlePlatformsSelected} key="step3" />
                    )}
                    {step === 4 && (
                        <PlatformDetails selectedPlatforms={platforms} onNext={handleDetailsSubmitted} key="step4" />
                    )}
                    {step === 5 && (
                        <AudienceTargeting onFinish={handleFinalSubmit} loading={loading} key="step5" />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
