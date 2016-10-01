
module.exports = function Utils(Log) {
  
  var mkdirp = require('mkdirp');
  var Service = {};

  Service.createPath = function (path) {
    var r =  mkdirp.sync(path);
    Log.info('Create folder ',r);
    return r;
  }

  return Service;

}
