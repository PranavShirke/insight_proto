import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { google } from 'googleapis';
import fetch from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { initDB, User } from './database.js';
import googleTrends from 'google-trends-api';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Initialize Database
initDB();

const app = express();
const PORT = process.env.PORT || 5000;

const host = 'https://localhost:5173';

app.set('trust proxy', 1); // Required for secure cookies behind DevTunnel proxy

// Middleware
app.use(cors({
    origin: [host], // Allow both Tunnel and Localhost
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Must be true for SameSite=None
        sameSite: 'none', // Required for cross-site (tunnel-to-tunnel)
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Serialization - Store User ID in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user); // req.user will be the Sequelize model instance
    } catch (err) {
        done(err, null);
    }
});

// --- STRATEGIES ---

// 1. Local Strategy (Username/Password)
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return done(null, false, { message: 'Incorrect username.' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return done(null, false, { message: 'Incorrect password.' });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// 2. Google Strategy (Link to existing user)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://localhost:5000/auth/google/callback",
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/yt-analytics.readonly'],
    passReqToCallback: true
},
    async function (req, accessToken, refreshToken, profile, cb) {
        try {
            if (!req.user) {
                // If not logged in, we typically deny or create new. 
                // For this app, we force Login first.
                return cb(new Error("Please login with username/password first to connect accounts."));
            }

            // Update existing user with Google tokens
            const user = await User.findByPk(req.user.id);
            user.googleId = profile.id;
            user.googleAccessToken = accessToken;
            if (refreshToken) user.googleRefreshToken = refreshToken;
            user.googleName = profile.displayName;
            await user.save();

            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
));

// 3. Facebook Strategy (Link to existing user)
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email'],
    authorizationURL: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenURL: 'https://graph.facebook.com/v18.0/oauth/access_token',
    enableProof: true,
    passReqToCallback: true
},
    async function (req, accessToken, refreshToken, profile, cb) {
        try {
            if (!req.user) {
                return cb(new Error("Please login with username/password first."));
            }

            const user = await User.findByPk(req.user.id);
            user.facebookId = profile.id;
            user.facebookAccessToken = accessToken;
            user.facebookName = profile.displayName;

            // Check State to see if we are connecting Instagram or Facebook specifically
            // Note: req.query.state might not be available here directly depending on Passport version, 
            // but we can check the session or pass state in the route.
            // Actually, passport-facebook verifies state automatically.
            // To be robust: We will set BOTH to true if generic, or specific if state is passed.
            // However, getting `req.query` inside the verify callback is reliable with passReqToCallback: true.

            const state = req.query.state;

            if (state === 'instagram') {
                user.isInstagramConnected = true;
            } else if (state === 'facebook') {
                user.isFacebookConnected = true;
            } else {
                // If no state provided (legacy), maybe connect both? Or just Facebook?
                // Let's default to Facebook if no state, but safest is to require state for separation.
                // For now, if generic /auth/facebook was called, we assume Facebook.
                user.isFacebookConnected = true;
            }

            await user.save();

            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
));

// 4. Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY || 'mock_key',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'mock_secret',
    callbackURL: "https://localhost:5000/auth/twitter/callback",
    passReqToCallback: true
},
    async function (req, token, tokenSecret, profile, cb) {
        try {
            if (!req.user) {
                return cb(new Error("Please login with username/password first to connect Twitter."));
            }
            const user = await User.findByPk(req.user.id);
            user.twitterId = profile.id;
            user.twitterAccessToken = token;
            user.twitterName = profile.username || profile.displayName;
            await user.save();
            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
));


// --- ROUTES ---

// Login Route
app.post('/auth/login', passport.authenticate('local'), (req, res) => {
    res.json({
        success: true,
        user: req.user.username,
        user: req.user.username,
        connections: {
            google: !!req.user.googleAccessToken,
            facebook: req.user.isFacebookConnected,
            instagram: req.user.isInstagramConnected,
            twitter: !!req.user.twitterAccessToken
        }
    });
});

