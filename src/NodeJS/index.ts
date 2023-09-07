import { access } from "node:fs/promises";
// import { readFile, writeFile, appendFile } from "node:fs";
import * as fsp from "node:fs/promises";
import * as fs from "node:fs"; // createReadStream
import { existsSync, rmSync, appendFileSync } from "node:fs";
import { promisify } from "node:util";
import { request } from "undici"; // HTTP (3rd party)
import { EventEmitter, Writable, Readable, Duplex, Transform } from "node:events"; // Stream型


{
    console.log('hello Node.js');

    // varは基本つかわない
    if (true) {
        var foo = 5;
    }
    console.log(foo);

    let bar: number = 180;
    console.log(bar);

    let str: string = "こんにちは";
    console.log(str);
}

// Data type
{
    console.log(typeof 'string'); // string
    console.log(typeof []); // object
    console.log(typeof console.log); // function
    console.log(typeof null); // object

    const obj: {
        key1: string;
        key2: number;
    } = {
        key1: 'value',
        key2: 123,
    };

    console.log(obj);


    const obj2: any = {
        foo: {
            bar: 'baz'
        },
        now: new Date(),
        func: function () {
            console.log('function')
        }
    };
    console.log(obj2);
    console.log(obj2.foo.bar);
    console.log(obj2.now)
    console.log(obj2.func);

    const key1: string = "google";
    const key2: string = "yahoo";
    const searchEngine = {
        key1,
        key2,
    };
    console.log(searchEngine);
    console.log(searchEngine.key1);
    console.log(searchEngine.key2);

    const key: string = 'keyName';
    const idx_obj: any = {
        [key]: 'bing'
    };
    console.log(idx_obj);

    // . or [] でアクセス
    const access_obj: any = {
        foo: 'hello',
        bar: {
            baz: 'world'
        }
    };
    console.log(access_obj);
    console.log(access_obj.foo); // hello
    console.log(access_obj['foo']); // hello
    console.log(access_obj.bar.baz); // world
    console.log(access_obj['bar']['baz']); // world


    // Object.freeze()で最上位のオブジェクトを凍結しても
    // 下位のオブジェクトには代入できる. (オブジェクトはC言語のポインタと同じ)
    const frozen_obj: any = {
        ice: 'cream'
    };
    Object.freeze(frozen_obj);
    console.log(frozen_obj.ice); // cream
    // frozen_obj.ice = 'block';
    // console.log(frozen_obj.ice); // block
}

// ObjectとJSON
{
    const obj: any = {
        foo: function () {
            console.log('foo');
        },
        bar: 'bar'
    };

    // fooプロパティはJSONに変換できないので消えてしまう
    const jsonStr = JSON.stringify(obj);

    console.log(obj);
    console.log(jsonStr);

    // パースしたobjも関数プロパティは消えている
    const parsedObj = JSON.parse(jsonStr);
    console.log(parsedObj);
}

// 配列
{
    const strArray: Array<string> = ['foo', 'bar', 'baz'];
    console.log(strArray[0]); // foo
    console.log(strArray.at(-1)); // baz
    console.log(strArray.length); // 3

    type Person = { name: string; age: number };

    const students: Array<Person> = [
        { name: 'Alice', age: 10 },
        { name: 'Bob', age: 20 },
        { name: 'Catherine', age: 30 }
    ];

    // map
    const nameArray: Array<string> = students.map(function (person: Person): string {
        return person.name;
    });
    console.log(nameArray); // ['Alice', 'Bob', 'Catherine']

    // filter
    const under20 = students.filter((person: Person): boolean => {
        return person.age <= 20;
    });
    console.log(under20);
}

// class, JavaScriptのclassはprototypeのシンタックスシュガー
{
    class People {
        name: string;
        constructor(name: string) {
            this.name = name;
        }

        printName(): void {
            console.log(this.name);
        }
    }

    const p = new People('shinichi');
    p.printName();

    /* prototypeを使う旧型の記述 */
    // コンストラクタ
    function Person(name: string) {
        this.name = name;
    }

    Person.prototype.printName = function () {
        console.log(this.name);
    }

    const old_p = new Person('inoue');
    old_p.printName();
}

