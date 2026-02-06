import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

// Initialize SQLite Database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false // Toggle to true to see SQL queries
});

// Define User Model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Google (YouTube) Tokens
    googleId: DataTypes.STRING,
    googleAccessToken: DataTypes.STRING,
    googleRefreshToken: DataTypes.STRING,
    googleName: DataTypes.STRING,

    // Facebook (Instagram) Tokens
    facebookId: DataTypes.STRING,
    facebookAccessToken: DataTypes.STRING,
    facebookName: DataTypes.STRING,

    instagramId: DataTypes.STRING,
    instagramAccessToken: DataTypes.STRING,
    instagramName: DataTypes.STRING,

    // Onboarding & Verification
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verificationCode: DataTypes.STRING,
    onboardingAnswers: {
        type: DataTypes.JSON,
        allowNull: true
    },

    // Account Type & Organization Fields
    accountType: {
        type: DataTypes.STRING, // 'influencer', 'business', or 'personal'
        defaultValue: 'influencer'
    },
    organizationName: DataTypes.STRING,
    
    // Business-specific fields
    businessIndustry: DataTypes.STRING,
    businessSize: DataTypes.STRING, // 'startup', 'small', 'medium', 'enterprise'
    businessWebsite: DataTypes.STRING,
    businessBudget: DataTypes.STRING, // monthly influencer marketing budget range
    targetCategories: DataTypes.JSON, // preferred influencer categories
    targetRegions: DataTypes.JSON // preferred target regions
});

// Define Campaign Model (For Business Campaign Tracking)
const Campaign = sequelize.define('Campaign', {
    businessId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    influencerId: {
        type: DataTypes.INTEGER,
        allowNull: true // Can be null if external influencer
    },
    externalInfluencerName: DataTypes.STRING,
    campaignName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING, // 'draft', 'pending', 'active', 'completed', 'cancelled'
        defaultValue: 'draft'
    },
    budget: DataTypes.FLOAT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    platform: DataTypes.STRING,
    deliverables: DataTypes.JSON, // Array of content deliverables
    metrics: DataTypes.JSON, // Actual performance metrics after campaign
    notes: DataTypes.TEXT
});

// Define SocialAccount Model (For Multi-Account Support)
const SocialAccount = sequelize.define('SocialAccount', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    platform: {
        type: DataTypes.STRING, // 'instagram', 'twitter', 'youtube', 'facebook'
        allowNull: false
    },
    platformUserId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    tokenExpiresAt: DataTypes.DATE,
    metadata: DataTypes.JSON // Store extra info like profile pic, follower count at connect time
});

// Associations
User.hasMany(SocialAccount, { foreignKey: 'userId', as: 'connectedAccounts' });
SocialAccount.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Campaign, { foreignKey: 'businessId', as: 'campaigns' });
Campaign.belongsTo(User, { foreignKey: 'businessId', as: 'business' });

// Sync and Seed
export const initDB = async () => {
    try {
        await sequelize.sync({ alter: true }); // Use alter to add new columns
        console.log('Database synced. Ready for users.');
    } catch (e) {
        console.error('Database sync failed:', e);
    }
};

export { sequelize, User, SocialAccount, Campaign };
