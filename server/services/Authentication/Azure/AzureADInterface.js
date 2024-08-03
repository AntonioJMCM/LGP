'use strict';
const request = require('request-promise');
/**
 * Class that represents the user profile that was obtained from the Graph API
 */
class AzureUserProfile {
  /**
   * constructor
   */
  constructor() {
  }
}

/**
 * Class that contains methods to interacts with the Microsoft Graph API
 */
class AzureADInterface {
  /**
   * Constructor for the class, take the Azure Active Directory Token
   * @param {string} azureToken azure active directory access token
   */
  constructor(azureToken) {
    this.azureAccessToken = azureToken;
  }
  /**
   * checks if the MS Graph API token is valid and returns promise to request
   * result
   * @return {Promise} returns promise to the result of the MS Graph API request
   */
  validateToken() {
    const azureProfileEndpoint = 'https://graph.microsoft.com/v1.0/me/';
    const options = {
      uri: azureProfileEndpoint,
      headers: {
        'User-Agent': 'Request-Promise',
        'Authorization': 'Bearer ' + this.azureAccessToken,
      },
      json: true, // Automatically parses the JSON string in the response
    };
    return request.get(options);
  }
  /**
   * This method fetches the use group of the authenticated user
   * @return {Promise} promise to the response of the request
   */
  fetchUserGroup() {
    // this code executes the request to the token validation since it is
    // temporary
    return this.validateToken();
  }
}

module.exports = {AzureADInterface, AzureUserProfile};