// 非同期処理 (Core API)
{
    const dataDir: string = "/Users/inoueshinichi/Desktop/MyGithub/Book_TypeScript/data/";

    // 1. callback
    {
        console.log('A');

        // エラーファーストコールバック方式
        // readFile(__filename, (err, data) => {
        //     console.log('B', data);
        // });

        // Promise方式
        fsp.readFile(dataDir + "text.txt").then(file => {
            console.log(file);
        }).catch(err => {
            console.error(err);
        });

        console.log('C');

        // 1. ファイルの読み込み
        // 2. ファイル名をフォーマットして別名で書き込み
        // 3. アクセス権限をreadonlyに変更
        const backupFile = dataDir + `text-${Date.now()}`;

        // コールバックのネスト地獄なのでこの記述はダメ.
        fsp.readFile(dataDir + "text.txt").then(file => {
            console.log(`read file: ${file}`);
            fsp.writeFile(backupFile, file).then(file => {
                fsp.chmod(backupFile, 0o400).then(file => {
                    console.log('done 2');
                });
            }).catch(err => {
                console.log(`Failed to writeFile: ${err}`);
            })
        }).catch(err => {
            console.log(`Failed to readFile: ${err}`);
        });

        console.log("done 1");
    }

    // 単純なコールバックでは, 非同期処理の順序は保証されない
    {
        // ファイルが存在すれば同期的にファイル削除
        if (existsSync(dataDir + "unsequence_data.txt")) {
            rmSync(dataDir + "unsequence_data.txt");
        }

        // 非同期で書き込み
        for (let i = 0; i < 100; i++) {
            const recordText = `write: ${i}\n`;
            fsp.appendFile(dataDir + "unsequence_data.txt", recordText).catch(err => {
                console.error(`Failed to appendFile: ${err}`);
            });
        }
        console.log("done 3");

        // ファイルが存在すれば同期的にファイル削除
        if (existsSync(dataDir + "sequence_data.txt")) {
            rmSync(dataDir + "sequence_data.txt");
        }

        // 同期的に書き込み
        for (let i = 0; i < 100; i++) {
            const recordText = `write: ${i}\n`;
            appendFileSync(dataDir + "sequnce_data.txt", recordText);
        }

        console.log('done 4');
    }

    // Promise
    {
        const promiseFunc = (x: any): Promise<any> => {
            // 型定義
            type Executor = (resolve: (value: any) => void, reject: (reason?: any) => void) => void;

            // 非同期実行処理
            const executor: Executor = (resolve, reject) => {
                // 非同期で行う処理をここに記述
                const name: string = "Shinichi Inoue";
                console.log(`${name} on executor in promise`);

                // 状態の決定(FulFilled状態:成功, Rejected状態:失敗)
                if (typeof x === `string`) {
                    resolve(name); // 成功
                } else {
                    reject(new Error("Promise reject error.")); // 失敗
                }
            };

            return new Promise(executor);
        };

        const myPromise: Promise<any> = promiseFunc('string type');

        myPromise.then((value: any): void => {
            console.log(`成功: ${value}`);
        }).catch((err: any): void => {
            console.log(`失敗`);
        });

        console.log("done 5");
    }

    // Promise化
    {
        const my_readFileAsync = promisify(fs.readFile);
        const my_writeFileAsync = promisify(fs.writeFile);
        const my_chmodAsync = promisify(fs.chmod);

        // 最新のNode.jsでは 標準化された(Promiseを返す)非同期関数が利用できる.
    }

    // Async/Await
    {
        // read/write/chmod
        {
            // async関数はPromise<T>を戻り値にする
            // return Promise.resolve(T)
            const main = async (): Promise<string> => {
                const backupFile = dataDir + `async_await_text-${Date.now()}`;
                const data = await fsp.readFile(dataDir + `text.txt`);
                await fsp.writeFile(backupFile, data);
                await fsp.chmod(backupFile, 0o400); // 読み取り専用
                return "async return value";
            };

            // 実行
            main().then((data: string): void => {
                // Promise成功時 Promise.resolve(T) -> FulFilled状態
                console.log(data);
            }).catch((err: string): void => {
                // 例外もしくはPromise.reject(T) -> Rejected状態
                console.error(err);
            });

            console.log("done 6");
        }
    }

    // Async/AwaitとPromise.allによるタスクの並行処理(シングルスレッド)
    {
        const task = async () => {
            const resArray = await Promise.all([
                request('https://www.yahoo.co.jp/'),
                request('https://shopping.yahoo.co.jp/'),
                request('https://actions.yahoo.co.jp/')
            ]);

            for (const res of resArray) {
                // Promiseとawait組み合わせ可能
                const body = await res.body.text();
                const title = body.match(/<title>(.*)<\/title>/g);
                console.log(title);
            }

            return "[Done] request";
        };

        task()
            .then((data) => console.log(data))
            .catch((err) => console.error(err));

        console.log("done 7");
    }
}


