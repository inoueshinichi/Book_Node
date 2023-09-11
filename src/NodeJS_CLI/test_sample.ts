// テスト方法

import * as assert from 'node:assert';

// 基本
{
    // OK
    assert.strictEqual(1 + 2, 3, '[1+2=3]である');

    // NG
    // assert.strictEqual(1 + 2, 4, '[1+2=3]である');
}

// オブジェクトの比較
{
    const obj1 : {
        a: {
            b: number;
        };
    } = {
        a: {
            b: 1
        }
    };

    const obj2 : {
        a: {
            c: number;
        };
    } = {
        a: {
            c: 1
        }
    };

    // オブジェクトの比較
    assert.deepStrictEqual(obj1, obj2, 'オブジェクトは等しい');
}
