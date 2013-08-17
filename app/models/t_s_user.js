var Base = require('./base');

module.exports = Base.extend({
  url: '/api/v2/users/:id',
  idAttribute: 'id',
  api: 'testservice',
  jsonKey: 'user'
});
module.exports.id = 'TSUser';
