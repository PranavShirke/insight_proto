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

    // Organization Fields
    accountType: {
        type: DataTypes.STRING, // 'personal' or 'organization'
        defaultValue: 'personal'
    },
    organizationName: DataTypes.STRING
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

// Sync and Seed
export const initDB = async () => {
    try {
        await sequelize.sync(); // Use { force: true } to reset DB (WARNING: DELETES DATA)
        console.log('Database synced. Ready for users.');
    } catch (e) {
        console.error('Database sync failed:', e);
    }
};

export { sequelize, User, SocialAccount };
