# Book_Node
# Tutorial of Node.js with TypeScript

## 参考
+ 公式 https://gihyo.jp/book/2023/978-4-297-12956-9
+ サポートページ https://gihyo.jp/book/2023/978-4-297-12956-9/support

## 目次

### 1　はじめてのNode.js
+ 1.1　Node.jsの言語としての特徴
+ 1.2　フロントエンド／バックエンドの両方に必要となったNode.js
+ Column　TypeScript
+ Column　Node.jsとブラウザで動作するJavaScriptの違い

### 2　JavaScript/Node.jsの文法
+ 2.1　開発環境の導入
+ Column　Node.jsの導入方法
+ 2.2　JavaScript基礎
+ Column　ObjectとJSON
+ 2.3　JavaScriptと継承
+ Column　classとどう向き合うべきか
+ 2.4　JavaScriptとthis
+ 2.5　ES2015以降の重要文法
+ Column　Strictモード

### 3　Node.jsとモジュール
+ 3.1　CommonJS modules
+ Column　requireと分割代入
+ 3.2　ECMAScript modules
+ 3.3　モジュールの使い分け
+ 3.4　標準モジュール（Core API）
+ Column　モジュール内の特殊な変数
+ 3.5　npmと外部モジュールの読み込み
+ Column　yarnやpnpmとNode.js

### 4　Node.jsにおける非同期処理（フロー制御）
+ 4.1　同期処理と非同期処理
+ 4.2　Callback
+ 4.3　Promise
+ 4.4　async/await
+ Column　Promiseと並行実行
+ 4.5　ストリーム処理
+ 4.6　AsyncIterator
+ 4.7　エラーハンドリングのまとめ
+ 4.8　Top-Level Await
+ Column　Node.jsとio.js
+ Column　async.jsを利用したフロー制御

### 5　CLIツールの開発
+ 5.1　Node.jsの開発フロー
+ 5.2　引数の処理
+ 5.3　ライブラリ導入とCLIへの落とし込み
+ Column　process.cwd()
+ Column　shebang
+ 5.4　Node.jsのLint
+ 5.5　Node.jsのテスト

### 6　ExpressによるREST APIサーバー／Webサーバー
+ 6.1　Expressの基礎と導入
+ 6.2　Expressの必須機能
+ 6.3　包括的エラーハンドリング
+ 6.4　データベース連携
+ Column　EventEmitter内のエラーハンドリング
+ 6.5　ビューテンプレート
+ 6.6　静的ファイル配信
+ Column　script async/defer
+ 6.7　ルーティングとファイル分割の考え方
+ 6.8　ファイル分割の実践
+ 6.9　ハンドラーのテスト
+ 6.10　AsyncIteratorのテスト
+ 6.11　失敗時のテスト
+ 6.12　ハンドラー単位の分割とテストしやすさ
+ 6.13　Node.jsアプリケーションのデプロイ
+ 6.14　Node.jsとDocker
+ 6.15　Clusterによるパフォーマンス向上
+ Column　Node.jsとデータベース

### 7　フロントエンド／バックエンドの開発
+ 7.1　フロントエンドとバックエンドをまとめて開発する
+ 7.2　モノレポ（Monorepo）
+ 7.3　アプリケーションの構成
+ 7.4　フロントエンド開発の考え方
+ 7.5　Reactの基本機能
+ 7.6　ブラウザイベントの処理
+ Column　Reactにおけるイベントとハンドラーの紐づけ
+ 7.7　コンポーネントの分割
+ Column　コンポーネントとフレームワーク
+ 7.8　API から取得した値を表示する
+ Column　ホットリロード
+ Column　XMLHttpRequestからfetchへ
+ Column　ProxyサーバーでAPIを集約する
+ 7.9　APIをコールして値を更新する
+ 7.10　Client Side Routing（クライアントサイドのルーティング）
+ 7.11　フロントエンドアプリケーションのデプロイ
+ Column　nginxでProxyサーバーを建てる場合
+ Column　ReactのSSR
+ Column　Next.js
+ 7.12　フロントエンドのテスト
+ Column　テストとmock
+ Column　E2Eテスト
+ Column　フレームワークの利用
+ Column　Access-Control-Allow-Originヘッダーを付与する（CORS）
+ Column　Node.js とモジュールの選び方
+ Column　フロントエンドとバックエンドのJavaScriptの違い
+ Column　ブラウザー操作自動化―Puppeteer

### 8　アプリケーションの運用と改善
+ 8.1　パッケージのバージョンアップ
+ 8.2　モノレポで共通のライブラリを管理する
+ 8.3　アプリケーションの実運用における注意点
+ 8.4　パフォーマンス計測とチューニング
+ Column　SIGUSR2を使う理由