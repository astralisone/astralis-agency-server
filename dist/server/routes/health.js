import express from 'express';
import { testConnection } from '../config/database';
const router = express.Router();
router.get('/', async (req, res) => {
    const dbConnected = await testConnection();
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        database: {
            connected: dbConnected,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            name: process.env.DB_NAME
        },
        env: process.env.NODE_ENV
    };
    res.send(healthcheck);
});
export default router;
