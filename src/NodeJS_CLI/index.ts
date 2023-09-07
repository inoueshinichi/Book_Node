import * as path from 'path';
import * as fs from 'fs';
import yargs from "yargs";
import { hideBin } from "yargs/helpers"; // process.argv.slice(2)のシンタックスシュガー
import process from "process";

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
    });

console.log(argv); // 引数の表示

// package.jsonの取得
const dirname: string = "/Users/inoueshinichi/Desktop/MyGithub/Book_TypeScript/"
const packageStr: string = fs.readFileSync(path.resolve(dirname, 'package.json'), { encoding: 'utf-8'});
const packageJson: any = JSON.parse(packageStr);
console.log("----- output package -----");
console.log(packageJson);

// nameオプションのチェック
// const nameOption: boolean = process.argv.includes('--name');
// if (nameOption) {
//     console.log("name=", packageJson.name);
// } else {
//     console.log('オプションがありません.');
// }
if (argv.file) {
    console.log(argv.file);
} else if (argv.name) {
    console.log("name=", packageJson.name);
} else {
    console.log('オプションがありません.');
}

