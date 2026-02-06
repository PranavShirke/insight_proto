import { initDB } from './database.js';

initDB().then(() => {
    console.log("Database synced successfully");
    process.exit(0);
});
