'use strict';
const Accounts = require('./db/AccountsDB').AccountsDB;
const Auth = require('./../common/ServiceInterfaces/Authentication')
    .Authentication;

/**
 *
 * @param {Object} express
 * @param {Mongo} database
 * @param {Object} parser
 */
function setupRoutes(express, database, parser) {
  /**
   *
   * @param {Object} req
   * @param {Object} res
   */
  function fetchPersonalProfile(req, res) {
    const jwt = req.headers['auth'];
    if (jwt === undefined || jwt == null) {
      res.statusCode = 401;
      res.send('Missing Auth token');
      return;
    }
    Auth.validateToken(jwt).then((token) => {
      const internalID = token.internalID;
      Accounts.fetchUserProfile(database, internalID).then((data) => {
        res.statusCode = 200;
        res.send(data);
      }).catch((err) => {
        res.statusCode = 404;
        res.send(err);
      });
    }).catch((err)=>{
      res.statusCode = 401;
      res.send(err);
    });
  }
  express.get('/profile/me', fetchPersonalProfile);

  /**
   * creates a user profile in the database
   * @param {Object} req request object
   * @param {Object} res response object
   */
  function createUser(req, res) {
    const body = req.body;
    const internalID = body['internalID'];
    const name= body['name'];
    const email = body['email'];
    const userType = body['userType'];
    Accounts.createUser(database, internalID, name, email, userType).then(()=>{
      res.statusCode = 200;
      res.send();
    }).catch((err)=>{
      res.statusCode = 400;
      res.send(err);
    });
  }
  express.post('/create', parser.array(), createUser);
}

module.exports = {setupRoutes};
