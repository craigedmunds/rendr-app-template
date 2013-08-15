var util = require('util');

module.exports = {
  testservice: {
    name: 'Test Service'
  , keyField: 'id'
  , parseProfile: function (profile) {
      geddy.log.debug('Test Service parseProfile : ' + util.inspect(profile));
      var userData = {
        givenName: "Craig Edmunds"
      };
      return userData;
    }
  }
};

