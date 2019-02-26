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
mongoUtil.connectToServer(function(err){
    if (err) {
        return console.dir(err);
    }
  
    client.on('message', function(topic, message){
        //console.log("The message is:" + message);
        messageString = message.toString();

        // Count how many parameters there are
        var parameterCount = messageString.split(",").length;
        
        // Split the parameters into their own strings
        var parameters = messageString.split(",");
        
        var datetime = new Date();

        var alarmBinMsg = "";

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
                    binPacket["Distance"] = Number(parameters[i]);
                    break;

                case ("Hu"):
                    binPacket["Humidity"] = Number(parameters[i])
                    break;
                    
                case ("Te"):
                    binPacket["Temperature"] = Number(parameters[i]);
                    break;
            }
        }

        //------------------------------------------------------------------
        //                      ORIG CODE: FOR RC BIN MONITOR
        //------------------------------------------------------------------

        // Get bin limits from BinConfigDB and show alarms accordingly
        mongoUtil.getBinLimDocument(binPacket.DeviceID, function(binInfo){

            // Calculate bin fill level (from sensor distance and bin depth)
            if (binPacket.Distance < binInfo.BinDepth){
                binPacket["BinLevel"] = (1 - binPacket.Distance / binInfo.BinDepth)*100;
            }
            else {
                binPacket["BinLevel"] = 0;
            }
        
            //Update Bin status
            binPacket["FireAlarm"] = binPacket.Temperature >= binInfo.TempLim;  //True if sensor temp is greater than defined limit
            binPacket["FullAlarm"] = binPacket.BinLevel >= binInfo.LevLim;      // True if bin level is greater than defined limit
                
            // Send bin level to console
            console.log("BinLevel is: " + binPacket.BinLevel.toFixed(2) + "%");
            
            // Alarm actions: Full bin
            if (binPacket.FullAlarm){
                console.log("[!] ALARM: BIN IS AT CAPACITY [!]");
                alarmBinMsg += "[!] BIN IS FULL [!]";
            }
        
            // Alarm actions: Fire
            if (binPacket.FireAlarm){
                console.log("[!] ALARM: BIN IS ON FIRE [!]");
                alarmBinMsg += "[!] FIRE ALERT [!]";
            }

            // Publish bin alarms to ibis alarm topic
            client.publish('Canary/Ibis/Alarm', "Bin Level: " + binPacket.BinLevel.toFixed(2) + "% "+ alarmBinMsg);

            // Send alarm data to bin alarm collection
            mongoUtil.insertAlarmData(binPacket);

        });

    });

});