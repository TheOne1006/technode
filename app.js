var express = require('express');
var path = require('path');

var socket = require('socket.io');

var app = express();

var port = process.env.PORT || 3000;


/**
 * 模拟数据库
 */
var messages = [];




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
