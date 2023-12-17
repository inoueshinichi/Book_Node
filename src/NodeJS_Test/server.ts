import { wrap } from "module";

// CommonJS Module
const express = require('express');
const { redis, getUser, getUsers } = require("./lib/redis");
const usersHandler = require("./handlers/users");
// const { createHttpError } = require("http-errors");
const logger = require('morgan');

// ES Modules 環境下でも__filename, __dirnameを使用する方法
// const { fileURLToPath } = require('url');
const path = require('path');
// const __filename: string = fileURLToPath(import.meta.url);
// const __dirname: string = path.dirname(__filename);

var app = express();
const SERVER_PORT: number = 3000;

redis.connect()
  .once('ready', async () => {
    try {
      await redis.init();

      app.listen(SERVER_PORT, () => {
        console.log('start listening');
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })
  .on('error', (err: Error) => {
    console.error(err);
    process.exit(1);
  });

/* SSR エンジン */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

// HTTPペイロードのエンコード方式(Content-Type)
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: false })); // application/x-www-form-urlencoded

// htmlファイルの公開フォルダ
app.use(express.static(path.join(__dirname, 'public')));

// // catch 404 and forward to error handler
// app.use((req: Express.Request, res: Express.Response, next: any) => {
//   next(createHttpError(404));
// });

/* エラーハンドリングを共通化するクロージャ */
const wrapAPI = (fn: Function) => {
  return (req: Express.Request, res: Express.Response, next: any) => {
    try {
      fn(req)
        .then((data: any) => res.status(200).json(data))
        .catch((e: Error) => next(e));
    } catch (e) {
      next(e);
    }
  };
};

// 例外スローする関数
const validation = (req: Express.Request) => {
  if (true) {
    throw new BadRequest('仮のエラー', req);
  }
}

const throwErr = (req: Express.Request) => {
  const err: Error = new Error("なにかのエラー");
  err.status = 400;
  throw err;
}

const handler = async (req: Express.Request) => {
  validation(req);
  // throwErr(req);
};

/* エラーに合わせた独自例外クラス */
class BadRequest extends Error {
  constructor(message: string, req: Express.Request) {
    super('Bad Request');
    this.status = 400;
    this.req = req;
    this.message = message;
  }
};

class NotFoundHTML extends Error {
  constructor(message) {
    super('NotFound');
    this.status = 404;
  }
};


// 包括的エラーハンドリング
app.use((err: Error, req: Express.Request, res: Express.Response, next: any) => {

  // if (err.status) {
  //   return res.status(err.status).send(err.message);
  // }

  // render the error page
  // res.status(err.status || 500);
  // res.render(path.join(__dirname, "..", "views", "error.ejs"));

  /* 独自例外によるエラーハンドリング */
  if (err instanceof BadRequest) {
    console.log('[BadRequest]', req);
    res.status(err.status).send(err.message);
    return;
  }

  if (err instanceof NotFoundHTML) {
    console.log('[NotFoundHTML]', req);
    res.status(err.status).send('<html><body>Not Found!</body></html>');
    return;
  }


  res.status(500).send('Internal Server Error');
  console.error('[Internal Server Error]', err);
});


// エラーハンドリングを共通化したAPIの処理
app.get('/api/test', wrapAPI(handler));

app.get('/user/:id', async (req: Express.Request, res: Express.Response) => {
  try {
    const user: string = await usersHandler.getUser(req);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
});

app.get('/users', async (req: Express.Request, res: Express.Response) => {
  try {
    const locals = await usersHandler.getUsers(req);
    // HTML作成 (SSR)
    res.render(path.join(__dirname, '..', 'views', 'users.ejs'), locals);
  } catch (err) {
    console.error(err);
  }
});

module.exports = app;


// モジュール宣言
export { };