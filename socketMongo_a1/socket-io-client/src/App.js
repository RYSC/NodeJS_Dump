import React, { Component } from "react";
import socketIOClient from "socket.io-client";
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

    if (response) {
      return (
        <div style={{ textAlign: "center"}}>
          <h3> Bin level info</h3>
          <p>The Bin Level is: {binAlarm.BinLevel} % </p>
          <div class="alert"> 
           
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