// Signup Route
app.post('/auth/signup', async (req, res, next) => {
    try {
        const { username, password, email, fullName } = req.body;

        if (!username || !password || !email || !fullName) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check availability
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) return res.status(400).json({ error: 'Username already taken.' });

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) return res.status(400).json({ error: 'Email already registered.' });

        // Create User
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            fullName,
            password_hash: hash
        });

        // Auto Login
        req.login(user, (err) => {
            if (err) return next(err);
            res.json({ success: true, user: user.username });
        });

    } catch (e) {
        console.error('Signup error:', e);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Logout Route
app.post('/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ success: true });
    });
});

// Auth Initiators
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/yt-analytics.readonly'],
    accessType: 'offline',
    prompt: 'consent'
}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: `${host}/app/settings?error=true` }),
    (req, res) => {
        res.redirect(`${host}/app/settings?connected=google`);
    });

app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'pages_show_list', 'instagram_basic', 'instagram_manage_insights', 'pages_read_engagement'],
    state: 'facebook'
}));

// Route specifically for Instagram connection (still uses Facebook OAuth but sets state)
app.get('/auth/instagram', passport.authenticate('facebook', {
    scope: ['public_profile', 'pages_show_list', 'instagram_basic', 'instagram_manage_insights', 'pages_read_engagement'],
    state: 'instagram'
}));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: `${host}/app/settings?error=true` }),
    (req, res) => {
        // Redirect based on what was connected.
        // We can check req.user flags or req.query.state if preserved in session, 
        // but simplest is to just redirect to settings.
        // If we want to show a specific "Connected Instagram" message, we can pass a query param.
        const state = req.query.state;
        res.redirect(`${host}/app/settings?connected=${state || 'facebook'}`);
    });

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: `${host}/app/settings?error=true` }),
    (req, res) => {
        res.redirect(`${host}/app/settings?connected=twitter`);
    });


// Helper Middleware
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Not authenticated' });
};

// API Routes
app.get('/api/status', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ authenticated: false });

    res.json({
        authenticated: true,
        username: req.user.username,
        email: req.user.email,
        fullName: req.user.fullName,
        google: !!req.user.googleAccessToken,
        facebook: !!req.user.facebookAccessToken,
        twitter: !!req.user.twitterAccessToken,
        user: req.user.fullName || req.user.username,
        user: req.user.fullName || req.user.username,
        connections: {
            google: !!req.user.googleAccessToken,
            // Use specific flags now
            facebook: req.user.isFacebookConnected,
            instagram: req.user.isInstagramConnected,
            twitter: !!req.user.twitterAccessToken
        }
    });
});

app.get('/api/insights/youtube', isAuthenticated, async (req, res) => {
    try {
        if (!req.user.googleAccessToken) {
            return res.status(400).json({ error: 'Not connected to YouTube' });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://localhost:5000/auth/google/callback"
        );

        oauth2Client.setCredentials({
            access_token: req.user.googleAccessToken,
            refresh_token: req.user.googleRefreshToken
        });

        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

        // 1. Get Channel Stats
        const channelRes = await youtube.channels.list({
            mine: true,
            part: 'snippet,contentDetails,statistics'
        });

        if (!channelRes.data.items || channelRes.data.items.length === 0) {
            return res.status(404).json({ error: 'No channel found' });
        }

        const channel = channelRes.data.items[0];
        const stats = channel.statistics;
        const snippet = channel.snippet;

        // 2. Get Engagement from Las 5 Videos
        const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
        const playlistRes = await youtube.playlistItems.list({
            playlistId: uploadsPlaylistId,
            part: 'snippet',
            maxResults: 5
        });

        let engagement = 0;
        let comments = 0;
        let likes = 0;

        if (playlistRes.data.items && playlistRes.data.items.length > 0) {
            const videoIds = playlistRes.data.items.map(item => item.snippet.resourceId.videoId).join(',');
            const videosRes = await youtube.videos.list({
                id: videoIds,
                part: 'statistics'
            });

            if (videosRes.data.items) {
                videosRes.data.items.forEach(video => {
                    const stats = video.statistics;
                    likes += parseInt(stats.likeCount || 0);
                    comments += parseInt(stats.commentCount || 0);
                    engagement += (parseInt(stats.likeCount || 0) + parseInt(stats.commentCount || 0));
                });
            }
        }

        res.json({
            platform: 'youtube',
            username: snippet.title,
            subscribers: stats.subscriberCount,
            views: stats.viewCount,
            videos: stats.videoCount,
            thumbnail: snippet.thumbnails.default.url,
            engagement: engagement,
            totalLikes: likes,
            totalComments: comments
        });

    } catch (error) {
        console.error('YouTube API Error:', error);
        res.status(500).json({ error: 'Failed to fetch YouTube insights' });
    }
});

