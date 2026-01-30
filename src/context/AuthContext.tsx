
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    username: string;
    fullName: string;
    email?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await fetch('https://3c0l7m9w-5000.inc1.devtunnels.ms/api/status', {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                if (data.authenticated) {
                    setUser({
                        username: data.username,
                        fullName: data.user, // The API returns 'user' as the display name (fullName or username)
                        email: data.email
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

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
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
