'use strict';
const request = require('request-promise');

const endpoints = {
  createUser: '/create',
  fetchPersonalProfile: '/profile/me',
};

/**
 *
 */
class AccountsInterface {
  /**
   * abstracts the procces of creating a user profile
   * @param {string} internalID
   * @param {string} name
   * @param {string} email
   * @param {boolean} userType
   * @return {Promise} promise to the user profile creation request
   */
  static createUser(internalID, name, email, userType) {
    const host = process.env.ACCOUNTS_HOST;
    const port = process.env.ACCOUNTS_PORT;
    const endpoint = host + ':' + port + endpoints.createUser;
    const options = {
      uri: endpoint,
      json: true,
      form: {
        internalID: internalID,
        name: name,
        email: email,
        userType: userType,
      },
    };
    return request.post(options);
  }
  /**
   * abstracts fetching the user profile request
   * @param {string} jwt user access token
   * @return {request.Request} promise to the request
   */
  static fetchPersonalProfile(jwt) {
    const host = process.env.ACCOUNTS_HOST;
    const port = process.env.ACCOUNTS_PORT;
    const endpoint = host + ':' + port + endpoints.fetchPersonalProfile;
    const options = {
      url: endpoint,
      headers: {
        auth: jwt,
      },
    };
    return request.get(options);
  }
}

module.exports = {AccountsInterface};
