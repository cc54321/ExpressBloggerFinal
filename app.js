var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
//load environment variables from .env (.env is the default file)
require("dotenv").config();

//register routes.
//NOTE: notice how there is .js after index, this is because
// we exported the module as index. 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogsRouter = require('./routes/blogs');

//connecting to mongo db 
var { mongoConnect } = require('./mongo.js');
mongoConnect();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//allow cross origin requests (this is for production)
//production code = code that hasn't been released
app.use(cors({ origin: true, credentials: true}))
app.options("*", cors());

//middle ware 
// allows us to modify POST requests
// give us extra info
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//set up logger and cookie parser 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//allows use to load static files from public 
app.use(express.static(path.join(__dirname, 'public')));


//register routes 
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blogs', blogsRouter);

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
  res.render('error');
});

module.exports = app;
