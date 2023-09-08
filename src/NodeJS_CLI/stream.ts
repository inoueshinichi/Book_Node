// Node.jsのStreamの使い方
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as st from "node:stream";
import * as perf from "node:perf_hooks";
import * as net from "node:net";
import * as zlib from "node:zlib"; // Gzip
import * as crypto from "node:crypto"; // 暗号化
import * as process from "node:process";
import * as child_process from "node:child_process";

/* Streamの種類 */
// stream.Readable read only
// stream.Writable write only
// stream.Duplex read and write
// stream.Transform read -> transform -> write

const filepath: string = "/Users/inoueshinichi/Desktop/MyGithub/Book_Node/data/text.txt";
const stream_filepath: string = "/Users/inoueshinichi/Desktop/MyGithub/Book_Node/data/unsequence_data.txt";

// 同期処理 ファイル読み込み
{
    const pt_start: number = perf.performance.now();

    const file_text : string = fs.readFileSync(filepath, 'utf-8');
    console.log(`File's content is ${file_text}`);

    const pt_end: number = perf.performance.now();
    console.log(`Elapsed time: ${pt_end - pt_start}[ms]`);
}

// 非同期処理(Promise) ファイル読み込み
{
    const pt_start: number = perf.performance.now();

    const file_promise = fsp.readFile(filepath);
    file_promise.then((/*Buffer*/data) => {
        console.log(data);
        console.log(`async file read: ${data.toString()}`);
    })
    .catch((err) => console.error(err));

    const pt_end: number = perf.performance.now();

    console.log(`Elapsed time: ${pt_end - pt_start}[ms]`);
    console.log("End");
}

// // Stream(EventEmitterの派生クラス) ファイル読み込み
// {
//     const stream_ret_filepath: string = "/Users/inoueshinichi/Desktop/MyGithub/Book_Node/data/ret_unsequence_data.txt";

//     console.log("[start] readStream");
//     const readStream: fs.ReadStream = fs.createReadStream(stream_filepath, 'utf-8');
//     const writeStream: fs.WriteStream = fs.createWriteStream(stream_ret_filepath, 'utf-8');

//     // stream.ReadStream
//     readStream.on(/*event*/'data', /*Buffer*/chunk => {
//         // console.log(chunk);
//         process.stdout.write(chunk);
//         writeStream.write(chunk); // 別ファイルに書き込み
//     });
//     readStream.on(/*event*/'end', () => {
//         console.error(`ReadStream 終了`);
//     });

//     // stream.WriteStream
//     writeStream.on(/*event*/'data', /*Buffer*/chunk => {
//         // nothing
//     });
//     writeStream.on(/*event*/'end', /*Buffer*/() => {
//         console.log('WriteStream 終了');
//     });

//     console.log("[end] Stream");
// }

// // stream.Duplex => TCP.Socket
// {
//     console.log("try http access");
//     const PORT: number = 80;
//     const URI: string = 'www.yahoo.co.jp';
//     const client = net.connect(PORT, URI);
//     client.pipe(process.stdout);
//     client.once('connect', () => client.write('GET / HTTP/1.0\r\n\r\n'));
// }

// stream.Transform => Crypt, zlib など
// {
//     const stream_ret_transform_filepath: string = "/Users/inoueshinichi/Desktop/MyGithub/Book_Node/data/ret_transform_unsequence_data.txt.gz";

//     console.log("try zlib with stream.Transform");
//     const gzip: st.Transform = zlib.createGzip();
//     const src: fs.ReadStream = fs.createReadStream(stream_filepath, 'utf-8');
//     const dst: fs.WriteStream = fs.createWriteStream(stream_ret_transform_filepath, 'utf-8');
//     src.pipe(gzip).pipe(dst);
// }

// 外部プロセスのストリーム(パイプ)
// child.stdin - 外部プロセスの標準入力へ書き込むストリーム
// child.stdout - 外部プロセスの標準出力から読み取るストリーム
// child.stderr - 外部プロセスの標準エラー出力から読み取るストリーム
// {
//     console.log('try ls command');
//     const cmd_ls: any = child_process.exec("ls -atl");
//     cmd_ls.stdout.pipe(process.stdout); // lsコマンドの結果を標準出力に表示
// }

