

var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
var url = "mongodb://bananas_and_dingoes.summerstudio.xyz:27017";

// Database Name
const dbName = 'HairyPigs';
 
// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);

  insertDocuments(db, function() {
    client.close();
  });
});


const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('DuckCollection');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    
    console.log("Inserted 3 documents into the collection");
    
    callback(result);
  });
}
