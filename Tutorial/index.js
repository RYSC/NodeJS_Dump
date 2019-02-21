var server = require("./server_e");
var router = require("./router");
var requestHandler = require("./requestHandler");

var request = require('request');

var handle = {};
handle["/"] = requestHandler.start;
handle["/start"] = requestHandler.start;
handle["/upload"] = requestHandler.upload;
handle["/test"] = requestHandler.test;

server.start(router.route, handle);

