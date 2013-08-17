// var _ = require('underscore');

var passport = require('../helpers/passport/index.js')
	, utile = require('utile')
	, util = require('util')
	, ppsession = require('../helpers/passport/session.js');

var controllers = {

  logout: function(params, callback) {
  	
  	console.log("logout");

  	ppsession.clearSessionUserInfo(this.app.req.session);

		this.redirectTo("/");
  }
};

utile.mixin(controllers, passport.actions);

module.exports = controllers;