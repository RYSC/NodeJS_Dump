var querystring = require("querystring");
var mongoUtil = require("./mongoUtil");

//---------------------------------------------------------------------
//                         TUTORIAL FUNCTIONS
//---------------------------------------------------------------------
function start(response, postData) {
    console.log("request handler 'start' was called.");
    
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        'Welcome to the server start page' +
        '</body>'+
        '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
    
}

//---------------------------------------------------------------------
//                         ADD TO OBJECT
//       Desc: Adds data pair to object
//---------------------------------------------------------------------
function addToObject(object, pairName, value, isNum){
    // Only add value to object if the value is not empty
    if (value !== null && value !== ''){
        if (isNum)
            object[pairName] = Number(value);  //Change string to number for applicable fields
        else
            object[pairName] = value
    }
}

//---------------------------------------------------------------------
//                         UPDATE BIN INFO
//       Desc: Shows form on server, takes bin information
//---------------------------------------------------------------------
function updateBinInfo(response, postData) {
    console.log("request handler 'updateConfig' was called.");
    
    // Construct an html form
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/uploadToDB" method="post">'+
        'DeviceID:<br>'+                                    
        '<input type="text" name="inpDeviceID"><br>'+           // DeviceID Input
        'Bin Depth:<br>'+                                   
        '<input type="number" name="inpBinDepth"><br>'+         // Bin Depth Input
        'Temperature Limit:<br>'+
        '<input type="number" name="inpTeLimit"><br>'+          // Temp Limit Input
        'Bin Level Limit:<br>'+
        '<input type="number" name="inpLeLimit"><br><br>'+      // Bin Level Input
        '<input type="submit" value="Submit Info" />'+
        '</form>'+
        '</body>'+
        '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
    
}

//---------------------------------------------------------------------
//                         UPLOAD TO DB
//       Desc: Takes bin info and uploads to MongoDB
//---------------------------------------------------------------------

function uploadToDB(response, postData) {
    console.log("Request handler 'uploadToDB' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("You've sent: " + postData);

    // Construct an object out of the inputs to the html form
    var formObject = new Object();
    addToObject(formObject, "DeviceID", querystring.parse(postData).inpDeviceID, false);
    addToObject(formObject, "BinDepth", querystring.parse(postData).inpBinDepth, true);
    addToObject(formObject, "TempLim", querystring.parse(postData).inpTeLimit, true);
    addToObject(formObject, "LevLim", querystring.parse(postData).inpLeLimit, true);

    // Update BinConfig collection in mongoDB Database
    mongoUtil.connectToServer( function(err) {
        mongoUtil.updateBinLimDocument(formObject);   // Update/insert Bin info from form
    })

    response.end();
}

exports.start = start;
exports.updateBinInfo = updateBinInfo;
exports.uploadToDB = uploadToDB;
