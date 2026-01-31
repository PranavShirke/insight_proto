import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { google } from 'googleapis';
import fetch from 'node-fetch';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import bcrypt from 'bcrypt';
import { initDB, User, SocialAccount } from './database.js';
import * as Agents from './agents/index.js';
import nodemailer from 'nodemailer';
import { spawn } from 'child_process';
import { getClient } from './agents/client.js';

dotenv.config();

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD?.replace(/\s+/g, '')
    }
});

const sendVerificationEmail = async (email, code) => {
    try {
        await transporter.sendMail({
            from: `"Insight AI" <${process.env.APP_EMAIL}>`,
            to: email,
            subject: 'Verify your Insight Account',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #6d28d9; text-align: center;">Welcome to Insight AI!</h2>
                    <p style="text-align: center; font-size: 16px;">To complete your signup, please use the verification code below:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111;">${code}</span>
                    </div>
                    <p style="text-align: center; color: #666; font-size: 14px;">If you didn't request this code, you can ignore this email.</p>
                </div>
            `
        });
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

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

// Helper to Link/Update Social Account
const linkSocialAccount = async (user, platform, profile, tokens) => {
    try {
        const [account, created] = await SocialAccount.findOrCreate({
            where: {
                platform,
                platformUserId: profile.id
            },
            defaults: {
                userId: user.id,
                username: profile.username || profile.displayName,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                metadata: profile._json
            }
        });

        if (!created) {
            // Update existing
            account.userId = user.id; // Ensure ownership (in case of re-linking)
            account.accessToken = tokens.accessToken;
            if (tokens.refreshToken) account.refreshToken = tokens.refreshToken;
            account.username = profile.username || profile.displayName;
            await account.save();
        }

        return account;
    } catch (e) {
        console.error(`Failed to link ${platform} account:`, e);
        throw e;
    }
};

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

// 2. Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://localhost:5000/auth/google/callback",
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/yt-analytics.readonly'],
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, cb) => {
    try {
        if (!req.user) return cb(new Error("Please login first to connect accounts."));
        await linkSocialAccount(req.user, 'youtube', profile, { accessToken, refreshToken });
        return cb(null, req.user); // Return User, but data is in SocialAccounts
    } catch (err) { return cb(err); }
}));

// 3. Facebook Strategy (Link to existing user)
// 3. Facebook Strategy
passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || "https://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email'],
    authorizationURL: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenURL: 'https://graph.facebook.com/v18.0/oauth/access_token',
    enableProof: true,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, cb) => {
    try {
        if (!req.user) return cb(new Error("Please login first."));
        await linkSocialAccount(req.user, 'facebook', profile, { accessToken });
        return cb(null, req.user);
    } catch (err) { return cb(err); }
}));

// 3.5 Instagram Strategy
passport.use('instagram', new OAuth2Strategy({
    authorizationURL: 'https://www.instagram.com/oauth/authorize',
    tokenURL: 'https://api.instagram.com/oauth/access_token',
    clientID: process.env.INSTAGRAM_APP_ID,
    clientSecret: process.env.INSTAGRAM_APP_SECRET,
    callbackURL: process.env.INSTAGRAM_CALLBACK_URL || "https://localhost:5000/auth/instagram/callback",
    scope: ['instagram_business_basic', 'instagram_business_manage_insights', 'instagram_business_content_publish'],
    state: true,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, params, profile, cb) => {
    try {
        if (!req.user) return cb(new Error("Please login first."));

        // Exchange for Long-Lived
        const exchangeRes = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_APP_SECRET}&access_token=${accessToken}`);
        const exchangeData = await exchangeRes.json();
        const longLivedToken = exchangeData.access_token || accessToken;

        // Fetch Profile
        const userRes = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${longLivedToken}`);
        const userData = await userRes.json();

        const igProfile = { id: userData.id, username: userData.username, _json: userData };
        await linkSocialAccount(req.user, 'instagram', igProfile, { accessToken: longLivedToken });

        return cb(null, req.user);
    } catch (err) {
        console.error("Instagram Auth Error:", err);
        return cb(err);
    }
}));

// 4. Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY || 'mock_key',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'mock_secret',
    callbackURL: "https://localhost:5000/auth/twitter/callback",
    passReqToCallback: true
}, async (req, token, tokenSecret, profile, cb) => {
    try {
        if (!req.user) return cb(new Error("Please login first."));
        await linkSocialAccount(req.user, 'twitter', profile, { accessToken: token, refreshToken: tokenSecret });
        return cb(null, req.user);
    } catch (err) { return cb(err); }
}));


// --- ROUTES ---

// Login Route
app.post('/auth/login', passport.authenticate('local'), async (req, res) => {
    // Fetch connected accounts
    const accounts = await SocialAccount.findAll({ where: { userId: req.user.id } });

    // Map to connections object
    const connections = {
        google: accounts.some(a => a.platform === 'youtube'),
        facebook: accounts.some(a => a.platform === 'facebook'),
        instagram: accounts.some(a => a.platform === 'instagram'),
        twitter: accounts.some(a => a.platform === 'twitter'),
        // Detailed list
        all: accounts.map(a => ({
            id: a.id,
            platform: a.platform,
            username: a.username,
            platformUserId: a.platformUserId
        }))
    };

    res.json({
        success: true,
        user: req.user.username,
        email: req.user.email,
        connections
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
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            username,
            email,
            fullName,
            password_hash: hash,
            verificationCode: verificationCode, // Store code
        });

        // Send Email
        await sendVerificationEmail(email, verificationCode);

        // Auto Login
        req.login(user, (err) => {
            if (err) return next(err);
            res.json({ success: true, user: user.username, userId: user.id });
        });

    } catch (e) {
        console.error('Signup error:', e);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Verify Email Route
app.post('/auth/verify', async (req, res) => {
    try {
        const { userId, code } = req.body;
        const user = await User.findByPk(userId);

        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.verificationCode == code) { // Allow string/number comparison
            user.isVerified = true;
            user.verificationCode = null; // Clear code
            await user.save();
            return res.json({ message: 'Verification successful' });
        } else {
            return res.status(400).json({ error: 'Invalid code' });
        }
    } catch (e) {
        console.error("Verification error:", e);
        res.status(500).json({ error: 'Verification failed' });
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
    scope: ['public_profile', 'pages_show_list', 'pages_read_engagement', 'pages_manage_posts']
}));

app.get('/auth/instagram', passport.authenticate('instagram'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: `${host}/app/settings?error=true` }),
    (req, res) => {
        res.redirect(`${host}/app/settings?connected=facebook`);
    });

app.get('/auth/instagram/callback',
    passport.authenticate('instagram', { failureRedirect: `${host}/app/settings?error=true` }),
    (req, res) => {
        res.redirect(`${host}/app/settings?connected=instagram`);
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

// Onboarding Submission Route
app.post('/api/user/onboarding', isAuthenticated, async (req, res) => {
    try {
        const { answers } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        user.onboardingAnswers = answers;
        await user.save();

        res.json({ success: true, message: 'Onboarding completed' });
    } catch (e) {
        console.error("Onboarding Error:", e);
        res.status(500).json({ error: 'Failed to save onboarding data' });
    }
});

// API Routes
app.get('/api/status', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ authenticated: false });

    // Fetch connected accounts
    const accounts = await SocialAccount.findAll({ where: { userId: req.user.id } });

    res.json({
        authenticated: true,
        username: req.user.username,
        email: req.user.email,
        fullName: req.user.fullName,
        google: !!req.user.googleAccessToken,
        facebook: !!req.user.facebookAccessToken,
        twitter: !!req.user.twitterAccessToken,
        connections: {
            google: accounts.some(a => a.platform === 'youtube'),
            facebook: accounts.some(a => a.platform === 'facebook'),
            instagram: accounts.some(a => a.platform === 'instagram'),
            twitter: accounts.some(a => a.platform === 'twitter'),
            all: accounts.map(a => ({
                id: a.id,
                platform: a.platform,
                username: a.username,
                platformUserId: a.platformUserId
            }))
        }
    });
});

// Helper to get tokens for a specific platform
const getTokensForUser = async (userId, platform) => {
    const account = await SocialAccount.findOne({
        where: { userId, platform }
    });
    if (!account) return null;
    return {
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        platformId: account.platformUserId
    };
};

app.get('/api/insights/youtube', isAuthenticated, async (req, res) => {
    try {
        const tokens = await getTokensForUser(req.user.id, 'youtube');
        if (!tokens) {
            return res.status(400).json({ error: 'Not connected to YouTube' });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://localhost:5000/auth/google/callback"
        );

        oauth2Client.setCredentials({
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken
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
        const tokens = await getTokensForUser(req.user.id, 'instagram');
        if (!tokens) {
            return res.status(400).json({ error: 'Not connected to Instagram' });
        }

        const accessToken = tokens.accessToken;
        // If we stored the ID in the account model, use it. Otherwise default to 'me'
        const igUserId = tokens.platformId || 'me';

        // 1. Get Basic Info
        const userRes = await fetch(`https://graph.instagram.com/${igUserId}?fields=username,followers_count,media_count,id&access_token=${accessToken}`);
        const userData = await userRes.json();

        if (userData.error) {
            throw new Error(userData.error.message);
        }

        // 2. Get Media & Engagement
        const mediaRes = await fetch(`https://graph.instagram.com/${igUserId}/media?fields=like_count,comments_count,media_type,timestamp,id,caption&limit=50&access_token=${accessToken}`);
        const mediaData = await mediaRes.json();

        let engagement = 0;
        let likes = 0;
        let comments = 0;
        let recent_posts = [];

        if (mediaData.data) {
            recent_posts = mediaData.data.map((media) => ({
                id: media.id,
                type: media.media_type,
                likes: media.like_count || 0,
                comments: media.comments_count || 0,
                timestamp: media.timestamp,
                caption: media.caption
            }));

            mediaData.data.forEach((media) => {
                likes += (media.like_count || 0);
                comments += (media.comments_count || 0);
                engagement += ((media.like_count || 0) + (media.comments_count || 0));
            });
        }

        // 3. Get Insights (If available for this account type)
        // Note: 'instagram_business_basic' allows reading insights
        let insights = [];
        try {
            const params = new URLSearchParams({
                metric: 'impressions,reach,profile_views',
                period: 'day',
                access_token: accessToken
            });
            const insightsRes = await fetch(`https://graph.instagram.com/${igUserId}/insights?${params}`);
            const insightsData = await insightsRes.json();
            if (insightsData.data) {
                insights = insightsData.data;
            }
        } catch (e) {
            console.warn("Failed to fetch IG Insights (Account might not be Business/Creator):", e);
        }

        res.json({
            platform: 'instagram',
            username: userData.username,
            followers: userData.followers_count || 0, // followers_count might need specific permissions
            posts: userData.media_count || 0,
            insights: insights,
            engagement: engagement,
            totalLikes: likes,
            totalComments: comments,
            recent_posts: recent_posts
        });

    } catch (error) {
        console.error('Instagram API Error:', error);
        res.status(500).json({ error: 'Failed to fetch Instagram insights', details: error.message });
    }
});

