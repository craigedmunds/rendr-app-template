var _ = require('underscore');

module.exports = {
  testservice: function(params, callback) {
    console.log("auth testservice");
    callback();
  },
  testserviceCallback: function(params, callback) {
    console.log("auth testserviceCallback");
    callback();
  }
};
