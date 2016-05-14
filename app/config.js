var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });
// var db = require('bookshelf')(knex);
//
// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });
//
// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  // 성공!!
});

var Schema = mongoose.Schema;
var userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: { type: Date, default: Date.now }
});

var linkSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  baseurl: String,
  code: String,
  title: String,
  visits: { type: Number, default:0},
  date: { type: Date, default: Date.now }
});


userModel = mongoose.model('User', userSchema);
linkModel = mongoose.model('Link', linkSchema);
module.exports.User = userModel;
module.exports.Link = linkModel;

// var newUser = new userModel({
//   username: 'hyeonsoo',
//   password: '12345678'
// });
// newUser.save();

// module.exports = db;
