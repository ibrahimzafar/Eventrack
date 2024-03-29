var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var session = require('express-session');

const passport = require('passport');
require('./passport-config')(passport);
//imports our configuration file which holds our verification callbacks and things like the secret for signing.

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

var sess = {
  secret : process.env.SECRET || 'mysecret',
  cookie: {}
};
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({ secret: process.env.SECRET || 'mysecret', cookie: { maxAge: 60000 }}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(passport.initialize());
//initializes the passport configuration.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//custom Middleware for logging the each request going to the API
app.use((req,res,next) => {
      if (req.body) log.info(req.body);
      if (req.params) log.info(req.params);
      if(req.query) log.info(req.query);
      log.info('Received a ${req.method} request from ${req.ip} for ${req.url}');
    next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
