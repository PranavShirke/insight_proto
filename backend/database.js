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

    // Detailed Connection Flags
    isInstagramConnected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isFacebookConnected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    // Twitter Tokens
    twitterId: DataTypes.STRING,
    twitterAccessToken: DataTypes.STRING,
    twitterName: DataTypes.STRING
});

// Sync and Seed
export const initDB = async () => {
    try {
        await sequelize.sync(); // Use { force: true } to reset DB (WARNING: DELETES DATA)
        console.log('Database synced. Ready for users.');
    } catch (e) {
        console.error('Database sync failed:', e);
    }
};

export { sequelize, User };
