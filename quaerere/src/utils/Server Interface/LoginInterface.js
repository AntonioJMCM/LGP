const MSAL = require('msal');
const request = require('request-promise');
const configs = require('../globalConfigs').configs;

const config = {
  "clientID":"4c564054-0031-435a-b473-ea30c3742963",
  "authority":"https://login.microsoftonline.com/b7821bc8-67cc-447b-b579-82f7854174fc",
  "graphScopes":["user.read"]
}

const userApp = new MSAL.UserAgentApplication(config.clientID,
  config.authority, config);
/**
 * class that encapsulates interacting with the microsoft graph API
 */
class MSALInterface {
  /**
   * constructor
   * @param {Object} config azure authentication config for application
   */
  constructor(config) {
    this.azureConfig = JSON.parse(config);
    this.userApp = userApp;
  }

  /**
   * required function that does nothing
   * @param {Object} errorDesc error description
   * @param {Object} token token
   * @param {Object} error error
   * @param {string} tokenType token type
   */
  tokenCallback(errorDesc, token, error, tokenType){
    
  }
  /**
   * calls the microsoft sign in function
   * @returns {Promise<string>} promise to sign in request
   */
  signIn() {
    return this.userApp.loginPopup(this.azureConfig.graphScopes);
  }
  /**
   * requests the azure access token
   * @returns {Promise<string>} promise to request
   */
  acquireAccessToken() {
    return this.userApp.acquireTokenSilent(this.azureConfig.graphScopes);
  }
  /**
   * handles error in requesting the access token
   * @param {Object} error error when requesting access token
   * @returns {Promise<string>|null} a promise to the new access token request
   * or null of the error is unrecoverable
   */
  handleAccessTokenAcquisitionError(error) {
    if (error.indexOf("consent_required") !== -1 || error.indexOf("interaction_required") !== -1 || error.indexOf("login_required") !== -1) {
      return this.userApp.acquireTokenPopup(this.azureConfig.graphScopes);
    }else{
      return null;
    }
  }
}

export class LoginInterface {
  /**
   * fetches config from server
   * @return {request.Request} promise to request
   */
  static fetchConfig() {
    const serverHost = configs.SERVER_HOST;
    const serverPort = configs.SERVER_PORT;
    const endpoint = serverHost+':'+serverPort+'/azure_config';
    const opts = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
    return request.get(endpoint,opts);
  }
  /**
   * requests that the server logs in the user
   * @param {string} token user azure access token
   * @returns {request.Request} promise to request
   */
  static serverLogin(token){
    const serverHost = configs.SERVER_HOST;
    const serverPort = configs.SERVER_PORT;
    const endpoint = serverHost+':'+serverPort+'/login';
    const options = {
      uri: endpoint,
      json: true,
      form: {
        azureToken: token,
      },
    };
    return request.post(options);
  }
  /**
   * sets the session token
   * @param {string} jwt session token
   */
  static setSessionToken(jwt) {
    console.log('setting session to '+jwt);
    document.session = jwt;
  }
  /**
   * Executes the login process
   * @param resolve promise resolve function
   * @param reject promise reject function
   */
  login(resolve, reject) {
    // fetch azure config from server
    LoginInterface.fetchConfig().then((config)=>{
      const azure = new MSALInterface(config);
      // sign into azure
      azure.signIn().then(()=>{
        // obtain the azure access token
        azure.acquireAccessToken().then((token)=>{
          // validate token at server and obtain session token
          LoginInterface.serverLogin(token).then((jwt)=>{
            // token validated and session set
            LoginInterface.setSessionToken(jwt);
            resolve(jwt);
          }).catch((err)=>{
            // failed to validate token, session not set
            LoginInterface.setSessionToken('');
            console.log(err);
            reject(err);
          });
        }).catch((err) => {
          // handle type of error that requires a popup
          const errorRes = azure.handleAccessTokenAcquisitionError(err);
          console.log(errorRes);
          if (errorRes!=null) {
            errorRes.then((token) => {
              // validate token at server and obtain session token
              LoginInterface.serverLogin(token).then((jwt) => {
                // token validated and session set
                LoginInterface.setSessionToken(jwt);
                resolve(jwt);
              }).catch((err) => {
                // failed to validate token, session not set
                LoginInterface.setSessionToken('');
                console.log(err);
                reject(err);
              });
            }).catch((err) => {
              // failed to acquire access token, session not set
              LoginInterface.setSessionToken('');
              console.log(err);
              reject(err);
            });
          } else {
            // unknown token request error, unrecoverable
            LoginInterface.setSessionToken('');
            console.log(err);
            reject(err);
          }
        });
      }).catch((err)=>{
        // failed to sign in, session not set
        LoginInterface.setSessionToken('');
        console.log(err);
        reject(err);
      })
    }).catch((err)=>{
      // failed to fetch config, session not set
      LoginInterface.setSessionToken('');
      console.log(err);
      reject(err);
    });
  }
}