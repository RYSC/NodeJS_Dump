const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
var mongoUtil = require("./mongoUtil");

app.use(index);
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

const getAlarmAndEmit = async socket => {
  try {
    mongoUtil.getLatestAlarmDoc( function(binAlarm){
      binAlarm.BinLevel = binAlarm.BinLevel.toFixed(2);
      socket.emit("FromMongo", binAlarm);
      console.log("Emitting latest BinAlarm from mongo. BinLevel: "+binAlarm.BinLevel);
    });
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

let interval;
io.on("connection", socket => {
  console.log("New client connected");
  
  mongoUtil.connectToServer(function(err){
    if (err) {
      return console.dir(err);
    }

    if (interval) {
      clearInterval(interval);
    }
    //getAlarmAndEmit(socket);
    interval = setInterval(() => getAlarmAndEmit(socket), 10000);
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));