app.get('/api/insights/instagram', isAuthenticated, async (req, res) => {
    try {
        if (!req.user.facebookAccessToken) {
            return res.status(400).json({ error: 'Not connected to Instagram' });
        }

        const accessToken = req.user.facebookAccessToken;

        // 1. Get User's Pages
        const pagesRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
        const pagesData = await pagesRes.json();

        if (!pagesData.data || pagesData.data.length === 0) {
            return res.status(404).json({ error: 'No Facebook Pages found. Instagram must be linked to a Page.' });
        }

        // 2. Find Page with Instagram Business Account
        let igUserId = null;
        for (const page of pagesData.data) {
            const igRes = await fetch(`https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
            const igData = await igRes.json();
            if (igData.instagram_business_account) {
                igUserId = igData.instagram_business_account.id;
                break;
            }
        }

        if (!igUserId) {
            return res.status(404).json({ error: 'No Instagram Business Account linked to your Facebook Pages.' });
        }

        // 3. Get Instagram Insights
        const params = new URLSearchParams({
            metric: 'impressions,reach,profile_views',
            period: 'day',
            access_token: accessToken
        });

        const insightsRes = await fetch(`https://graph.facebook.com/v18.0/${igUserId}/insights?${params}`);
        const insightsData = await insightsRes.json();

        // Get Basic Info
        const userRes = await fetch(`https://graph.facebook.com/v18.0/${igUserId}?fields=username,followers_count,media_count&access_token=${accessToken}`);
        const userData = await userRes.json();

        // 4. Get Media Engagement
        const mediaRes = await fetch(`https://graph.facebook.com/v18.0/${igUserId}/media?fields=like_count,comments_count,media_type,timestamp&limit=50&access_token=${accessToken}`);
        const mediaData = await mediaRes.json();

        let engagement = 0;
        let likes = 0;
        let comments = 0;
        let recent_posts = [];

        if (mediaData.data) {
            recent_posts = mediaData.data.map((media) => ({
                id: media.id,
                type: media.media_type, // IMAGE, VIDEO, CAROUSEL_ALBUM
                likes: media.like_count || 0,
                comments: media.comments_count || 0,
                timestamp: media.timestamp
            }));

            mediaData.data.forEach((media) => {
                likes += (media.like_count || 0);
                comments += (media.comments_count || 0);
                engagement += ((media.like_count || 0) + (media.comments_count || 0));
            });
        }

        res.json({
            platform: 'instagram',
            username: userData.username,
            followers: userData.followers_count,
            posts: userData.media_count,
            insights: insightsData.data,
            engagement: engagement,
            totalLikes: likes,
            totalComments: comments,
            recent_posts: recent_posts
        });

    } catch (error) {
        console.error('Instagram API Error:', error);
        res.status(500).json({ error: 'Failed to fetch Instagram insights' });
    }
});

app.get('/api/insights/facebook', isAuthenticated, async (req, res) => {
    try {
        if (!req.user.isFacebookConnected) { // Use flag or token check
            return res.status(400).json({ error: 'Not connected to Facebook' });
        }

        const accessToken = req.user.facebookAccessToken;
        if (!accessToken) return res.status(400).json({ error: 'No access token found' });

        // 1. Get User's Pages
        const pagesRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=name,fan_count,id,new_like_count,talking_about_count&access_token=${accessToken}`);
        const pagesData = await pagesRes.json();

        if (!pagesData.data || pagesData.data.length === 0) {
            return res.status(404).json({ error: 'No Facebook Pages found.' });
        }

        // For simplicity, take the first page or aggregate
        const page = pagesData.data[0];

        // 2. Mock Engagement data if API doesn't return easy stats without deeper permissions 
        // (Page generic metrics often need 'read_insights')

        let engagement = page.talking_about_count || 0;
        let followers = page.fan_count || 0;

        // Mock Posts for consistency
        const recent_posts = [
            { id: 'fb1', type: 'IMAGE', likes: 120, comments: 45, timestamp: new Date().toISOString() },
            { id: 'fb2', type: 'VIDEO', likes: 300, comments: 20, timestamp: new Date(Date.now() - 86400000).toISOString() }
        ];

        res.json({
            platform: 'facebook',
            username: page.name,
            followers: followers,
            posts: 0, // Requires feed permission
            engagement: engagement,
            totalLikes: page.new_like_count || 0,
            totalComments: 0,
            recent_posts: recent_posts
        });

    } catch (error) {
        console.error('Facebook API Error:', error);
        // Fallback Mock for Demo if API fails (common with dev tokens)
        res.json({
            platform: 'facebook',
            username: 'Facebook Page',
            followers: 12050,
            posts: 45,
            engagement: 1500,
            totalLikes: 1200,
            totalComments: 300,
            recent_posts: [
                { id: 'fb_m1', type: 'IMAGE', likes: 200, comments: 20, timestamp: new Date().toISOString() }
            ]
        });
    }
});

app.get('/api/insights/twitter', isAuthenticated, async (req, res) => {
    try {
        if (!req.user.twitterAccessToken) {
            return res.status(400).json({ error: 'Not connected to Twitter' });
        }

        // Twitter API v2 requires client instantiation usually, but here we do simple fetch if possible
        // or Mock because Twitter API Free tier is very limited (write-only mostly).

        // MOCK DATA for Twitter (Stable for MVP)
        res.json({
            platform: 'twitter',
            username: req.user.twitterName || 'Twitter User',
            followers: 5400, // Mock
            posts: 120,
            engagement: 3200,
            totalLikes: 2100,
            totalComments: 550, // replies
            recent_posts: [
                { id: 'tw1', type: 'IMAGE', likes: 50, comments: 12, timestamp: new Date().toISOString() },
                { id: 'tw2', type: 'IMAGE', likes: 80, comments: 5, timestamp: new Date(Date.now() - 86400000).toISOString() },
                { id: 'tw3', type: 'VIDEO', likes: 150, comments: 40, timestamp: new Date(Date.now() - 172800000).toISOString() }
            ]
        });

    } catch (error) {
        console.error('Twitter API Error:', error);
        res.status(500).json({ error: 'Failed to fetch Twitter insights' });
    }
});

app.post('/api/ai/analyze', isAuthenticated, async (req, res) => {
    try {
        const { stats, query, feature_type, context } = req.body; // feature_type: 'dashboard' (default), 'viral-predictor', etc.

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" }); //gemma-3-27b-it

        let systemPrompt = "";
        let userPrompt = "";
        let selectedModel = "gemma-3-27b-it"

        switch (feature_type) {
            case 'viral-predictor':
                systemPrompt = `
                You are a Viral Content Predictor AI.
                Analyze the user's uploaded content context or previous top posts to predict virality.
                
                Input Context: ${JSON.stringify(context || {})}
                
                You MUST return a valid JSON object:
                {
                    "score": 85, (0-100 integer),
                    "prediction": "High potential for virality due to...",
                    "retention_est": "45s",
                    "improvement_tips": ["Tip 1", "Tip 2"],
                    "factors": [
                        { "name": "Hook", "score": 90, "comment": "Strong visual hook" },
                        { "name": "Pacing", "score": 70, "comment": "Could be faster" },
                        { "name": "Audio", "score": 80, "comment": "Trending audio detected" }
                    ]
                }
                `;
                userPrompt = `Analyze this content idea/thumbnail context: ${query}`;
                break;

            case 'trend-radar':
                // Fetch real trends
                let trendData = "";
                try {
                    // Fetch Daily Trends for US (most robust)
                    const trendsRes = await googleTrends.dailyTrends({ geo: 'US' });
                    console.log(trendsRes);
                    const trendsJson = JSON.parse(trendsRes);
                    // Extract just the titles to save token space
                    const days = trendsJson.default.trendingSearchesDays || [];
                    const simpleTrends = days.slice(0, 2).map(day =>
                        day.trendingSearches.map(t => ({ title: t.title.query, traffic: t.formattedTraffic }))
                    ).flat();
                    trendData = JSON.stringify(simpleTrends);
                } catch (e) {
                    console.error("Google Trends API Failed", e);
                    trendData = "Unable to fetch live Google Trends. Rely on internal knowledge.";
                }

                systemPrompt = `
                You are a Trend Spotter AI.
                Analyze the provided Real-Time Google Trends data AND your internal knowledge to identify 4-5 emerging trends relevant to the user's Niche.
                
                User Niche/Interest: "${query || 'General'}"
                Real-Time Google Trends Data: ${trendData}

                You MUST return a valid JSON object:
                {
                    "niche": "${query}",
                    "trends": [
                        { "name": "Trend Name", "growth": "+450%", "category": "Tech", "relevance": "High" },
                        { "name": "Trend Name", "growth": "+200%", "category": "Lifestyle", "relevance": "Medium" }
                    ],
                    "summary": "Brief analysis of why these matter."
                }
                `;
                userPrompt = `Find trends for: ${query}`;
                break;

            case 'content-dna':
                systemPrompt = `
                You are a Brand Identity Expert AI.
                Analyze the user's recent content (captions, performance, topics) to decode their "Content DNA".

                Input Context: ${JSON.stringify(context || {})}

                You MUST return a valid JSON object:
                {
                    "archetype": "The Sage", (e.g. Jester, Ruler, Magician),
                    "voice": ["Professional", "Data-Driven", "Empathetic"],
                    "traits": [
                        { "name": "Educational Value", "score": 90 },
                        { "name": "Humor", "score": 20 },
                        { "name": "Visual Aesthetics", "score": 75 }
                    ],
                    "winning_formula": "Your best content combines deep industry analysis with minimalist visuals.",
                    "consistency_score": 85
                }
                `;
                userPrompt = `Analyze the DNA of this content profile.`;
                break;

            case 'audience-clone':
                systemPrompt = `
                You are an Audience Intelligence Expert.
                Analyze the user's content to identify their ideal "Superfans" or "Cloned Audience".

                Input Context: ${JSON.stringify(context || {})}

                You MUST return a valid JSON object:
                {
                    "top_persona": "The Aspiring Solopreneur",
                    "demographics": {
                        "age": "25-34",
                        "gender": "60% Male, 40% Female",
                        "location": "Top Tier Cities",
                        "active_hours": "8pm - 11pm"
                    },
                    "psychographics": [
                        "Values freedom and autonomy",
                        "Struggles with consistency",
                        "Loves productivity hacks"
                    ],
                    "content_preferences": [
                        { "type": "Tutorials", "score": 90 },
                        { "type": "Case Studies", "score": 75 },
                        { "type": "Motivation", "score": 60 }
                    ]
                }
                `;
                userPrompt = `Generate the deep audience clone profile for this creator.`;
                break;

            case 'caption-wizard':
                systemPrompt = `
                You are a Viral Social Media Copywriter.
                Generate 3 distinct caption options for the user's post idea.

                Input Context: ${JSON.stringify(context || {})}

                You MUST return a valid JSON object:
                {
                    "captions": [
                        {
                            "text": "Rainy days = Deep focus mode 🌧️☕ What's your go-to productivity hack? #WorkLife",
                            "score": 94,
                            "explanation": "Uses a reliable relatability hook + question for engagement."
                        },
                        {
                            "text": "POV: You found the perfect corner. 💻✨",
                            "score": 88,
                            "explanation": "Short, trendy 'POV' format works well for Reels."
                        },
                        {
                            "text": "Just me, my laptop, and the sound of rain. ⛈️🚀 #Grind",
                            "score": 82,
                            "explanation": "Minimalist and aesthetic."
                        }
                    ]
                }
                `;
                userPrompt = `Generate viral captions for this post description: "${query}"`;
                break;

            case 'post-mortem':
                systemPrompt = `
                You are a Social Media Content Doctor.
                Analyze the provided post context to determine why it underperformed (or how to improve it).

                Input Context: ${JSON.stringify(context || {})}

                You MUST return a valid JSON object:
                {
                    "diagnosis": "The hook was too slow and visual lighting was poor.",
                    "score": 45,
                    "autopsy_report": [
                        { "issue": "Hook retention", "severity": "Critical", "fix": "Cut the first 3 seconds of the intro." },
                        { "issue": "Hashtag irrelevance", "severity": "Moderate", "fix": "Replace generic #fun with niche tags." },
                        { "issue": "Call to Action", "severity": "Low", "fix": "Add a clear question at the end." }
                    ],
                    "revived_version": "Use this hook instead: 'Stop making this mistake...'"
                }
                `;
                userPrompt = `Perform an autopsy on this content: "${query}"`;
                break;



            case 'generate-report':
                systemPrompt = `
                You are a Chief Strategy Officer AI for a social media brand.
                Your goal is to write a professional, high-level strategic report based on the provided data.
                
                Context Data:
                ${JSON.stringify(context || {})}
                
                Report Type: "${query}"
                
                Guidelines:
                1. Use standard Markdown formatting (# Heading 1, ## Heading 2, **bold**, - list).
                2. Be professional, direct, and data-driven.
                3. Do NOT use JSON output. Write a document.
                4. Structure the report logically based on the Report Type.
                5. Use the cached AI insights (DNA, Trend, Viral) if available in the context to support your arguments.
                
                Example Structure:
                # [Report Title]
                ## Executive Summary
                [Brief overview]
                
                ## Key Performance Indicators
                [Analysis of provided stats]
                
                ## Strategic Insights
                - **Viral Potential**: [Based on Viral Predictor context]
                - **Content DNA**: [Based on DNA context]
                
                ## Action Plan
                1. [Action 1]
                2. [Action 2]
                `;
                userPrompt = `Generate the ${query} for this user.`;
                break;

            case 'competitor-ghost':
                systemPrompt = `
                You are a Competitive Intelligence Agent.
                Analyze the provided competitor (handle/name) to find "Strategy Gaps" the user can exploit.

                Input Context: ${JSON.stringify(context || {})}

                You MUST return a valid JSON object:
                {
                    "competitor_profile": {
                        "name": "${query || 'Competitor'}",
                        "weakness": "High quantity, low engagement depth",
                        "strength": "Visual polish"
                    },
                    "gaps": [
                        { "gap": "No community interaction", "opportunity": "Reply to their ignored comments to steal attention." },
                        { "gap": "Missing beginner tutorials", "opportunity": "Create the 'Zero to One' guide they lack." },
                        { "gap": "Inconsistent posting times", "opportunity": "Own the 9am slot they miss." }
                    ],
                    "stealable_tactics": [
                        "Their 'Day in the Life' hook structure",
                        "The way they use carousel swipes"
                    ]
                }
                `;
                userPrompt = `Ghost this competitor: "${query}"`;
                break;

            case 'content-strategy':
                systemPrompt = `
                You are a Lead Content Strategist.
                Create a 1-week micro-content strategy based on the user's goal.

                Input Context: ${JSON.stringify(context || {})}

                You MUST return a valid JSON object:
                {
                    "strategy_name": "The Authority Builder Protocol",
                    "focus": "High-Value Educational Content",
                    "calendar": [
                        { "day": "Mon", "format": "Reel", "topic": "Industry Myth Busting", "why": "Establishes authority immediately." },
                        { "day": "Tue", "format": "Carousel", "topic": "Step-by-Step Tutorial", "why": "High save-rate content for distribution." },
                        { "day": "Wed", "format": "Story", "topic": "Behind the Scenes work", "why": "Builds trust and authenticity." },
                        { "day": "Thu", "format": "Text Post", "topic": "Controversial Opinion", "why": "Drives engagement and comments." },
                        { "day": "Fri", "format": "Reel", "topic": "Client Success Story", "why": "Social proof before the weekend." }
                    ],
                    "growth_hack": "Reply to every comment in the first hour with a question."
                }
                `;
                userPrompt = `Create a strategy for this goal: "${query}"`;
                break;

            case 'comparison':
                systemPrompt = `
                You are a Data Benchmarking Analyst.
                Compare the user's current performance against top performers in their niche.

                Input Context: ${JSON.stringify(context || {})}

                You MUST return a valid JSON object:
                {
                    "niche": "Tech Education",
                    "metrics": [
                        { "label": "Engagement Rate", "user": "4.2%", "benchmark": "5.8%", "status": "Underperforming" },
                        { "label": "Save Rate", "user": "1.5%", "benchmark": "3.0%", "status": "Critical" },
                        { "label": "Consistency", "user": "3 posts/week", "benchmark": "5 posts/week", "status": "Good" },
                        { "label": "Story Views", "user": "15%", "benchmark": "10%", "status": "Elite" }
                    ],
                    "insight": "You are winning on Story loyalty but losing on saveable feed content.",
                    "action_plan": "Shift 2 posts per week to 'Saveable Carousels' to boost that 1.5% save rate."
                }
                `;
                userPrompt = `Compare my stats in the "${query || 'General'}" niche.`;
                break;

            case 'smart-scheduling':
                systemPrompt = `
                You are an AI Scheduling Optimization Engine.
                Analyze the user's audience behavior (mocked or provided) to determine the absolute best times to post for maximum engagement.

                Input Context: ${JSON.stringify(context || {})}

                You MUST return a valid JSON object:
                {
                    "best_times": [
                        { "day": "Monday", "time": "09:00 AM", "reason": "Morning commute peak", "confidence": "High" },
                        { "day": "Wednesday", "time": "12:30 PM", "reason": "Lunch break scrolling", "confidence": "Medium" },
                        { "day": "Friday", "time": "04:00 PM", "reason": "Pre-weekend excitement", "confidence": "Very High" },
                        { "day": "Saturday", "time": "10:00 AM", "reason": "Lazy morning browsing", "confidence": "High" }
                    ],
                    "heatmap_data": { "Mon": 9, "Tue": 6, "Wed": 8, "Thu": 5, "Fri": 10, "Sat": 7, "Sun": 4 },
                    "strategy_note": "Post your heavy hitters on Friday afternoons."
                }
                `;
                userPrompt = `Optimize schedule for: "${query || 'General Engagement'}"`;
                break;

            case 'generate-report':
                selectedModel = "gemini-3-flash-preview"
                systemPrompt = `
                You are a Professional Social Media Analyst.
                Generate a comprehensive report in Markdown format based on the user's data.

                Structure:
                1. **Executive Summary**: High-level overview.
                2. **Key Metrics Table**: Use Markdown table.
                3. **Visual Analysis**:
                   - You MUST include at least 2 charts.
                   - To insert a chart, strictly use this format:
                     <<<CHART_START
                     {
                       "type": "bar",
                       "data": {
                         "labels": ["Mon", "Tue", "Wed", "Thu", "Fri"],
                         "datasets": [{ "label": "Engagement", "data": [12, 19, 3, 5, 2] }]
                       }
                     }
                     CHART_END>>>
                   - Do NOT try to encode the URL yourself. Just provide the valid JSON inside the tags.
                4. **Strategic Recommendations**: Bullet points.

                Input Context: ${JSON.stringify(context || {})}
                `;
                userPrompt = `Generate a "${query || 'Executive Summary'}" report.`;
                userPrompt = `Generate a "${query || 'Executive Summary'}" report.`;
                break;

            case 'ask-ai':
                systemPrompt = `
                You are a Social Media Consultant Chatbot.
                Answer the user's questions about their social media performance, strategy, and content.
                Be helpful, encouraging, and data-driven.
                
                Input Context: ${JSON.stringify(context || {})}
                
                You MUST return a valid JSON object:
                {
                    "answer": "Your detailed answer here.",
                    "follow_up": ["Follow up question 1?", "Follow up question 2?"]
                }
                `;
                userPrompt = `User Question: "${query}"`;
                break;

            case 'dashboard':
            default:
                systemPrompt = `
                You are an expert Social Media Analyst Agent.
                Analyze the provided social media stats and the user's query.

                You MUST return a valid JSON object in the following format:
                {
                    "summary": "Brief 1-sentence summary of performance",
                    "insights": [
                        { "title": "Insight Title", "description": "Insight Details", "sentiment": "positive|neutral|negative" },
                        { "title": "Insight Title", "description": "Insight Details", "sentiment": "positive|neutral|negative" }
                    ],
                    "actionable_tips": [
                        "Tip 1",
                        "Tip 2",
                        "Tip 3"
                    ],
                    "chart_data": [
                        { "name": "Mon", "engagement": 1200, "reach": 3000 },
                        { "name": "Tue", "engagement": 1500, "reach": 3500 },
                        { "name": "Wed", "engagement": 1100, "reach": 2800 },
                        { "name": "Thu", "engagement": 1800, "reach": 4000 },
                        { "name": "Fri", "engagement": 2200, "reach": 4500 },
                        { "name": "Sat", "engagement": 2500, "reach": 4800 },
                        { "name": "Sun", "engagement": 2100, "reach": 4100 }
                    ]
                }
                Do not include markdown code blocks. Return raw JSON only.
                Generate realistic "chart_data" (LAST 7 DAYS) based on the stats provided. Simulate a realistic trend.
                `;
                userPrompt = `
                User Stats: ${JSON.stringify(stats)}
                User Query: "${query || 'General performance analysis'}"
                `;
                break;
        }

        console.log(userPrompt);
        const model = genAI.getGenerativeModel({ model: selectedModel }); //gemma-3-27b-it
        const result = await model.generateContent([systemPrompt, userPrompt]);
        const response = await result.response;
        const text = response.text();

        // Special handling for Report Generation (Markdown output)
        if (feature_type === 'generate-report') {
            const processedText = text.replace(/<<<CHART_START([\s\S]*?)CHART_END>>>/g, (match, jsonString) => {
                try {
                    const cleanJson = jsonString.trim();
                    const encoded = encodeURIComponent(cleanJson);
                    return `![Chart](https://quickchart.io/chart?c=${encoded})`;
                } catch (e) {
                    return '> *Error generating chart*';
                }
            });
            return res.json({ report: processedText });
        }

        // Default handling (JSON output)
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const jsonData = JSON.parse(cleanText);
            res.json(jsonData);
        } catch (e) {
            console.error("AI JSON Parse Error", e);
            console.error("Raw Text:", text);
            res.status(500).json({ error: "Failed to parse AI response" });
        }

    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Failed to generate AI insights' });
    }
});


