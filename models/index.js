var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://root:root@ds029630.mlab.com:29630/protheone');

var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + 'mongodb');
});


exports.User = mongoose.model('User', require('./user'));
