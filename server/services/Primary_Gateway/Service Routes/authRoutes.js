'use strict';
const Auth = require('../../common/ServiceInterfaces/Authentication')
    .Authentication;

/**
 * setup routes to the authentication service
 * @param {Object} express express application object
 * @param {Object} parser multer parser object
 */
function setupRoutes(express, parser) {
  /**
   * route to fetch azure ad auth config
   * @param {Object} req request object
   * @param {Object} res response object
   */
  function fetchAzureConfig(req, res) {
    Auth.fetchAzureConfig().then( (data) => {
      // data was fetched 200 => OK
      res.statusCode = 200;
      res.send(data);
    }).catch(()=>{
      // failed to fetch data 404 => Not Found
      res.statusCode = 404;
      res.send('failed to fetch azure config');
    });
  }
  express.get('/azure_config', fetchAzureConfig);
  /**
   * endpoint to execute the login, receives the field azureToken with
   * user azure client access token
   * @param {Object} req request object
   * @param {Object} res response object
   */
  function login(req, res) {
    const azureToken = req.body['azureToken'];
    Auth.login(azureToken).then((data)=>{
      // login validated and JWT received 200 => OK
      res.statusCode = 200;
      res.send(data);
    }).catch(() => {
      // login not validated 401 => UNAUTHORIZED
      res.statusCode = 401;
      res.send('failed to validate login information');
    });
  }
  express.post('/login', parser.array(), login);
}

module.exports = {setupRoutes};
