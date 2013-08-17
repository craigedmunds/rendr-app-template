var util = require('util');
var Backbone = require('backbone');

ResponseModel = Backbone.Model.extend({
    initialize: function(){
        console.log("ResponseModel initialize");
    }
});

function createResponse(req, attributes) {

	var user = req.session.user;

	var logged_in = (user !== undefined);
	var response = new ResponseModel({ logged_in : logged_in });

	if (logged_in) { 	
		response.set({
      user_name: user.givenName
    });
	}

	response.set(attributes);

	return response;
}

module.exports = {

  index: function(params, callback) {
  	
  	console.log("diag : " + util.inspect(this.app.req.session));

		var response = createResponse(this.app.req);

		console.log("response : " + util.inspect(response));

		callback(null,  { model : response }); //this.app.req.session.user });
  }
};
