var fs = require('fs');

function handleFile(err, data) {
    if (err) throw err
    binInfo = JSON.parse(data);
}

var obj = JSON.parse(fs.readFileSync('BinLimits.json','utf8'));

console.log(obj[1]);

console.log(obj[1].DeviceID);

var devID = "6e63c7";

function getObject(array, deviceID) {

    for(var x in obj){
        if(array[x].DeviceID == deviceID) 
            console.log("FOund match!");
            return obj[x];
    }
}

testBin = getObject(obj,devID);

console.log("This is test bin: " + testBin.DeviceID);
