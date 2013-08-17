var TSUser = require('../models/t_s_user')
  , Base = require('./base');

module.exports = Base.extend({
  model: TSUser,
  api: 'testservice',
  url: '/api/v2/users',
  jsonKey: 'users'
});
module.exports.id = 'TSUsers';
