// CommonJS Module
// redis.getとredis.scanStreamのモック関数

const mockRedisGet = jest.fn(); // get
const mockRedisScanStream = jest.fn(); // scanStream

// 下位モジュールからこのモジュールに公開するgetClientのモック化
jest.mock("../lib/redis", () => {
    return {
        getClient: jest.fn().mockImplementation(() => {
            return {
                get: mockRedisGet,
                scanStream: mockRedisScanStream
            };
        })
    };
});

const { getUser, getUsers } = require("./users");

// モック関数の初期化
beforeEach(() => {
    mockRedisGet.mockClear();
    mockRedisScanStream.mockClear();
});

// getUserの成功テスト
test('[Success] getUser', async () => {

    // Promise<Resolve>を返すモック
    mockRedisGet.mockResolvedValue(JSON.stringify({ id: 1, name: 'alpha' }));

    // リクエストを定義
    const reqMock = { params: { id: 1 } };

    // getUserのテスト
    const res: any = await getUser(reqMock);

    // 返り値のテスト
    expect(res.id).toStrictEqual(1);
    expect(res.name).toStrictEqual('alpha');

    // 呼び出し回数のテスト
    expect(mockRedisGet).toHaveBeenCalledTimes(1);

    // 実引数のテスト
    const [arg1] = mockRedisGet.mock.calls[0];
    expect(arg1).toStrictEqual('users:1');
});

// getUserの失敗テスト
test('[Fail] getUser', async () => {
    // 実際のアプリ開発では、失敗時のテストこそ重要
    // 意図：「失敗時にきちんと失敗すること」をテストしたい

    // [1] expect()が2回発生することを期待する
    // [1] 失敗を正常に検出する
    expect.assertions(2);

    // [3] 失敗を検知する3つめの方法
    // let counter = 0;

    // Promise<Reject>を返すモック
    mockRedisGet.mockRejectedValue(new Error('something error'));

    const reqMock = { params: { id: 1} };

    try {
        // getUser()関数が例外をthrowすることを期待している
        await getUser(reqMock); // 内部でgetClient().get()を呼ぶ(ここではMock化している)
        // [2] expect.assertions(2); を用いない場合, 下記で検出する方法もある.
        // [2] assert.strictEqual(true, false, "このassert処理が通ると正常終了しているのでおかしい");
    } catch (err: any) {
        expect(err.message).toStrictEqual('something error');
        expect(err instanceof Error).toStrictEqual(true);

        // [3] counter++;
        // [3] assert.strictEqual(counter, 1, 'catchが呼ばれている');
    }
    // [3] assert.strictEqual(counter, 1, 'catchが呼ばれている');
});

// // 戻り値(res)のテストからモック(res)の呼び出しにテストが変化
// test('[Success] getUser (req,res)', async () => {
//     // Promise<Resolve>を戻り値にする
//     mockRedisGet.mockResolvedValue(JSON.stringify({ id: 1, name: 'alpha' }));

//     const reqMock = { params: { id: 1 } };

//     // await getUser()が戻り値を返さないので戻り値をMock化
//     const resMock = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn().mockReturnThis() // 自身を戻り値にするメソッドチェイン可能な関数を定義
//     };

//     await getUser(reqMock, resMock);

//     // res.statusのテスト
//     expect(resMock.status).toHaveBeenCalledTimes(1);
//     expect(resMock.status).toHaveBeenCalledWith(200);

//     // res.jsonのテスト (getUserにresを注入したのでresのMockを追加する)
//     expect(resMock.json).toHaveBeenCalledTimes(1);
//     expect(resMock.json).toHaveBeenCalledWith(
//         // expect.objectContainingはオブジェクトに引数の要素が含まれているかチェックする関数.
//         // (A) 曖昧チェック. 他のプロパティが存在してもテストをパスする.
//         expect.objectContaining({ id: 1, name: 'alpha' })
//     );

//     // (A)の厳密チェックはこっち
//     // expect(resMock.json).toHaveBeenCalledWith({ id: 1, name: 'alpha' });

