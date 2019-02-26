import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import './binPage.css'

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: {},
      endpoint: "http://127.0.0.1:4001"
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromMongo", data => this.setState({ response: data }));
  }
  
  render() {
    const { response } = this.state;
    var binAlarm = this.state.response;
    //var fullAlarm = binAlarm.FullAlarm;

    if (response) {
      return (
        <div style={{ textAlign: "center"}}>
          <h3> Bin level info</h3>
          <div className = {binAlarm.FullAlarm ? "badBin" : "goodBin"}>
            <p> Bin Level: <br/>
            {binAlarm.BinLevel} % </p>
          </div>
          <div className = "DottedBox">
            <p className="DottedBox_Content"> Bin Temp: <br/>
            {binAlarm.Temperature} Degrees C</p>
          </div>
        </div>
      );
    } 
    
    else {
      return (
        <div style={{ textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      )
    }
  }
}


export default App;