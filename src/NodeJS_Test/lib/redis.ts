// CommonJS Module
const { redisConfig } = require("../ioredis_config");
const Redis = require('ioredis');

let redis: any = null;
exports.redis = redis;

// Mock化対象
function getClient() {
    return redis;
}

exports.getClient = getClient;

const connect = () => {
    if (!redis) {
        redis = new Redis(redisConfig);
    }
    return redis;
}

exports.connect = connect;

const init = async () => {
    await Promise.all([
        redis.set('users:1', JSON.stringify({ id: 1, name: "alpha" })),
        redis.set('users:2', JSON.stringify({ id: 2, name: "beta" })),
        redis.set('users:3', JSON.stringify({ id: 3, name: "gamma" })),
        redis.set('users:4', JSON.stringify({ id: 4, name: "epsilon" })),
        redis.set('users:5', JSON.stringify({ id: 5, name: "kai"}))
    ]);
};

exports.init = init;

// モジュール宣言
export { };