app.get('/api/insights/facebook', isAuthenticated, async (req, res) => {
    try {
        const tokens = await getTokensForUser(req.user.id, 'facebook');
        if (!tokens) {
            return res.status(400).json({ error: 'Not connected to Facebook' });
        }

        const accessToken = tokens.accessToken;
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
        const { stats, query, feature_type, context } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
        }

        let result;

        switch (feature_type) {
            case 'viral-predictor':
                result = await Agents.analyzeViralPotential(context, query);
                break;
            case 'trend-radar':
                result = await Agents.analyzeTrends(context, query);
                break;
            case 'content-dna':
                result = await Agents.analyzeContentDNA(context, query);
                break;
            case 'audience-clone':
                result = await Agents.analyzeAudienceClone(context, query);
                break;
            case 'caption-wizard':
                result = await Agents.generateCaptions(context, query);
                break;
            case 'post-mortem':
                result = await Agents.analyzePostMortem(context, query);
                break;
            case 'competitor-ghost':
                result = await Agents.analyzeCompetitorGhost(context, query);
                break;
            case 'content-strategy':
                result = await Agents.generateContentStrategy(context, query);
                break;
            case 'comparison':
                result = await Agents.analyzeComparison(context, query);
                break;
            case 'smart-scheduling':
                result = await Agents.analyzeSmartScheduling(context, query);
                break;
            case 'generate-report':
                result = await Agents.generateReport(context, query);
                break;
            case 'ask-ai':
                result = await Agents.askAI(context, query);
                break;
            case 'dashboard':
            default:
                result = await Agents.analyzeDashboard(context, query, stats);
                break;
        }

        res.json(result);

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

        const result = await Agents.runDeepAnalysis(platform, url, postData);
        res.json(result);

    } catch (e) {
        console.error("Deep Analysis Error:", e);
        res.status(500).json({ error: 'Deep analysis failed', details: e.message });
    }
});

