var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session    = require('express-session');
var socket = require('socket.io');

var Controllers = require('./controllers');

var app = express();

var port = process.env.PORT || 3000;


/**
 * 模拟数据库
 */
var messages = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'theone.io',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000 *60
  }
}));

app.get('/api/validate', function (req, res) {
  var _userId = req.session._userId;
  console.log('session id:'+_userId);

  if(_userId) {
    Controllers.User.findUserById(_userId, function (err, user) {
      if(err) {
        res.status(401);
        res.json({msg: err})
      }else {
        res.json(user)
      }
      res.end();
    })
  } else {
    res.status(401);
    res.end();
  }

});

app.post('/api/login', function (req, res) {
  var email = req.body.email;
  if(email) {
    Controllers.User.findByEmailOrCreate( email, function (err, user) {
      if(err) {
        res.status(500);
        res.json({msg: err});
      } else {
        req.session._userId = user._id;
        res.json(user);
      }
      res.end();
    })
  } else {
    res.status(403)
    res.end();
  }
});

app.get('/api/logout', function (req, res) {
  req.session._userId = null;
  res.status(401);
  res.end();
});



app.use(express.static(path.join(__dirname, '/static')));
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, './static/index.html'));
});


var server = app.listen(port , function () {
  console.log('technode is on port '+ port + '!');
});


var io = socket.listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('getAllMessages', function () {
    socket.emit('allMessages', messages);
  });

  socket.on('createMessage', function (message) {
    messages.push(message);
    io.sockets.emit('messageAdded', message);
  });

});
