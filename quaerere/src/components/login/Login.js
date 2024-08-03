import React, { Component } from 'react';
import './Login.scss';
import logo from '../../assets/images/logo.svg';
import {LoginInterface} from '../../utils/Server Interface/LoginInterface';
import {AccountsInterface} from '../../utils/Server Interface/AccountsInterface';

class Login extends Component {
  login = () =>{
    const auth = new LoginInterface();
    const promise =  new Promise(auth.login);
    promise.then(()=>{
      AccountsInterface.fetchProfile().then((data)=>{
      this.props.history.push({
        pathname:'/profile',
        state: JSON.parse(data)
      });
      }).catch((err)=>{
        console.log(err);
      })
    });
  } 
  render() {
    return (
      <div className="login-container d-flex align-items-center justify-content-center">
        <div id="login">
          <img src={logo} className="img-fluid" alt="Quaerere logo" />
          <h1>Quaerere</h1>
          <button onClick={this.login} type="button" className="btn btn-primary">Entrar</button>
        </div>
      </div>
    );
  }
}


export default Login;
