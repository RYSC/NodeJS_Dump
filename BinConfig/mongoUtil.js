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
    connectToServer: function(callback) {
        MongoClient.connect(MongoDB_url, {useNewUrlParser: true}, function(error, initialisedDatabase) {
            ConnectedDB = initialisedDatabase;
            CanaryDB = initialisedDatabase.db(dbName);
            console.log("Connected successfully to server!");
            return callback(error);
        });
    },
    getDb: function() {
        return CanaryDB;
    },

    getConfigCollection: function() {
        return CanaryDB.collection('BinConfigInfo')
    },

    insertObject: function(formObject) {
        CanaryDB.collection('BinConfigInfo').insertOne(formObject);
    },

    serialBinInfo: function(formObject) {
        var query = {DeviceID: formObject.DeviceID};
        CanaryDB.collection('BinConfigInfo').find(query).toArray(function(err, result) {
            if (err) throw err;

            console.log(result);
            ConnectedDB.close();
        });
    },

    checkBinExists: function(formObject) {
        var query = {DeviceID: formObject.DeviceID};
        CanaryDB.collection('BinConfigInfo').find(query).count(function(error, count){
            console.log("the count is: " + count);
            if (count == 0)
                console.log("The device is not documented");
            else
                console.log("The device is in the DB");
        });       
    },

    updateDocument: function(formObject) {
        var query = {DeviceID: formObject.DeviceID};
        CanaryDB.collection('BinConfigInfo').update(query, {$set: formObject} ,{upsert: true});   
    }

}
//Test2