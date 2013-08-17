var util = require('util');

module.exports = {
  testservice: {
    name: 'Test Service'
  , keyField: 'id'
  , parseProfile: function (profile) {
      var userData = {
        //TODO : Implement an API to retrieve personal info
        // in API app
        givenName: "Craig Edmunds"
      };
      return userData;
    }
  }
};

