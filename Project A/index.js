

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://infiniteattempts.summerstudio.xyz');


const assert = require('assert');


var MongoClient = require('mongodb').MongoClient;
/* MongoDB connection url */
var MongoDB_url = "mongodb://bananas_and_dingoes.summerstudio.xyz:27017";
/* MongoDB database name */
const dbName = 'HairyPigs';


/* Use connect method to connect to the server */
MongoClient.connect(MongoDB_url, {useNewUrlParser: true}, function(error, initialisedDatabase) {
  /* Error check */
  assert.equal(null, error);

  /* Report success to console */
  console.log("Connected successfully to server");

  const db = initialisedDatabase.db(dbName);

  // Get the documents collection
  const collection = db.collection('DuckCollection');

  client.on('message', function (topic, message) {
    if (topic == "d1/temperature") {
      console.log("Device 1, Temperature: " + message);
      collection.insertOne({DeviceID: 1, Temperature: Number(message)});
    }

    if (topic == "d2/temperature") {
      console.log("Device 2, Temperature: " + message);
      collection.insertOne({DeviceID: 2, Temperature: Number(message)});
    }

    if (topic == "d1/humidity") {
      console.log("Device 1, Humidity: " + message);
      collection.insertOne({DeviceID: 1, Humidity: Number(message)});
    }
    if (topic == "d2/humidity") {
      console.log("Device 2, Humidity: " + message);
      collection.insertOne({DeviceID: 2, Humidity: Number(message)});
    }
  });
});


client.on('connect', function () {
  client.subscribe('+/+', function (error) {	
    if (!error)
      console.log("Subscribed to server");
    else
  		console.log("Cannot subscribe, server won't allow");

    console.log("\n");
  })
});

 




