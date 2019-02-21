var server = require("./server");
var router = require("./router");
var requestHandler = require("./requestHandler");

var request = require('request');

var handle = {};
handle["/"] = requestHandler.start;
handle["/start"] = requestHandler.start;
handle["/updateBinInfo"] = requestHandler.updateBinInfo;
handle["/uploadToDB"] = requestHandler.uploadToDB;

server.start(router.route, handle);


