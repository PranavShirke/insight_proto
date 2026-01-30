import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'insight_proto_data';
const CACHE_DURATION = 15 * 60 * 1000; // 15 Minutes

export interface InsightData {
    youtube?: any;
    instagram?: any;
    aiAnalysis?: any;
    lastUpdated: number;
}

export const useInsights = () => {
    const [data, setData] = useState<InsightData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const newData: Partial<InsightData> = { lastUpdated: Date.now() };

            // Fetch YouTube
            try {
                const ytRes = await fetch('https://3c0l7m9w-5000.inc1.devtunnels.ms/api/insights/youtube', { credentials: 'include' });
                if (ytRes.ok) newData.youtube = await ytRes.json();
            } catch (e) { console.warn('YouTube fetch failed', e); }

            // Fetch Instagram
            try {
                const igRes = await fetch('https://3c0l7m9w-5000.inc1.devtunnels.ms/api/insights/instagram', { credentials: 'include' });
                if (igRes.ok) newData.instagram = await igRes.json();
            } catch (e) { console.warn('Instagram fetch failed', e); }

            // Save to State & LocalStorage
             if (newData.youtube || newData.instagram) {
                 const finalData = newData as InsightData;
                 setData(finalData);
                 localStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
             } else {
                 setError("No data could be fetched. Are you connected?");
             }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Load & Auto-Refresh
    useEffect(() => {
        // 1. Check Cache
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            const age = Date.now() - parsed.lastUpdated;
            if (age < CACHE_DURATION) {
                console.log("Using cached data");
                setData(parsed);
                return; // Valid cache, don't fetch yet
            }
        }

        // 2. Fetch if no cache or expired
        fetchAllData();

        // 3. Set Auto-Refresh Interval
        const interval = setInterval(() => {
            console.log("Auto-refreshing data...");
            fetchAllData();
        }, CACHE_DURATION);

        return () => clearInterval(interval);
    }, [fetchAllData]);

    const saveAiAnalysis = (analysis: any) => {
        if (!data) return;
        const newData = { ...data, aiAnalysis: analysis };
        setData(newData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    };

    return { data, loading, error, refresh: fetchAllData, saveAiAnalysis };
};
