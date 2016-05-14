var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

//CHANGED: link.findAll로 리팩토링
exports.fetchLinks = function(req, res) {

  Link.findAll(function(err, result) {
    if (err) {
      console.error(err);
    } else if (!result) {
      res.send(404);
    } else {
      res.send(200, result);
    }
  });
};

//CHANGED: create로 리팩토링
exports.saveLink = function(req, res) {
  var uri = req.body.url;
  var baseUrl = req.headers.origin;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.create(uri, baseUrl, function(err, newUrl) {
    if (err) {
      console.error(err);
    } else {
      res.send(200, newUrl);
    }
  });
};

//CHANGED,: user.compare~ 로 리팩토링
exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;


  User.comparePassword(username, password, function(err, isMatch, user) {
    if (err) {
      return console.error(err);
    }
    if (isMatch) {
      util.createSession(req, res, user);
    } else {
      res.send(404, 'Unvalid login');
      res.redirect('/login');
    }
  });
};

//CHANGED: user.create로 리팩토링
exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;


  User.createUser(username, password, function(err, newUser) {
    if (err) {
      console.error(err);
    } else if (!newUser) {
      console.log('Account already exists');
      res.setHeader('location', '/');
      res.setHeader('status', 302);
      res.end();
    } else {
      util.createSession(req, res, newUser);
    }
  });
};

//TODO: link를 누를 때마다 원본 url을 find해서 그 url로 연결; 메소드 만들기
exports.navToLink = function(req, res) {
console.log('REQ.PARAMS', req.params);
  Link.navUrl(req.params[0], function(err, result) {
    if (err) {
      console.error(err);
    } else if (!result) {
      console.log('RESULT', result);
      res.redirect('/');
    } else {
      res.redirect(result.url);
    }
  });

};
