// var db = require('../config');
var crypto = require('crypto');
var Link = require('../config').Link;
var help = require('../../lib/utility.js');


// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });
//
// module.exports = Link;

linkMethods = {};

linkMethods.create = function(url, baseUrl, callback) {
  Link.findOne({ url: url }, function(err, link) {
    if (err) {
      console.error(err);
    } else if (link) {
      console.log('found LINK', link);
      callback(null, link);
    } else {
      help.getUrlTitle(url, function(err, title) {
        if (err) {
          callback(err);
        } else {
          var shasum = crypto.createHash('sha1');
          shasum.update(url);
          new Link({
            url: url,
            title: title,
            baseurl: baseUrl,
            code: shasum.digest('hex').slice(0, 5)
          }).save(function(err, newUrl) {
            if (err) {
              callback(err);
            } else {
              callback(null, newUrl);
            }
          });
        }
      });
    }
  });



  //crypto
  help.getUrlTitle(url, function(err, title) {
    if (err) {
      callback(err);
    } else {
      var shasum = crypto.createHash('sha1');
      shasum.update(url);
      new Link({
        url: url,
        title: title,
        baseurl: baseUrl,
        code: shasum.digest('hex').slice(0, 5)
      }).save(function(err, newUrl) {
        if (err) {
          callback(err);
        } else {
          callback(null, newUrl);
        }
      });
    }
  });
};

linkMethods.findAll = function(callback) {
  // 검색 GET
  Link.find({}, function(err, result) {
    callback(err, result);
  });
};

linkMethods.navUrl = function(code, callback) {
  console.log('CODE', code);
  // 검색 GET
  Link.findOne({ code: code }, function(err, result) {
    console.log('RESULT1', result);
    if (err) {
      callback(err);
    } else if (!result) {
      callback(null, null);
    } else {
      Link.update({ code: code }, {
        visits: result.visits + 1
      }, {}, function() {
        callback(null, result);
      });
    }
  });
};

module.exports = linkMethods;