// Cryptoによるファイルの暗号化(zlibによるgz化も行う)
{
    console.log("===== Cryptoによる暗号化 =====");
    // OpenSSL
    // OCCモードとOCMモードの2種類がある OCC:16bytes, OCB:12bytes
    // 暗号化
    // AES, Blowfish, CAST, IDEA, DES, DESX, Triple DES, RC2, RC4, RC5
    // ハッシュ
    // MD2, MD5, MDC2, RMD - 160, SHA, SHA1
    // 公開鍵暗号
    // RSA, DSA, Diffie - Hellman鍵交換
    const src_filepath: string = "/Users/inoueshinichi/Desktop/MyGithub/Book_Node/data/text.txt";
    const dst_encrypt_zip_filepath: string = "/Users/inoueshinichi/Desktop/MyGithub/Book_Node/data/encrypt_zip_text.txt.gz.aes";
    const ret_decrypt_unzip_filepath: string = "/Users/inoueshinichi/Desktop/MyGithub/Book_Node/data/ret_decrypt_unzip_text.txt";

    // 事前に共有すべきパスワード
    // console.log(crypto.randomBytes(32).toString('base64'))
    // const PASSWORD: string = 'l+/MraaOI1yT3F1l15fJMcEKGiG3iWn7nOTmUS4fWk0=';
    const PASSWORD: string = crypto.randomBytes(32).toString('base64');

    // 事前に共有すべき SALT
    // console.log(crypto.randomBytes(16).toString('base64'))
    // const SALT = 'kr3dJJ1mPcIKisMOR4RO6w==';
    const SALT: string = crypto.randomBytes(16).toString('base64');

    // AES アルゴリズム       
    const ALGO: string = 'aes256';

    // 鍵を生成
    const KEY: crypto.CipherKey = crypto.scryptSync(PASSWORD, SALT, 32);

    // 暗号化
    async function encryptZipFile(algo: string, key: crypto.CipherKey): Promise<crypto.BinaryLike>
    {
        // IV を生成
        const iv: crypto.BinaryLike = crypto.randomBytes(16);

        fs.createReadStream(src_filepath, 'utf-8')
            .pipe(zlib.createGzip()) // zip
            .pipe(crypto.createCipheriv(/* algo */algo, /* key */key, /* initialial vector */iv)) // OpenSSLの暗号化器
            .pipe(fs.createWriteStream(dst_encrypt_zip_filepath)); // ファイル作成

        console.log("[start] async zip and encrypto");

        return iv;
    }

    // 復号化
    async function decryptUnzipFile(algo: string, key: crypto.CipherKey, iv: crypto.BinaryLike): Promise<void>
    {
        // const decrypt = crypto.createDecipheriv(/* algo */algo, /* key */key, /* initialize vector */iv); // OpenSSL
        // const unzip = zlib.createGunzip();
        // const readStream: fs.ReadStream = fs.createReadStream(dst_encrypt_zip_filepath, 'utf-8')
        // const writeStream = fs.createWriteStream(ret_decrypt_unzip_filepath, 'utf-8');
        
        // readStream.pipe(decrypt);

        // decrypt.on('data', chunk => {
        //     const decryptedText = chunk + decrypt.final('utf-8');
        //     unzip.write(decryptedText);
        // });

        // unzip.pipe(writeStream);
        
        const readStream = fs.createReadStream(dst_encrypt_zip_filepath, 'utf-8');
        const decrypt = crypto.createDecipheriv(/* algo */algo, /* key */key, /* initialize vector */iv); // OpenSSL
        const unzip = zlib.createGunzip(); // unzip
        const writeStream = fs.createWriteStream(ret_decrypt_unzip_filepath, 'utf-8');

        readStream.on('data', chunk => {
            console.log(`[Check-readStream] ${chunk}`);
            decrypt.write(chunk);
        });

        readStream.on('end', () => {
            console.log("decrypto readstream 終了");
        })

        decrypt.on('data', chunk => {
            const decryptedText = chunk + decrypt.final('utf-8');
            unzip.write(decryptedText);
        });

        decrypt.on('end', () => {
            console.log("decrypto decrypt 終了");
        });

        unzip.on('data', chunk => {
            console.log(`[Check-unzip] ${chunk}`);
            writeStream.write(chunk);
        });

        unzip.on('end', () => {
            console.log("decrypto unzip 終了");
        });

        writeStream.on('data', chunck => {
            process.stdout.write(chunck);
        });

        writeStream.on('end', () => {
            console.log("decrypto writestream 終了");
        });


        console.log("[start] async decrypto and unzip");
    }

    // 実行 (非同期の即時実行)
    (async () => {
        const IVfromEncrypto: crypto.BinaryLike = await encryptZipFile(ALGO, KEY); // 暗号化
        console.log(`crypt iv: ${IVfromEncrypto}`);
        await decryptUnzipFile(ALGO, KEY, IVfromEncrypto); // 復号化
    })();

    // 復号化されてファイルに書き込まれない....
}