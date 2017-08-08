var models = require('../../index');

var users = require('../seeds/users');
var User = models.User;
var generator = require('../helpers/iterator');

module.exports = generator(users,User,'USER');
