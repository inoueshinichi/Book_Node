// CommonJS Module
// ioredisでRedisインスタンスをnewで生成するときの引数

type RedisConfig = {
    port: number;
    host: string;
    password?: string;
    enableOfflineQueue: boolean;
};

const redisConfig: RedisConfig = {
    port: 6379,
    host: 'localhost',
    password: process.env.REDIS_PASSWORD,
    enableOfflineQueue: false
};

exports.redisConfig = redisConfig;

// モジュール宣言
export { };