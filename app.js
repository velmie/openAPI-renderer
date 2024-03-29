const express = require('express');
const logger = require('morgan');
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const basicAuth = require('express-basic-auth');
require('dotenv').config();

const indexRouter = require('./routes/index');
const docsRouter = require('./routes/docs');

const {
  AUTH_USER, AUTH_PASS,
} = process.env;

const app = express();

// /health-check shout definition should be above `basicAuth`
app.get('/health-check', (req, res) => res.status(200).send(''));

if (AUTH_USER && AUTH_PASS) {
  app.use(basicAuth({
    users: {
      [AUTH_USER]: AUTH_PASS,
    }, challenge: true,
  }));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/docs', docsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
