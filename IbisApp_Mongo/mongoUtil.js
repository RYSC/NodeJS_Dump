//-----------------------------------------------------------------------------
// Importing Required modules
//-----------------------------------------------------------------------------

// Loading assert module - Error Checking
const assert = require('assert');

// Loading MongodB Client module
var MongoClient = require('mongodb').MongoClient;

// MongoDB database name 
const dbName = 'Canary';
// MongoDB connection url 
var MongoDB_url = "mongodb://bananas_and_dingoes.summerstudio.xyz:27017";

// MongoDB Client Database
var ConnectedDB

// MongoDB Canary Database object
var CanaryDB;


module.exports = {
    
    // Connects to MongoDB server
    connectToServer: function(callback) {
        MongoClient.connect(MongoDB_url, {useNewUrlParser: true}, function(error, initialisedDatabase) {
            ConnectedDB = initialisedDatabase;
            CanaryDB = initialisedDatabase.db(dbName);
            console.log("Connected successfully to server!");
            return callback(error);
        });
    },

    // Returns database (connectToServer must be run first)
    getDb: function() {
        return CanaryDB;
    },

    // Show on serial the Bin info of parsed Bin ID
    serialBinLimInfo: function(formObject) {
        var query = {DeviceID: formObject.DeviceID};
        CanaryDB.collection('BinConfigInfo').find(query).toArray(function(err, result) {
            if (err) throw err;

            console.log(result);
            ConnectedDB.close();
        });
    },
    
    // Gives Bin document for callback function, matching parsed bin ID
    getBinLimDocument: function func1 (pDeviceID, callback) {
        var query = {DeviceID: pDeviceID};
        MongoClient.connect(MongoDB_url, {useNewUrlParser: true}, function(err, initialisedDatabase) {
            if (err) {
                return console.dir(err);
            }
            CanaryDB = initialisedDatabase.db(dbName);
            var collection = CanaryDB.collection('BinConfigInfo');
            collection.findOne(query).then(function(binDoc){
                if(!binDoc)
                    throw new Error('No record found.');
                return callback(binDoc);
            });
        });
    },

    // Inserts/Updates BinLim document in BinConfigInfo collection
    updateBinLimDocument: function(formObject) {
        var query = {DeviceID: formObject.DeviceID};
        CanaryDB.collection('BinConfigInfo').update(query, {$set: formObject} ,{upsert: true});   
    },

    // Inserts Bin Alarm data to bin alarm collection
    insertAlarmData: function(binAlarmObject) {
        CanaryDB.collection('BinAlarmData').insertOne(binAlarmObject);
    },

}
