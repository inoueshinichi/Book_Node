// fileモジュールのテスト
import { readMarkdownFileSync } from "./file";
import * as path from "node:path";

test('readMarkdownFileSync', () => {
    const path: string = "./src/NodeJS_CLI/lib/test.md"
    const markdown = readMarkdownFileSync(path); // 存在しないファイルを参照しているとエラーになる.

    // 読み込んだ文字列が等しいかチェック
    expect(markdown).toStrictEqual('**bold**');
});