// イベント駆動型非同期フロー制御(ストリーム型)
// EventEmitter/Stream
// 全体をチャンク毎に分解したイベント毎にコールバック関数が何度も呼ばれる
// 1. チャンクごとのイベントに対するコールバック関数を設定する.
// 2. 全体が終了したときの終了イベントに対するコールバック関数を設定する.
// 3. 例外が発生したときのイベントに対するコールバック関数を設定する.
{
    // 基底クラス EventEmitter
    // ベース派生クラス Stream extends EventEmitter
    // データの書き込み専用派生クラス Writable extends Stream
    // データの読み込み専用派生クラス Readable extends Stream
    // 書き込み/読み込みの両刀派生クラス Duplex extends Writable, Readable
    // Duplexを継承し, 読み書きしたデータに対して変換処理を施す派生クラス Transform extends Duplex

    // Writable : e.g. fs.createWriteStream
    // Readable : e.g. fs.createReadStream
    // Duplex : e.g. net.Socket
    // Transform : e.g. zlib.createDeflate

    // EventEmitterクラス
    {
        // EventEmitterクラスを継承して独自のイベントを扱うクラス
        class MyEmitter extends EventEmitter { }

        const myEmitter = new MyEmitter();

        // my_eventという名前のeventを受け取るリスナーを設定
        myEmitter.on('my_event', (data) => {
            console.log('on my_event:', data);
        });

        // my_eventの発行
        myEmitter.emit('my_event', 'one');

        // エラーハンドリングは必須
        myEmitter.on('error', (err) => {
            console.error(err);
        });

        setTimeout(() => {
            // my_eventの発行
            myEmitter.emit('my_event', 'two');
        }, 1000);

        console.log("done 8");
    }

    // AsyncIterator
    {
        const dataDir: string = "/Users/inoueshinichi/Desktop/MyGithub/Book_TypeScript/data/"



        // 少し待つ非同期関数
        const sleep: any = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const this_ts_filename = "index.ts";
        const this_ts_dirname = "/Users/inoueshinichi/Desktop/MyGithub/Book_TypeScript/src/NodeJS/src/";
        const writeFileName: string = dataDir + `${this_ts_filename}-${Date.now()}`;

        // ファイルを読み込むStreamを生成(64byteずつ)
        const readStream: ReadableStream<any> = fs.createReadStream(this_ts_dirname + this_ts_filename,
            { encoding: 'utf8', highWaterMark: 64 });

        const write = async (chunk: Uint8Array) => {
            // (Math.random() * 1000)ms 待つ
            await sleep(Math.random() * 1000);
            // ファイルに追記モードで書き込む
            await fs.writeFile(writeFileName, chunk, { flag: 'a' });
        }

        let counter = 0;

        /* AsyncIteratorなし */
        // ファイルのデータを読み込むたびに実行されるリスナー
        // readStream.on('data', async (chunk: Uint8Array) => {
        //     console.log(counter, chunk);
        //     counter++;

        //     // バックアップファイルに書き出し
        //     // await write(chunk); // エラー  code: 'ERR_INVALID_ARG_TYPE' 原因分からず.
        // });

        /* AsyncIteratorあり */
        // ひどうきに発生するイベントを直列的に処理する(パフォーマンスは低)
        for await (const chunk: Uint8Array of readStream) {
            console.log(counter, chunk);
            counter++;

            // バックアップファイルに書き出し
            // await write(chunk);
        }

        // ファイルの読み込みが終了した時に実行されるリスナー
        readStream.on('close', () => {
            console.log('close stream:');
        });

        // エラーハンドリング
        readStream.on('error', (e: Error) => {
            console.log('error', e);
        });
    }
}