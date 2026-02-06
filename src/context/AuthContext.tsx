
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SocialAccount {
    id: number;
    platform: string;
    username: string;
    platformUserId: string;
}

interface BusinessInfo {
    industry?: string;
    size?: string;
    budget?: string;
    targetCategories?: string[];
    targetRegions?: string[];
}

interface User {
    username: string;
    fullName: string;
    email?: string;
    accountType: 'influencer' | 'business';
    businessInfo?: BusinessInfo | null;
    connections?: {
        instagram?: boolean;
        youtube?: boolean;
        twitter?: boolean;
        facebook?: boolean;
        all?: SocialAccount[];
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
    isBusiness: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/status', {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                if (data.authenticated) {
                    setUser({
                        username: data.username,
                        fullName: data.fullName,
                        email: data.email,
                        accountType: data.accountType || 'influencer',
                        businessInfo: data.businessInfo || null,
                        connections: {
                            youtube: data.connections.google,
                            instagram: data.connections.instagram,
                            facebook: data.connections.facebook,
                            twitter: data.connections.twitter,
                            all: data.connections.all || []
                        }
                    });
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (e) {
            console.error("Auth check failed:", e);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const isBusiness = user?.accountType === 'business';

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, isBusiness }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
