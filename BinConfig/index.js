var server = require("./server");
var router = require("./router");
var requestHandler = require("./requestHandler");

var request = require('request');

var handle = {};
handle["/"] = requestHandler.start;
handle["/start"] = requestHandler.start;
handle["/upload"] = requestHandler.upload;
handle["/test"] = requestHandler.test;
handle["/updateConfig"] = requestHandler.updateConfig;
handle["/receive"] = requestHandler.receive;

server.start(router.route, handle);

//Test2
