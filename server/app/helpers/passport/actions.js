var util = require('util'),
  utile = require('utile'),
  fs = require('fs'),
  ejs = require('ejs'),
  path = require('path'),
  session = require('./session'),
  strategies = require('./strategies');

var rootConfig = readSecrets();
// console.log("rootConfig : " + util.inspect(rootConfig));

var passport = require('passport')
  , config = rootConfig.passport
  , successRedirect = config.successRedirect
  , failureRedirect = config.failureRedirect
  , bcrypt = require('bcrypt')
  , cryptPass
  , OAuthStrategy = require('passport-oauth').OAuthStrategy;

var SUPPORTED_SERVICES = [
      'testservice'
    ];

function readSecrets() {

  // console.log("Read secrets:");
  // console.log(util.inspect(process.env))

  var secretsFile = path.join(process.cwd(), 'config', 'secrets.json');

  if (fs.existsSync(secretsFile)) {
      secrets = fs.readFileSync(secretsFile).toString();
      // HACK, allow EJS in JSON, get env vars for deploy-from-Git
      secrets = ejs.render(secrets, {});
      try {
        // Parse into obj and mix in to config
        secrets = JSON.parse(secrets);
      }
      catch (e) {
        throw new Error('Could not parse secrets.json file, ' + e.message);
      }
      
      return secrets;
    }
}


function registerService(item, module) {

  //TODO : Make dynamic
  // var protocol = ret.ssl ? 'https' : 'http';
  var hostname = "localhost:3030";
  var fullHostname = "http://" + hostname;
  // if (ret.port != 80) {
  //   fullHostname += ':' + ret.port;
  // }

  //console.log("fullHostname : " + fullHostname);

  var hostname = fullHostname || ''
    , config = {
        callbackURL: hostname + '/auth/' +
            item + '/callback'
      }
    , Strategy = require(module).Strategy
    , handler = function(token, tokenSecret, profile, done) {
        // Pass along auth data so auth'd users can make
        // API calls to the third-party service
        var authData = {
          token: token
        };
        if (tokenSecret) {
          authData.tokenSecret = tokenSecret;
        }
        profile.authData = authData;
        done(null, profile);
      };

  console.log("config : " + config);

  utile.mixin(config, rootConfig.passport[item]);
  
  var strategy = new Strategy(config, handler);

  passport.use(strategy);
}

SUPPORTED_SERVICES.forEach(function (item) {
  registerService(item, 'passport-' + item);
});

var actions = new (function () {
  var self = this;

  var _createInit = function (authType) {

        return function (req, resp, params) {

          console.log("init");

          //console.trace()
          var self = this;
          
          //TODO - this doesn't seem right, but need to investigate why they're coming through
          //to this function empty.
          req = arguments.callee.caller.arguments[0];
          resp = arguments.callee.caller.arguments[1];
          params = arguments.callee.caller.arguments[2]

          //console.log('_createInit inner function diag:' + util.inspect(req.connection.encrypted));
          
          passport.authenticate(authType)(req, resp);
        };
      }

    , _createCallback = function (authType) {
        return function (req, resp, params) {

          console.log("callback");

          var self = this
            , handler = function (err, profile) {
                if (!profile) {
                  self.redirect(failureRedirect);
                }
                else {

                  profile.userData = strategies[authType].parseProfile(profile);
                  
                  self.app.req.session = session.updateSessionUserInfo(self.app.req.session, authType, profile)
                  
                  self.redirectTo(successRedirect);

                  // try {
                    
                  // }
                  // catch (e) {
                  //   console.error("Passport helper actions _createCallback error : " + util.inspect(e));
                  //   self.error(e);
                  // }
                }
              }
            , next = function (e) {
                console.error("Passport helper actions _createCallback next error : " + util.inspect(e));
                if (e) {

                  console.log("Passport helper actions _createCallback next error self : " + util.inspect(self));

                  self.app.error(e);
                }
              };
          req.session = this.app.req.session;
          req.query = this.app.req.query;
          passport.authenticate(authType, handler)(req, resp, next);
        };
      };

  // this.local = function (req, resp, params) {
  //   var self = this
  //     , username = params.username
  //     , password = params.password;

  //   geddy.model.User.first({username: username}, {nocase: ['username']},
  //       function (err, user) {
  //     var crypted;
  //     if (err) {
  //       self.redirect(failureRedirect);
  //     }
  //     if (user) {
  //       if (!cryptPass) {
  //         cryptPass = require('./index').cryptPass;
  //       }

  //       if (bcrypt.compareSync(password, user.password)) {
  //         self.session.set('userId', user.id);
  //         self.session.set('authType', 'local');
  //         // No third-party auth tokens
  //         self.session.set('authData', {});

  //         self.redirect(successRedirect);
  //       }
  //       else {
  //         self.redirect(failureRedirect);
  //       }
  //     }
  //     else {
  //       self.redirect(failureRedirect);
  //     }
  //   });
  // };

  SUPPORTED_SERVICES.forEach(function (item) {
    self[item] = _createInit(item);
    self[item + 'Callback'] = _createCallback(item);
  });

})();

module.exports = actions;
