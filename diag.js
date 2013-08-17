var util = require('util');
var dotenv = require('dotenv')();

//Add .env variables
dotenv.load();

// var home = require('./app/controllers/home_controller.js');
// console.log('home : ' + util.inspect(home));


var auth = require('./server/app/controllers/auth_controller.js');
console.log('auth : ' + util.inspect(auth));

// var actions = require('./server/app/helpers/passport/actions.js');
// console.log('actions : ' + util.inspect(actions));