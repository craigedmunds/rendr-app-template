var util = require('util'),
  utile = require('utile');

exports.updateSessionUserInfo = function(session, authType, profile) {
  
  //TODO : Should be extended to store array of auth types, with credentials, to allow 
  // for multiple services keys

  session.authType = authType;
  session.authData = profile.authData;
  session.user = {};

  utile.mixin(session.user, profile.userData);

  console.log("Passport helper updateSessionUserInfo profile : " + util.inspect(profile));

  return session;
}

exports.clearSessionUserInfo = function(session) {
  session.authType = null;
  session.authData = null;
  delete(session.user);
}