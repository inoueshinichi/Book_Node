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

// Redisに初期データをセットする非同期関数
type InitAsyncFunc = () => Promise<void>;

const init: InitAsyncFunc = async () => {
    // Promise.allで同時にセット
    await Promise.all([
        redis.set('users:1', JSON.stringify({ id: 1, name: 'alpha' })),
        redis.set('users:2', JSON.stringify({ id: 2, name: 'beta'  })),
        redis.set('users:3', JSON.stringify({ id: 3, name: 'gamma' })),
        redis.set('users:4', JSON.stringify({ id: 4, name: 'delta' })),
        redis.set('users:5', JSON.stringify({ id: 5, name: 'theta' })),
    ])
};

const pageingInit: InitAsyncFunc = async () => {
    await Promise.all([
        redis.rpush('users:list', JSON.stringify({ id: 1, name: 'shinichi' })),
        redis.rpush('users:list', JSON.stringify({ id: 2, name: 'misato' })),
        redis.rpush('users:list', JSON.stringify({ id: 3, name: 'saori' })),
        redis.rpush('users:list', JSON.stringify({ id: 4, name: 'naoko' }))
    ]);
};

srvApp.get('/', (req, res) => {
    res.status(200).send('Hello Redis\n');
});

srvApp.get("/user/:id", async (req, res) => {
    try {
        const key: string = `users:${req.params.id}`;
        const value: string | null = await redis.get(key);

        if (value !== null) {
            const user: string = JSON.parse(value);
            res.status(200).json(user);
        }
        else {
            res.status(200).send("request key's value is null");
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('internal error');
    }
    // エラー 'ERR_HTTP_HEADERS_SENT'
    // https://zenn.dev/web3gamer/articles/45c580ed97187f
    // 原因: 1リクエストに対して複数レスポンスを返している.
    // res.status(200).send(`${req.params.id}\n`);
});


// Redis内のusers:*に一致するvalueをJSON形式ですべて返す
srvApp.get('/users', async (req, res) => {
    try {
        const stream = redis.scanStream({
            match: 'users:*',
            count: 2 // 1回の呼び出しで2つ取り出す
        });

        const users: Array<JSON> = [];
        for await (const resultKeys of stream) {
            for (const key of resultKeys) {
                const value: string | null = await redis.get(key);
                const user:JSON = JSON.parse(value!);
                users.push(user);
            }
        }
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('internal error');
    }
});

// Redisのページングを利用して要求key数が増加してもリクエストが太らない方式で返す
srvApp.get('/users/paging', async (req, res) => {
    try {
        // リクエストから得たoffsetを利用
        const offset: number = req.query.offset ? Number(req.query.offset) : 0;
        const usersList: string[] = await redis.lrange('users:list', offset, offset + 1); // 2 chunck

        const users = usersList.map((user) => {
            return JSON.parse(user);
        });

        res.status(200).json({ paging_users: users});
    } catch(err) {
        console.error(err);
        res.status(500).send('internal error');
    }
});

redis.once('ready', async () => {
    try {
        // Redisにデータを格納
        await init();
        await pageingInit();

        // サーバー起動
        srvApp.listen(PORT, () => {
            console.log("[Start] redis_server");
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