var db = require('../models/index');
var async = require('async');
var gravatar = require('gravatar');

exports.findUserById = function (_userId, cb) {
  db
    .User
    .findOne({
      id: _userId
    }, cb);
};

exports.findByEmailOrCreate = function (email, cb) {
  db
    .User
    .findOne({
      email:email
    }, function( err, user){
      if(user) {
        cb(null, user);
      } else {
        var user = new db.User;
        user.name = email.split('@')[0];
        user.email = email;
        user.avatarUrl = gravatar.url(email);
        user.save(cb)
      }
    });
}
