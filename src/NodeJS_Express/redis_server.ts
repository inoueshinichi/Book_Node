import Redis from "ioredis";
import express from "express";

const PORT: number = 3000;

// サーバー用インスタンスを作成
const srvApp: any = express();

// Redis
const REDIS_PORT: number = 6379;
const redis = new Redis({
    port: REDIS_PORT,
    host: 'localhost',
    enableOfflineQueue: false
});

srvApp.get('/', (req, res) => {
    res.status(200).send('Hello Redis\n');
});

srvApp.get("/usr/:id", (req, res) => {
    res.status(200).send(`${req.params.id}\n`);
});

redis.once('ready', () => {
    try {
        srvApp.listen(PORT, () => {
            console.log("start listening");
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});

redis.on('error', (err) => {
    console.error(err);
    process.exit(1);
});