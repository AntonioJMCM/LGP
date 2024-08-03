import React, { Component } from 'react';
import './Profile.scss';

class ProgressChart extends Component {
  constructor(props) {
    super(props);
    this.value = 55; // percentage
    this.valuelabel = 'Geral'; // label
    this.size = 200; // cicle size
    this.strokewidth = 30;
  }
  render() {

    const halfsize = (this.size * 0.5);
    const radius = halfsize - (this.strokewidth * 0.5);
    const circumference = 2 * Math.PI * radius;
    const strokeval = ((this.value * circumference) / 100);
    const dashval = (strokeval + ' ' + circumference);

    const trackstyle = { strokeWidth: this.strokewidth };
    const indicatorstyle = { strokeWidth: this.strokewidth, strokeDasharray: dashval }
    const rotateval = 'rotate(-90 ' + halfsize + ',' + halfsize + ')';

    return (
      <svg width={this.size} height={this.size} className="donutchart">
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={trackstyle} className="donutchart-track" />
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={indicatorstyle} className="donutchart-indicator" />
        <text className="donutchart-text" x={halfsize} y={halfsize} style={{ textAnchor: 'middle' }} >
          <tspan y={halfsize - 10}>{this.value} %</tspan>
          <tspan x={halfsize} y={halfsize + 20}>{this.valuelabel}</tspan>
        </text>
      </svg>
    );
  }
}

function StudentInformation(props) {
  return (
    <div className="row">
      <div className="col-4">
        <div className="image-container">
          <img className="img-fluid" src={props.picture} alt="Profile" />
          <label htmlFor="file-upload" className="upload-button"><i className="fas fa-camera"></i></label>
          <input id="file-upload" type="file" />
        </div>
      </div>
      <div className="col-8 d-flex flex-column">
        <div className="field">
          <p>{props.name}</p>
        </div>
        <div className="field">
          <p>{props.email}</p>
        </div>
        <div className="field">
          <p>11º Ano</p>
        </div>
        <div className="field">
          <p>Turma D</p>
        </div>
      </div>
    </div>
  );
}

function StudentStatistics() {
  return (
    <div className="stats">
      <h2>Rendimento</h2>
      <div className="row">
        <div className="col-4">
          <p>Questionários</p>
          <p>Temas</p>
        </div>
        <div className="col-8 d-flex justify-content-center">
          <ProgressChart />
        </div>
      </div>
    </div>
  );
}

function TeacherInformation() {
  return (
    <div className="row">
      <div className="col-4">
        <div className="image-container">
          <img className="img-fluid"  alt="Profile" />
          <label htmlFor="file-upload" className="upload-button"><i className="fas fa-camera"></i></label>
          <input id="file-upload" type="file" />
        </div>
      </div>
      <div className="col-8 d-flex flex-column">
        <div className="field">
          <p>John</p>
        </div>
        <div className="field">
          <p>Doe</p>
        </div>
      </div>
    </div>
  );
}

class Profile extends Component {
  render() {
    //if student
    return (
      <div className="container-fluid profile">
        <StudentInformation name={this.props.location.state.name} email={this.props.location.state.email} picture={this.props.location.state.picture}/>
        <StudentStatistics />
      </div>
    );

    /*  if teacher
        return (
          <div className="container profile">
            <TeacherInformation />
            <TeacherStatistics />
          </div>
        ); */
  }
}

export default Profile;