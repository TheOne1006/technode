var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session    = require('express-session');
var socket = require('socket.io');

var MongoStore = require('connect-mongo')(session);

var Controllers = require('./controllers');

var app = express();

var sinneCookieParase = cookieParser('theone.io');
var sessionStore = new MongoStore({
  reapInterval: 60000 * 10,
  url : 'mongodb://root:root@ds029630.mlab.com:29630/protheone'
});

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
  },
  store: sessionStore
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
        Controllers.User.online(user._id, function (err, user) {
          if(err) {
            res.status(500);
            res.json({mgs:err});
          } else {
            res.json(user);
          }
          res.end();
        })
      }
    });
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

io.set('authorization', function (handshakeData, accept) {
  sinneCookieParase(handshakeData, {}, function (err) {
    if(err) {
      accept(err, false);
    }else{
      var connectSid =  handshakeData.signedCookies['connect.sid'];
      sessionStore.get(connectSid, function (err, session) {
        if(err) {
          accept(err.message, false);
        } else {
          handshakeData.session = session;
          console.log('handshakeData');
          // console.log(handshakeData.session);
          if(session._userId) {
            accept(null, true);
            console.log('认证成功');
          }else {
            accept('No login');
          }
        }
      })
    }
  });

});

  io.sockets.on('connection', function (_socket) {
    /**
     * 基于_socket 的上线 下线
     */
     console.log('connection');

     console.log(_socket.handshake);

    _socket.on('getAllMessages', function () {
      _socket.emit('allMessages', messages);
    });

    _socket.on('messages.create', function (message) {
      messages.push(message);
      io.sockets.emit('messageAdded', message);
    });

    _socket.on('getRoom', function () {
      Controllers.User.getOnlineUsers(function (err, users) {
        if(err) {
          _socket.emit('err', {msg:err});
        } else {
          _socket.emit('roomData', {
            name:'technode',
            users: users,
            messages: messages
          });
        }
      })
    })

  });















//
