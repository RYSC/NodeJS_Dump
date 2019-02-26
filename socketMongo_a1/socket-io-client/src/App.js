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
    return (
      <div style={{ textAlign: "center" }}>
        {response
          ? <p>
              The Bin Level is: {binAlarm.BinLevel} %
              The Bin Temp is: {binAlarm.Temperature}
            </p>
          : <p>Loading...</p>}
      </div>
    );
  }
}
export default App;