import React from 'react';
import './binPage.css'

function BinMenu(){
    return (
      <div>
          <ul>
              <li><a href = "https://www.google.com"> Google Link </a></li>
              <li><a href = "/binStatus" class = "active"> Bin Status</a></li>
              <li><a href = "http://149.28.178.221:8888/updateBinInfo" > Update Bin Configuration</a></li>
          </ul>
      </div>
    )
  }

  export default BinMenu;