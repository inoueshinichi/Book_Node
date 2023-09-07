// HTTPクライアント
import * as http from "node:http";

// サーバー(3000番ポート)に対してリクエストを行うオブジェクト
const req = http.request('http://localhost:3000', (res) => {
    // 流れてくるデータをUTF-8で解釈する
    res.setEncoding('utf-8');

    // dataイベントを受け取る(chunkイベント)
    res.on('data', (chunk) => {
        console.log(`body: ${chunk}`);
    });

    // endイベントを受け取る
    res.on('end', () => {
        console.log('end');
    });
});

// ここで初めてリクエストが送信される
req.end();