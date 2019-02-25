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

const getApiAndEmit = async socket => {
    try {
      const res = await axios.get(
        "https://api.darksky.net/forecast/9fc17bc153413aea00691d5ff1f461cb/43.7695,11.2558"
      ); // Getting the data from DarkSky
      socket.emit("FromAPI", res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
    } catch (error) {
      console.error(`Error: ${error.code}`);
    }
};

const getAlarmAndEmit = async socket => {
  try {
    mongoUtil.getLatestAlarmDoc( function(binAlarm){
      console.log("Bin level is: " + binAlarm.BinLevel);
      socket.emit("FromMongo", binAlarm.BinLevel);
    });
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};


let interval;
io.on("connection", socket => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getAlarmAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});



server.listen(port, () => console.log(`Listening on port ${port}`));