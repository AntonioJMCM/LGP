const request = require('request-promise');
const configs = require('../globalConfigs').configs;

export class AccountsInterface {
  static fetchProfile() {
    const endpoint = configs.SERVER_HOST+":"+configs.SERVER_PORT+"/profile/me";
    const session = document.session;
    const options = {
      url: endpoint,
      headers: {
        auth: session
      }
    };
    return request.get(options);
  }
}