// var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var User = require('../config').User;


userMethods = {};

userMethods.createUser = function(username, password, callback) {
  //bcrypt
  User.findOne({ username: username }, function(err, result) {
    if (err) {
      callback(err);
    } else if (!result) {
      var hash = bcrypt.hashSync(password);
      new User({
        username: username,
        password: hash,
      }).save(function(err, newUser) {
        if (err) {
          callback(err);
        } else {
          callback(null, newUser);
        }
      });
    } else {
      callback(null, false);
    }
  });
};

userMethods.comparePassword = function(username, password, callback) {
  User.findOne({ username: username }, function(err, result) {
    if (err) {
      callback(err);
    }
    if (!result) {
      callback(null, false);
    } else {
      // console.log(result);
      bcrypt.compare(password, result.password, function(err, isMatch) {
        callback(null, isMatch, result);
      });
    }
  });
};

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });
//
module.exports = userMethods;
