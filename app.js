var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var http = require('http');
var url = require('url');

var app = express();

//引入webSocket模块
var WebSocket = require('ws');

//引入handlebars模板引擎
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    extname: '.html'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//设置handlebars模板引擎
app.engine("html",handlebars.engine);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


var server = http.createServer(app);
var wss = new WebSocket.Server({ server });


wss.on('connection', function connection(ws) {
    console.log('建立连接成功。。。');
    //console.log(ws);
    var location = url.parse(ws.upgradeReq.url, true);
   // console.log(location);
    // You might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function (message) {
        console.log('发送消息...');
        console.log(message);
        this.send(message);
    });


});

server.listen(8000, function listening() {
    console.log('Listening on %d', server.address().port);
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
