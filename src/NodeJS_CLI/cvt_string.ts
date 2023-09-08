// 文字列とバイト列の変換
import process from "node:process";
import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';

// 文字列とUint8Arrayの相互交換
{
    const textEnc = new TextEncoder();
    const textDec = new TextDecoder();

    // 'あ' => Uint8Array(3) [227, 129, 130] 
    const text: string = 'あ';
    console.log(`Encoding: ${textEnc.encoding}`);
    const uint8vec: Uint8Array = textEnc.encode(text);
    
    // 16進数文字列に変換 => ["e3","81","82"]
    let hex_uint8vec: string[] = [];
    for (const v of uint8vec) {
        hex_uint8vec.push(v.toString(16));
    }

    // 表示
    console.log(`${text} = encode => ${uint8vec} = hex => ${hex_uint8vec}`);

    // ["e3","81","82"] => Uint8Array(3) [227, 129, 130]
    const ret_numvec: number[] = hex_uint8vec.map(v => parseInt(v, 16));
    const ret_uint8vec: Uint8Array = Uint8Array.from(ret_numvec);

    // Uint8Array(3) [227, 129, 130] => "あ"
    const ret_text: string = textDec.decode(ret_uint8vec);

    // 表示
    console.log(`${hex_uint8vec} = number => ${ret_numvec} => uint8array => ${ret_uint8vec} = decode => ${ret_text}`);
}

// 文字列のバイトサイズ(utf-8)
{
    // Uint8Array.byteLength
    const textEnc = new TextEncoder();
    const text: string = 'あ';
    console.log(`bytes of ${text} is ${textEnc.encode(text).byteLength}`);

    // ループでバイトサイズを計算
    let size: number = 0;
    for (const v of textEnc.encode(text)) {
        size++;
    }
    console.log(size);
}

// サロゲートペアの扱い
{
    // UTF-16では, [U+10000]~[U+10FFFF]の範囲の文字の内部データは
    // 2つのコードポイントを組合せたサロゲートペアで表現される(つまり4バイト).
    // サロゲートペア = { ハイサロゲート, ローサロゲート }
    // = { [U+D800]~[U+DBFF], [U+DC00]~[U+DFFF]} = { [HH, HL], [LH, LL] }
    // 代替文字（U+FFFD）

    // 適当な文字がデータ形式として正しいのか (well-formed)
    {
        let text = 'あ';
        // console.log(`${text} is well-formed => ${text.isWellFormed()}`); // true
         
        text = "\u{D800}";
        // console.log(`${text} is well-formed => ${text.isWellFormed()}`); // false
    }

    // ハイサロゲートを代替文字(U+FFFD)に置き換える
    {
        let text = "\u{D800}";
        // console.log(`${text} = replace to U+DFFF => ${text.toWellFormed()}`); // '�'
    }
}

// 文字列, Buffer, Uint8Arrayの相互変換
{
    // 文字列 <=> Buffer
    {
        // 文字列 => Buffer
        const text: string = "井上";
        const buffer: Buffer = Buffer.from(text, 'utf-8');
        console.log(buffer);

        // Buffer => 文字列
        const ret_text: string = buffer.toString();

        // 表示
        console.log(`Buffer of ${ret_text} is ${buffer}`);
    }

    // Buffer <=> Uint8Array
    {
        // Buffer => Uint8Array
        const buffer: Buffer = Buffer.from("真一");
        console.log(buffer);
        const uint8vec: Uint8Array = Uint8Array.from(buffer); // new Uint8Array(buffer);
        console.log(`buffer: ${buffer} = Uint8Array => ${uint8vec}`);

        // Uint8Array => Buffer
        const ret_buffer: Buffer = Buffer.from(uint8vec);
        console.log(ret_buffer);
    }

    // Buffer <=> 文字列
    {
        // Buffer => 文字列
        const buffer: Buffer = Buffer.from("井上真一");
        console.log(buffer);
        const text: string = buffer.toString('hex'); // 16進数文字列
        console.log(`${buffer} = string(hex) => ${text}`);

        // 文字列 => Buffer
        const ret_buffer: Buffer = Buffer.from(text, 'hex');
        console.log(ret_buffer);
    }
}

// Buffer, Uint8Array と 配列(オブジェクト)の相互変換
{
    // Buffer => 配列
    {
        const buffer: Buffer = Buffer.from("井上真一"); // 0-255(char)の配列オブジェクトを新規に作成
        const numArr: number[] = Array.from(buffer);
        console.log(`${buffer} = Array => ${numArr}`);
    }

    // Uint8Array => 配列
    {
        // 文字列はコードポイントがあるので, 指定したエンコーディングでバイト列に変換する
        const textEnc: TextEncoder = new TextEncoder(); // 常にutf-8エンコーディング
        const uint8vec: Uint8Array = Uint8Array.from(textEnc.encode("井上真一"));
        console.log(uint8vec);

        const numArr: number[] = Array.from(uint8vec);
        console.log(numArr);
    }
}
