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
    
    // Construct a page menu
    var menu = '<html>'+
        '<head>'+ 
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<style>' +
        'ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: rgb(186, 193, 207);}' +
        'li {float: left;}' + 
        'li a {display: inline-block;color: white;text-align: center;font-family:Verdana;font-size: 14px;padding: 14px 16px;text-decoration: none;}' +
        'li a:hover {background-color: rgb(165, 178, 202);}' + 
        '.active {background-color: rgb(138, 150, 170);}' +
        '</style>' +
        '<ul>' +
              '<li><a href = "http://149.28.178.221:3000/binStatus" > Bin Status</a></li>' +
              '<li><a href = "http://149.28.178.221:8888/updateBinInfo" class = "active"> Update Bin Configuration</a></li>' +
        '</ul>' + 
        '<br />' +
        '<br />' +
        '</body>'+
        '</html>';
    // Construct an html form
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<style>' +
        '*{ font-family: Verdana; font-size: 13px; }' +
        '</style>' +
        '<div align = "center" >' +
        '<h2 style="color: rgb(91, 97, 110)"> Bin Info Form </h2>' +
        '<form action="/uploadToDB" method="post" style= "text-align: center; padding: 20px; display: inline-block; border: 3px solid rgb(138, 150, 170); border-radius: 3px;  ">'+
        'Device ID:<br>'+                                    
        '<input type="text" name="inpDeviceID"><br>'+           // DeviceID Input
        '<br/>' +
        'Bin Depth:<br>'+                                   
        '<input type="number" name="inpBinDepth"><br>'+         // Bin Depth Input
        '<br/>' +
        'Temperature Limit:<br>'+
        '<input type="number" name="inpTeLimit"><br>'+          // Temp Limit Input
        '<br/>' +
        'Bin Level Limit:<br>'+
        '<input type="number" name="inpLeLimit"><br><br>'+      // Bin Level Input
        '<input type="submit" value="Submit Info" />'+
        '</form>'+
        '</div>' +
        '</body>'+
        '</html>';


    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(menu);
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
