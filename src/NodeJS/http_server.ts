// HTTPサーバー
import * as http from 'node:http';

// httpサーバーの作成(3000番ポート)
const server = http.createServer();

server.on('request', (req, res) => {
    res.write('hello world\n');
    res.end();
});

server.listen(3000);