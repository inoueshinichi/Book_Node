import Redis from "ioredis";
import express from "express";
import path from "path"
import { fileURLToPath } from 'url';


// ES Modules 環境下でも__filename, __dirnameを使用する方法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// サーバー用インスタンスを作成
const srvApp: any = express();
const PORT: number = 3000;

// SIGTERMによるGracefullShutdown
const timeout: number = 30 * 1000; // 30秒
process.on('SIGTERM', () => {
    // Gracefull Shutdown開始
    console.log('Gracefull Shutdown...');
    // 新規リクエストの停止
    srvApp.close(() => {
        // 接続中のコネクションが全て終了したら実行される.
        console.log('Finish all requests');
    });

    const timer = setTimeout(() => {
        // タイムアウトによる強制終了
        process.exit(1);
    }, timeout);

    timer.unref();
});

// SIGINT
process.on('SIGINT', () => {
    console.log("SIGINT shutdown...");
    process.exit(1); // これ必要.
});

// ejsをビューエンジンに指定
srvApp.set('view engine', 'ejs');

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
        redis.set('users:2', JSON.stringify({ id: 2, name: 'beta' })),
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
    res.status(200).send('Hello view template engine with redis\n');
});

srvApp.get('/view', (req, res) => {
    res.render(path.join(__dirname, "..", "..", "views", "index.ejs"));
});

srvApp.get('/view/users', async (req, res) => {

    try {
        const stream = redis.scanStream({
            match: 'users:[0-9]*', // glob pattern (通常の正規表現ではない!)
            count: 2
        });

        const users: Array<JSON> = [];
        for await (const resultKeys of stream) {
            for (const key of resultKeys) {
                const value: string | null = await redis.get(key);
                const user: JSON = JSON.parse(value!);
                users.push(user);
            }
        }

        // RedisのDB情報に基づきHTMLをサーバー側で生成
        res.render(
            path.join(__dirname, "../../views", "users.ejs"),
            { users: users }
        );

    } catch (err) {
        console.error(err);
    }
});

// 静的ファイル(JS)の配信
srvApp.use('/static/js', express.static(path.join(__dirname, '..', '..', 'public', 'js')));

// 同期的エラーは包括的エラーハンドリングでキャッチ
srvApp.get('/sync/err', (req, res) => {
    throw new Error("同期的なエラー");
    console.log("errルート");
    res.status(200).send('errルート\n');
});

// 非同期なエラーは包括的エラーハンドリングでキャッチ不可
srvApp.get("/async/err", async (req, res) => {
    throw new Error("非同期エラー"); // プロセス内でキャッチできないので、サーバーが落ちる.
    console.log("async errルート");
    res.status(200).send("async errルート");
});

// 包括的エラーハンドリング(同期処理とnext関数の引数ににErrorを指定した場合のみ)
srvApp.use((err, req, res, next) => {
    res.status(500).send('Internal Server Error\n');
});


redis.once('ready', async () => {
    try {
        // Redisにデータを格納
        await init();
        await pageingInit();

        // サーバー起動
        srvApp.listen(PORT, () => {
            // サーバー起動後に呼ばれる
            console.log("[Start] view_engine_server with redis");
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