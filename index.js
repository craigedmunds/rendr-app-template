var express = require('express'),
    rendr = require('rendr'),
    util = require('util'),
    env = require('./server/lib/env'),
    mw = require('./server/middleware'),
    DataAdapter = require('./server/lib/data_adapter'),
    app,
    server,
    dotenv = require('dotenv')(),
    RedisStore = require('connect-redis')(express);


app = express();

/**
 * Initialize Express middleware stack.
 */
function initMiddleware() {

  var redis = require("redis").createClient();;

  app.use(express.compress());
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.cookieParser('1234567890QWERTY'));
  app.use(express.session({
      secret: "kqsdjfmlksdhfhzirzeoibrzecrbzuzefcuercazeafxzeokwdfzeijfxcerig",
      store: new RedisStore({ host: 'localhost', port: 3000, client: redis })
  }));
  
  /**
   * Rendr routes are attached with `app.get()`, which adds them to the
   * `app.router` middleware.
   */
  app.use(app.router);

  /**
   * Error handler goes last.
   */
  app.use(mw.errorHandler());
}

/**
 * Initialize our Rendr server.
 *
 * We can pass inject various modules and options here to override
 * default behavior:
 * - dataAdapter
 * - errorHandler
 * - notFoundHandler
 * - appData
 */
function initServer() {

  //Add .env variables
  dotenv.load();
  
  var options = {
    dataAdapter: new DataAdapter(env.current.api),
    errorHandler: mw.errorHandler(),
    appData: env.current.rendrApp,
    paths: {
      routes :
        [rendr.entryPath + '/server/app/routes',
        rendr.entryPath + '/app/routes'],
        //rendr.entryPath + '/server/app/routes',
      controllerDirs :
        [rendr.entryPath + '/server/app/controllers',
        rendr.entryPath + '/app/controllers']
    }
  };
  server = rendr.createServer(app, options);
}

/**
 * Start the Express server.
 */
function start() {
  console.log("Starting with env:")
  console.log(util.inspect(process.env))
  
  var port = process.env.PORT || 3030;
  app.listen(port);
  console.log("server pid %s listening on port %s in %s mode",
    process.pid,
    port,
    app.settings.env);
}

/**
 * Here we actually initialize everything and start the Express server.
 *
 * We have to add the middleware before we initialize the server, otherwise
 * the 404 handler gets too greedy, and intercepts i.e. static assets.
 */
initMiddleware();
initServer();
// Only start server if this script is executed, not if it's require()'d
if (require.main === module) {
  start();
}

exports.app = app;
