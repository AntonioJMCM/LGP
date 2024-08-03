'use strict';
const request = require('request-promise');
const Logger = require('./../logger/logger').Logger;

// endpoints available to be used
const endpoints = {
  tokenValidation: '/validate_token',
  login: '/login',
  azureConfig: '/azure_config',
};

/**
 * Interface to abstract interacting with the authentication service
 */
class Authentication {
  /**
   * Asks auth service to validate an internal jwt token
   * @param {string} token JWT token to be validated
   * @return {request.Request} promise to the result of the request
   */
  static validateToken(token) {
    const authHost = process.env.AUTH_HOST;
    const authPort = process.env.AUTH_PORT;
    const endpoint = authHost+':'+authPort+endpoints.tokenValidation;
    const requestOptions = {
      uri: endpoint,
      json: true,
      form: {
        token: token,
      },
    };
    const requestPromise = request.post(requestOptions);
    requestPromise.then( () => {
      Logger.successLog('Token Validated', 'AuthInterface');
    });
    return requestPromise;
  }
  /**
   * asks the auth service to execute the login process
   * @param {string} token azure ad access token
   * @return {request.Request} promise to the request
   */
  static login(token) {
    const authHost = process.env.AUTH_HOST;
    const authPort = process.env.AUTH_PORT;
    const endpoint = authHost+':'+authPort+endpoints.login;
    const requestOptions = {
      uri: endpoint,
      json: true,
      form: {
        azureToken: token,
      },
    };
    const requestPromise = request.post(requestOptions);
    requestPromise.then( () => {
      Logger.successLog('Log In Validated', 'AuthInterface');
    }).catch( (err) => {
      Logger.errorLog(err, 'AuthInterface');
    });
    return requestPromise;
  }
  /**
   * fetches client azure ad authentication configuration
   * @return {request.Request} promise to the request
   */
  static fetchAzureConfig() {
    const authHost = process.env.AUTH_HOST;
    const authPort = process.env.AUTH_PORT;
    const endpoint = authHost+':'+authPort+endpoints.azureConfig;
    const requestOptions = {
      uri: endpoint,
      json: true,
    };
    const requestPromise = request.get(requestOptions);
    requestPromise.then( () => {
      Logger.successLog('Azure AD Config Fetched', 'AuthInterface');
    }).catch( (err) => {
      Logger.errorLog(err, 'AuthInterface');
    });
    return requestPromise;
  }
}

module.exports = {Authentication};
