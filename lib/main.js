
var Log = require('./Log');
var Utils = require('./Utils');
var Config = require('./Config');
var Rest = require('./Rest');
var Queue = require('./Queue');
var Fabric = require('./Fabric');

var log = new Log();
var utils = new Utils(log);
var config = new Config();
var fabric = new Fabric(log, utils, config);
var queue = new Queue(fabric, log, utils, config);
var rest = new Rest(queue, log, utils, config);


