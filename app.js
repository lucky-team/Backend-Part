var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
var config = require('./config');
// security delopy
var compression = require('compression');
var helmet = require('helmet');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var insuranceRouter = require('./routes/insuranceRouter');
var claimRouter = require('./routes/claimRouter');
var resRouter = require('./routes/resourcesRouter');
var profileRouter = require('./routes/profileRouter');
var messageRouter = require('./routes/messageRouter');

var mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
connect.then((db) => {
  console.log('Conntected correctly to MongoDB server');
}, (err) => { console.log(err); });

var app = express();
app.set('env', 'deployment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(compression());
app.use(helmet());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messageRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/insurances', insuranceRouter);
app.use('/claims', claimRouter);
app.use('/res', resRouter);
app.use('/profiles', profileRouter);

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
