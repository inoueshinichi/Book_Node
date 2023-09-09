// パッケージファイルを解決するモジュール
import * as path from "node:path";
import * as fs from "node:fs";

const packageStr: string = fs.readFileSync("/Users/inoueshinichi/Desktop/MyGithub/Book_Node/package.json", { encoding: 'utf-8' });
const _package: any = JSON.parse(packageStr);

export const getPackageName = () => {
    return _package.name;
}



