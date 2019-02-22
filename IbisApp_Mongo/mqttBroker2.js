//-----------------------------------------------------------------------------
// Importing Required modules
//-----------------------------------------------------------------------------

// Loading MQTT module 
const mqtt = require('mqtt');
// Connecting to MQTT broker server - mosquitto
var client = mqtt.connect('mqtt://infiniteattempts.summerstudio.xyz');
var fs = require('fs');

// MongoUtil module for connecting to Bin Config database
var mongoUtil = require("./mongoUtil");


// Read BinInfo from JSON file
//var binInfoArray = JSON.parse(fs.readFileSync('BinLimits.json','utf8'));


//-----------------------------------------------------------------------------
//    Function to find bin from JSON object
//-----------------------------------------------------------------------------

function getObject(array, binID) {

    for(var x in array){
        if(array[x].DeviceID == binID) 
            return array[x];
    }
}

//-----------------------------------------------------------------------------
// Connect to Topic
//-----------------------------------------------------------------------------

client.on('connect', function () {
	client.subscribe('Canary/Ibis', function (error) {	
	
		if (!error)
		console.log("Subscribed to Canary/Ibis Topic ");
	else
		console.log("Cannot subscribe, server won't allow");

	});
});

//-----------------------------------------------------------------------------
// When receive message from topic
//-----------------------------------------------------------------------------
client.on('message', function(topic, message){
    //console.log("The message is:" + message);
    messageString = message.toString();

    // Count how many parameters there are
    var parameterCount = messageString.split(",").length;
    
    // Split the parameters into their own strings
    var parameters = messageString.split(",");
    
    var datetime = new Date();

    var binInfo;

    // Create an object for the packets to be added to.
	var binPacket = {
		Date: datetime,
		DeviceID: parameters[0]
    };
    
    // Variable for message parameters
    var selection = parameters[1].split(".");

    // Fill packet object
    for (var i = 2; i < parameterCount ; i++) {
        switch(selection[i-2]){
            case ("Di"):
                binPacket["Distance"] = parameters[i];
                break;

            case ("Hu"):
				binPacket["Humidity"] = Number(parameters[i])
                break;
                
            case ("Te"):
				binPacket["Temperature"] = parameters[i];
				break;
        }
    }

    // Get bin limits from BinConfigDB and show alarms accordingly
    mongoUtil.getBinDocument(binPacket.DeviceID, function(binDoc){
        binInfo = binDoc;

        if (binPacket.Distance < binInfo.BinDepth){
            binPacket["BinLevel"] = (1 - binPacket.Distance / binInfo.BinDepth)*100;
        }
        else {
            binPacket["BinLevel"] = 0;
        }
    
        //Update Bin status
        binPacket["FireAlarm"] = binPacket.Temperature >= binInfo.TempLim;
        binPacket["FullAlarm"] = binPacket.BinLevel >= binInfo.LevLim;
    
        console.log("BinLevel is: " + binPacket.BinLevel.toFixed(2) + "%");
    
        if (binPacket.FullAlarm){
            console.log("[!] ALARM: BIN IS AT CAPACITY [!]");
        }
    
        if (binPacket.FireAlarm){
            console.log("[!] ALARM: BIN IS ON FIRE [!]");
        }
    });

});
