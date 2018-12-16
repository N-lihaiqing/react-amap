import React, { Component } from 'react';
import AMapPage from "./AMapPage"

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <AMapPage/>
      </div>
    );
  }
}

export default App;