app.post('/api/ai/deep-analysis', isAuthenticated, async (req, res) => {
    try {
        const { platform, url, postData } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
        }

        // Initialize new SDK
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        let contents = [];

        if (platform === 'youtube') {
            contents.push({
                fileData: {
                    fileUri: url,
                    mimeType: "video/mp4"
                }
            });
        } else if (platform === 'instagram') {
            const isVideo = url.includes('.mp4') || (postData && postData.type === 'VIDEO');
            const mimeType = isVideo ? "video/mp4" : "image/jpeg";
            contents.push({
                fileData: {
                    fileUri: url,
                    mimeType: mimeType
                }
            });
        }

        contents.push({
            text: `
            Analyze this content in extreme detail. 
            Identify:
            1. Total Watch Time & Average Watch Time (estimate).
            2. Skip Rate and specific timestamps where users likely skipped or dropped off.
            3. Key Moments (timestamps) that were most engaging.
            4. Sentiment analysis of the visual/audio content.
            5. Provide a second-by-second breakdown of "Retention Score" (0-100) for the first 60 seconds (or duration).

            Return ONLY a valid JSON object:
            {
                "overall_score": 88,
                "metrics": {
                    "avg_watch_time": "1m 45s",
                    "skip_rate": "12%",
                    "completion_rate": "45%"
                },
                "timeline_events": [
                    { "time": "00:05", "event": "Hook", "type": "positive", "desc": "Strong visual hook captured attention." },
                    { "time": "00:25", "event": "Drop-off", "type": "negative", "desc": "Pacing slowed down here." }
                ],
                "retention_graph": [
                    { "second": 0, "score": 100 },
                    { "second": 5, "score": 95 },
                    { "second": 10, "score": 85 }
                ],
                "summary": "Detailed textual summary..."
            }
        `});

        const modelName = "gemini-3-flash-preview";

        const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
        });

        const text = response.text;

        let cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        let jsonResponse = JSON.parse(cleanJson);

        res.json(jsonResponse);

    } catch (e) {
        console.error("Deep Analysis Error:", e);
        res.status(500).json({ error: 'Deep analysis failed', details: e.message });
    }
});


// HTTPS Setup
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure certs exist
const keyPath = path.join(__dirname, 'certs', 'key.pem');
const certPath = path.join(__dirname, 'certs', 'cert.pem');

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    };

    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`Server running on https://localhost:${PORT}`);
    });
} else {
    console.warn("No certificates found. Falling back to HTTP (Auth will fail for secure cookies).");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
