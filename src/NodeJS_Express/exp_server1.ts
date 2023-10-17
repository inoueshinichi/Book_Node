// ExpressによるWebAPIサーバー
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as st from "node:stream";
import * as perf from "node:perf_hooks";
import * as process from "node:process";
import * as child_process from "node:child_process";
import * as net from "node:net";
import * as zlib from "node:zlib"; // Gzip
import * as crypto from "node:crypto"; // 暗号化

import express from "express";

const PORT: number = 3000;

// サーバー用インスタンスを作成
const srvApp: any = express();

const appLevelCommonMiddleWare = (req, res, next) => {
    console.log("common middleware");
    next();
};

// useで設定したミドルウェアは、以降のコードにおける
// アプリケーションレベル（すべてのリクエスト)に共通して実行される
srvApp.use(appLevelCommonMiddleWare);

srvApp.get("/", (req, res) => {
    res.status(200).send('Hello Express!\n');
});

srvApp.get('/usr/:id', 
    (req, res, next) => {
        // ミドルウェア
        console.log(req.method, req.url);
        next();
    },
    (req, res) => {
    res.status(200).send(`${req.params.id}\n`);
});

const middleWare = (req, res, next) => {
    // APIのトークンがヘッダーになかったらステータスコード403を返す.
    if (!req.headers['api-token']) {
        return res.status(403).send("Forbitten\n");
    }
    next();
}

srvApp.get('/api/:id', middleWare, (req, res) => {
    res.status(200).send(`Allowed access: ${req.params.id}`);
});

srvApp.get('/err', (req, res) => {
    throw new Error("同期的なエラー");
    console.log("errルート");
    res.status(200).send('errルート\n');
});

// 非同期なエラーは包括的エラーハンドリングでキャッチできない
srvApp.get("/async/err", async (req, res) => {
    throw new Error("非同期エラー"); // プロセス内でキャッチできないので、サーバーが落ちる.
    console.log("async errルート");
    res.status(200).send("async errルート");
});

// 包括的エラーハンドリング(同期処理とnext関数の引数ににErrorを指定した場合のみ)
srvApp.use((err, req, res, next) => {
    res.status(500).send('Internal Server Error\n');
});

srvApp.listen(PORT, () => {
    // サーバー起動後に呼ばれる
    console.log("Start express server");
});