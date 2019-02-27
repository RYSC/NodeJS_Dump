import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import './binPage.css'
import BinMenu from './BinMenu'

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
        <div>
          <BinMenu />
          <div className = "section">
            <div className = "container" style={{ textAlign: "center"}}>
              <h3> Bin level info: {binAlarm.DeviceID}</h3>
              <div className = {binAlarm.FullAlarm ? "badBin" : "goodBin"}>
                <p> Bin Level: <br/>
                {binAlarm.BinLevel} % </p>
              </div>
              <div className = {binAlarm.FireAlarm ? "badBin" : "goodBin"}>
                <p> Bin Temp: <br/>
                {binAlarm.Temperature} °C</p>
              </div>
              <div>
                <p> Last Update: {binAlarm.Date}</p>
              </div>
              <div>
                <a href="https://www.google.com"> Google Link </a>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      )
    }
  }
}

export default App;