// Markdownファイルを読み込むモジュール
import * as fs from "node:fs";

// 引数にファイルの絶対パスを受け取る
export const readMarkdownFileSync = (path: string): string => {
    // 指定されたMarkdownファイルを読み込む
    const markdownStr: string = fs.readFileSync(path, { encoding: 'utf-8' });
    return markdownStr;
}

// 指定したパスにhtmlを書き出す
export const writeHtmlFileSync = (path: string, html: string) => {
    fs.writeFileSync(path, html, { encoding: "utf-8" });
}

