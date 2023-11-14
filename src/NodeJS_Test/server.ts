
// ES Modules
import createHttpError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from 'url';

// CommonJS
const redis = require("./lib/redis");
const usersHandler = require("./handlers/users");


// ES Modules 環境下でも__filename, __dirnameを使用する方法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  .on('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  

  app.get('/user/:id', async (req, res) => {
    try {
      const user: string = await usersHandler.getUser(req);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).send('internal error');
    }
  });

  

  app.get('/users', async (req, res) => {
    try {
      const locals: {} = await usersHandler.getUsers(req);
      // HTML作成 (SSR)
      res.render(path.join(__dirname, '..', 'views', 'users.ejs'), locals);
    } catch (err) {
      console.error(err);
    }
  });

  





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render(path.join(__dirname, "..", "views", "error.ejs"));
});

module.exports = app;
