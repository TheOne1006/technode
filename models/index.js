var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root@ds023088.mlab.com:23088/shizhan_blo');

exports.User = mongoose.model('User', require('./user'));