// Business Analysis Route
app.post('/api/business/analyze', isAuthenticated, async (req, res) => {
    try {
        const params = req.body;

        const pythonProcess = spawn('python', ['models/predict.py']);
        let dataString = '';
        let errorString = '';

        pythonProcess.stdin.write(JSON.stringify(params));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });
        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                const errMsg = errorString || dataString || 'Unknown Python error';
                console.error("Python script failed:", errMsg);
                return res.status(500).json({ error: 'Prediction model failed.', details: errMsg });
            }

            try {
                const predictions = JSON.parse(dataString);
                if (predictions.error) {
                    return res.status(500).json({ error: predictions.error });
                }


                const client = getClient();
                const prompt = `
                You are a Business Analyst.
                Based on the following prediction stats for an influencer campaign:
                - Predicted Unit Sales: ${predictions.predicted_sales}
                - Net ROI: ${predictions.net_roi}%
                - Total Campaign Cost: $${predictions.total_cost}
                - Estimated Revenue: $${predictions.revenue}

                Campaign Details:
                - Niche: ${params.niche}
                - Platform: ${params.platform}
                - Followers: ${params.followers}
                - Engagement: ${params.engagement}
                - Duration: ${params.duration} days
                - Product Price: $${params.price}

                Please provide a detailed strategic analysis (in markdown).
                1. Interpret the ROI (Is it good? risky?).
                2. Suggest optimization tips for this specific niche and platform.
                3. Conclude with a "Go/No-Go" recommendation.
                `;

                const response = await client.models.generateContent({
                    model: 'gemma-3-27b-it',
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                });

                const analysisText = response.text;

                res.json({
                    ...predictions,
                    analysis: analysisText
                });

            } catch (e) {
                console.error("Analysis generation error:", e);
                res.status(500).json({ error: 'Failed to generate AI analysis' });
            }
        });

    } catch (e) {
        console.error("Business API Error:", e);
        res.status(500).json({ error: 'Internal Server Error' });
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
