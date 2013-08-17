module.exports = function(match) {
  match('auth/logout',           'auth#logout');
  match('auth/testservice',           'auth#testservice');
  match('auth/testservice/callback',  'auth#testserviceCallback');
};
