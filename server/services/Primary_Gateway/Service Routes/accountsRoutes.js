'use strict';
const Accounts = require('../../common/ServiceInterfaces/AccountsInterface')
    .AccountsInterface;

/**
 * setup routes to the accounts service
 * @param {Object} express express application object
 * @param {Object} parser multer parser object
 */
function setupRoutes(express, parser) {
  /**
   * function for the profile fetching endpoint
   * @param {Object} req request object
   * @param {Object} res response object
   */
  function fetchUserProfile(req, res) {
    const jwt = req.headers['auth'];
    Accounts.fetchPersonalProfile(jwt).then((data)=>{
      res.statusCode = 200;
      res.send(data);
    }).catch((err)=>{
      res.statusCode = 404;
      res.send(err);
    });
  }
  express.get('/profile/me', fetchUserProfile);
}

module.exports = {setupRoutes};