//     // redis.getの呼び出し回数のテスト
//     expect(mockRedisGet).toHaveBeenCalledTimes(1);
//     expect(mockRedisGet.mock.calls.length).toStrictEqual(1);

//     // 実引数のテスト
//     // toHaveBeenCalledWithに書き換えてもOK
//     const [arg1] = mockRedisGet.mock.calls[0];
//     expect(arg1).toStrictEqual('users:1');
// });

// test('[Fail] getUpser (req,res)', async () => {

//     // Promise<Reject>を戻り値とする
//     mockRedisGet.mockRejectedValue(new Error('something error'));

//     const reqMock = { params: { id: 1} };
//     const resMock = {
//         status: jest.fn().mockReturnThis(),
//         send: jest.fn().mockReturnThis()
//     };

//     await getUser(reqMock, resMock);

//     // resMockの呼び出しテスト
//     expect(resMock.status).toHaveBeenCalledTimes(1);
//     expect(resMock.status).toHaveBeenCalledWith(500);
//     expect(resMock.send).toHaveBeenCalledTimes(1);

//     expect(resMock.send).toHaveBeenCalledWith('internal error');
// });

// getUsersの成功テスト
test('[Success] getUsers', async () => {

    // AsyncIteratorのモック化
    const streamMock = {

        /* 非同期Generator関数の記述方式1 */
        // async* [Symbol.asyncIterator]() {
        //     yield ['users:1', 'users:2'];
        //     yield ['users:3', 'users:4'];
        // }

        /* 非同期Generator関数の記述方式2 */
        [Symbol.asyncIterator]: async function * () {
            yield ['users:1', 'users:2'];
            yield ['users:3', 'users:4'];
        }
    };

    // AsyncIteratorオブジェクトを戻り値に設定
    mockRedisScanStream.mockReturnValueOnce(streamMock);

    // モックの実装を定義
    mockRedisGet.mockImplementation((key) => {
        switch (key) {
            case 'users:1':
                return Promise.resolve(JSON.stringify({ id: 1, name: 'alpha' }));
            case 'users:2':
                return Promise.resolve(JSON.stringify({ id: 2, name: 'beta' }));
            case 'users:3':
                return Promise.resolve(JSON.stringify({ id: 3, name: 'gamma' }));
            case 'users:4':
                return Promise.resolve(JSON.stringify({ id: 4, name: 'delta' }));
        }
        return Promise.resolve(null);
    });

    // AsyncIteratorがgetUsersの内部で正しく動作しているかのテスト
    const reqMock = {};
    const res = await getUsers(reqMock);

    // getとscanstreamの呼び出し回数のテスト
    expect(mockRedisScanStream).toHaveBeenCalledTimes(1);
    // expect(mockRedisGet).toHaveBeenCalledTimes(4);
    expect(mockRedisGet.mock.calls.length).toStrictEqual(4); // *.mock.calls.lengthを直接呼び出す.

    // 戻り値のテスト
    expect(res.users.length).toStrictEqual(4);
    expect(res.users).toStrictEqual([
        { id: 1, name: 'alpha' },
        { id: 2, name: 'beta' },
        { id: 3, name: 'gamma' },
        { id: 4, name: 'delta' },
    ]);

    // ループでの戻り値のテスト(参考)
    // メリット: 記述が楽
    // デメリット: 空配列でもテストがパスしてしまう
    // for (const user of res.users) {
    //     if (user.id === 1) {
    //         expect(user.name).toStrictEqual('alpha');
    //     } else if (user.id === 2) {
    //         expect(user.name).toStrictEqual('beta');
    //     } else if (user.id === 3) {
    //         expect(user.name).toStrictEqual('gamma');
    //     } else if (user.id === 4) {
    //         expect(user.name).toStrictEqual('delta');
    //     }
    // }
});

// getUsersの失敗テスト
test('[Fail] getUsers', async () => {
    
});


// モジュール宣言
export {};

