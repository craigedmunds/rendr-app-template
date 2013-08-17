var _ = require('underscore');

module.exports = {
  index: function(params, callback) {
    console.log("tsusers index");
    var spec = {
      collection: {collection: 'TSUsers', params: params}
    };
    this.app.fetch(spec, function(err, result) {
      callback(err, result);
    });
  },

  show: function(params, callback) {
    var spec = {
      model: {model: 'TSUser', params: params}
    };
    this.app.fetch(spec, function(err, result) {
      callback(err, result);
    });
  }
};
