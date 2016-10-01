
module.exports = function Rest(Queue, Log, Utils, Config) {
  
  Log.info('Initializing ' + this.constructor.name);

  var express = require('express')
  var http = require('http');

  var app = express()

  app.use(express.json());

  app.use(function(req, res, next){
    if (req.is('text/*')) {
      req.text = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk){ req.text += chunk });
      req.on('end', next);
    } else {
      next();
    }
  }); 

  app.set('port', process.env.PORT || 3000);

  var port = app.get('port');
  var server;

  app.use(express.static('app'));

  app.get('/rest/maximise', function (req, res) {
    console.log('REST');
    res.send('Maximise Client Application Window')
  });

  // news data is always text/html
  app.post('/rest/news', function (req, res) {
    res.send('News received');
  });

  // news data is always application/json
  app.post('/rest/new', function (req, res) {
    var response = Queue.add(req.body) 
    res.send(response);
  });

  app.get('/rest/reload', function (req, res) {
    console.log('Reloading port: ' + port);
    res.send('reloading..');
    server._connections = 0;
    server.close();
    server.listen(port);
    console.log('Reloading finished: ' + port);
  });

  // ========================================================================
  server = http.createServer(app);
  var portRetry = false;

  server
  .listen(port, function () {
    Log.info('HTTP listening:' + port);
  })
  
  .on('error', function (err) {
    if (err.code === 'EADDRINUSE') {
      // This will make sure the first port number is re-tried
      if (portRetry) {
        port++;
      }
      console.log('Address in use, retrying on port ' + port);
      setTimeout(function () {
        server.listen(port);
      }, 250);
    }
    portRetry = true;
  });

}

