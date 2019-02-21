//-----------------------------------------------------------------------------
// Importing Required modules
//-----------------------------------------------------------------------------

// Loading MQTT module 
var mqtt = require('mqtt');
// Connecting to MQTT broker server - mosquitto
var client = mqtt.connect('mqtt://infiniteattempts.summerstudio.xyz');

// Loading assert module - Error Checking
const assert = require('assert');

// Loading moment module - To get time stamp
var moment = require('moment');

// Loading MongodB Client module
var MongoClient = require('mongodb').MongoClient;
// MongoDB database name 
const dbName = 'Canary';
// MongoDB connection url 
var MongoDB_url = "mongodb://bananas_and_dingoes.summerstudio.xyz:27017";


//-----------------------------------------------------------------------------
// Connecting to the Database and selecting topic/data
//-----------------------------------------------------------------------------

// Use connect method to connect to the server 
MongoClient.connect(MongoDB_url, {useNewUrlParser: true}, function(error, initialisedDatabase) {
	// Error check 
	assert.equal(null, error);

	// Report success to console 
	console.log("Connected successfully to server");

	// Trunkading function
	const db = initialisedDatabase.db(dbName);

	// Get the documents collection
	const Chair_Mon_Collection  = db.collection('Chair_Monitor'); 	// Bradens Collection 
	const TheBat_Collection     = db.collection('TheBat');        	// Joes Collection
	const Asset_Man_Collection  = db.collection('Asset_Manager');	// Wills Collection
	const Ibis_collection    	= db.collection('Ibis');			// Rachels Collection

	// When message recieved via topic, excute function
	client.on('message', function (topic, message) {
		// Message received over Canary subscription
		var Cdata = Buffer.from(message);
		// Convert message to string
		var CdataString = Cdata.toString();
		
		// Count how many parameters there are
		var parameterCount = CdataString.split(",").length;
		// Split the parameters into their own strings
		var parameters = CdataString.split(",");
	
		// Selection from various topic
		switch(topic) {
			case ('Canary/ChairMon'):
				buildPacket(parameterCount, parameters, Chair_Mon_Collection);
				break;
			case ("Canary/TheBat"):
				buildPacket(parameterCount, parameters, TheBat_Collection);
				break;
			case ("Canary/AssetMon"):
				buildPacket(parameterCount, parameters, Asset_Man_Collection);
				break;
			case ("Canary/Ibis"):
				buildPacket(parameterCount, parameters, Ibis_collection);
				break;
		}
	});
});

//-----------------------------------------------------------------------------
// Connecting to Topic
//-----------------------------------------------------------------------------

// When connected subscribe to desired topic. Currently to Canary/+
client.on('connect', function () {
	client.subscribe('Canary/+', function (error) {	
	
		if (!error)
		console.log("Subscribed to Canary/+ Topic ");
	else
		console.log("Cannot subscribe, server won't allow");

	});
});

//-----------------------------------------------------------------------------
//  Building the packets
//-----------------------------------------------------------------------------

// Function for building the packet. 
function buildPacket(parameterCount, parameters, collection) {
	
	// Get time in Linux format
	var time = moment();
	// Convert time to desired format
	var time_format = time.format('DD-MM-YY HH:mm:ss Z');

	// Create an object for the packets to be added to.
	var packetObj = {
		Date: time_format,
		DeviceID: parameters[0]
	};

	// Renaming type code for easier splitting
	var Types = parameters[1];
	// Splitting the type code
	var dataTypes = Types.split(".");

	// Running through all type codes to put values in packetObj
	for (var i = 2; i < parameterCount ; i++) {
		// Switching between the type codes
		switch(dataTypes[i-2]) {
			case ("Bu"):
				packetObj["Button"] = parameters[i]; // Maybe change this to an additional function...
				break;
			case ("Di"):
				packetObj["Distance"] = parameters[i];
				break;
			case ("Hu"):
				packetObj["Humidity"] = parameters[i];
				break;
			case ("Li"):
				packetObj["Light"] = parameters[i];
				break;
			case ("Lo"):
				packetObj["Load"] = parameters[i];
				break;
			case ("Qu"):
				packetObj["Quantity"] = parameters[i];
				break;
			case ("So"):
				packetObj["Sound"] = parameters[i];
				break;
			case ("Te"):
				packetObj["Temperature"] = parameters[i];
				break;
		};
	};
	// Inserting the data into the selected collection within the database
	collection.insertOne(packetObj);

};