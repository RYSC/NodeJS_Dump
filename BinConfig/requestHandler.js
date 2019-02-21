var querystring = require("querystring");
//var express = require('express');
//var bodyParser = require('body-parser');

var mongoUtil = require("./mongoUtil");


function start(response, postData) {
    console.log("request handler 'start' was called.");
    
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" method="post">'+
        '<textarea name="text" rows="20" cols="60"></textarea>'+
        '<input type="submit" value="Submit text" />'+
        '</form>'+
        '</body>'+
        '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
    
}

function upload(response, postData) {
    console.log("Request handler 'upload' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("You've sent: " + 
    querystring.parse(postData).text);
    response.end();
}

function test(response, postData){
    console.log("Request handler 'test' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Testing Testing");
    response.end();
}

function updateConfig(response, postData) {
    console.log("request handler 'updateConfig' was called.");
    
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/receive" method="post">'+
        'DeviceID:<br>'+
        '<input type="text" name="inpDeviceID"><br>'+
        'Bin Depth:<br>'+
        '<input type="number" name="inpBinDepth"><br>'+
        'Temperature Limit:<br>'+
        '<input type="number" name="inpTeLimit"><br>'+
        'Bin Level Limit:<br>'+
        '<input type="number" name="inpLeLimit"><br><br>'+
        '<input type="submit" value="Submit Info" />'+
        '</form>'+
        '</body>'+
        '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
    
}

function addToObject(object, pairName, value, isNum){
    if (value !== null && value !== ''){
        if (isNum)
            object[pairName] = Number(value);
        else
        object[pairName] = value
    }
}

function receive(response, postData) {
    console.log("Request handler 'receive' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("You've sent: " + postData);

    //Making an object from the form (probably not the best way to do this)
    // var formObject = {
    //     DeviceID: querystring.parse(postData).inpDeviceID,
    //     BinDepth: querystring.parse(postData).inpBinDepth,
    //     TempLim: querystring.parse(postData).inpTeLimit,
    //     LevLim: querystring.parse(postData).inpLeLimit
    // }

    var formObject = new Object();
    addToObject(formObject, "DeviceID", querystring.parse(postData).inpDeviceID, false);
    addToObject(formObject, "BinDepth", querystring.parse(postData).inpBinDepth, true);
    addToObject(formObject, "TempLim", querystring.parse(postData).inpTeLimit, true);
    addToObject(formObject, "LevLim", querystring.parse(postData).inpLeLimit, true);

    console.log("This is the form object: " + JSON.stringify(formObject));
    // Connect to the Mongo database
    mongoUtil.connectToServer( function(err) {
        
        // Attempt to insert the object to the database
        mongoUtil.updateDocument(formObject);
    })

    response.end();
}

exports.start = start;
exports.upload = upload;
exports.test = test;
exports.updateConfig = updateConfig;
exports.receive = receive;
//Test2