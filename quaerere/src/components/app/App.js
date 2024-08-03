import React, { Component } from 'react';
import './App.scss';
import Sidebar from '../sidebar/Sidebar';
import Topbar from '../topbar/Topbar';
import Profile from '../profile/Profile';

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div id="grid-container" className="row">
          <div className="col-md-auto d-flex p-0">
            <Sidebar picture={this.props.location.state.picture}/>
          </div>
          <div className="col p-0">
            <Topbar />
            <div className="container-fluid">
              <main>
                <Profile location={this.props.location}/>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
