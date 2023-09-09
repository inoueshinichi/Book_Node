#!/Users/inoueshinichi/.nodebrew/current/bin/node
import { marked } from "marked"; // markedを追加

import * as path from 'path';
// import * as fs from 'fs';
import yargs from "yargs";
import { hideBin } from "yargs/helpers"; // process.argv.slice(2)のシンタックスシュガー
import process from "process";

import { getPackageName } from "./lib/name.js";
import { readMarkdownFileSync, writeHtmlFileSync } from "./lib/file.js";

// プロセス引数
// console.log(`argv: ${process.argv}`);
// console.log(process.argv);
const { argv } = yargs(hideBin(process.argv))
    // オプションの説明を追加
    .option('name', {
        describe: 'CLI名を表示'
    })
    .option('file', {
        describe: 'Markdownファイルのパス'
    })
    .option('out', {
        describe: 'html file',
        default: 'article.html'
    });

console.log(argv); // 引数の表示

// package.jsonの取得
const dirname: string = "/Users/inoueshinichi/Desktop/MyGithub/Book_Node/"
// const packageStr: string = fs.readFileSync(path.resolve(dirname, 'package.json'), { encoding: 'utf-8'});
// const packageJson: any = JSON.parse(packageStr);
// console.log("----- output package -----");
// console.log(packageJson);

// nameオプションのチェック
// const nameOption: boolean = process.argv.includes('--name');
// if (nameOption) {
//     console.log("name=", packageJson.name);
// } else {
//     console.log('オプションがありません.');
// }

if (argv.name) {
    const name: string = getPackageName();
    console.log(name);
    process.exit(0);
}

console.log("===== output =====");
// if (argv.file) {
//     console.log(argv.file);
// } else if (argv.name) {
//     console.log("name=", packageJson.name);
//     // nameオプションが入っていた場合、他のオプションを使わないので正常終了させる
//     process.exit(0);
// } else {
//     console.log('オプションがありません.');
// }

// 指定されたMarkdownファイルを読み込む
const dirpath: string = dirname + '/dist/NodeJS_CLI/';
// const markdownStr: string = fs.readFileSync(path.resolve(dirpath, argv.file), { encoding: 'utf-8' });
// console.log(markdownStr);

const markdonwStr: string = readMarkdownFileSync(path.resolve(dirpath, argv.file));
// MarkdownをHTMLに変換
const html: string = marked(markdonwStr);

// htmlをファイルに書き出し
writeHtmlFileSync(path.resolve(dirpath, argv.out), html);
