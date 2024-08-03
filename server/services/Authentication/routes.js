'use strict';
const Logger = require('./../common/logger/logger').Logger;
const Mongo = require('./../common/mongodb/Mongo').Mongo;
const AuthDB = require('./DB/AuthDB').AuthDB;
const JWTManager = require('./Session/JWTManager').JWTManager;
const {AzureADInterface} = require('./Azure/AzureADInterface');
const Accounts = require('./../common/ServiceInterfaces/AccountsInterface')
    .AccountsInterface;

/**
 * function that creates the API routes
 * @param {Object} expressApp express application object
 * @param {Mongo} database database connection object
 * @param {Object} parser multer parser object
 */
function setupRoutes(expressApp, database, parser) {
  const JWT = new JWTManager();
  /**
   * PRIVATE endpoint to check if the server is working
   * @param {Object} req request object
   * @param {Object} res response object
   */
  function heartbeat(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    Logger.infoLog(`Received heartbeat request from ${ip}`, 'API');
    // 200 => OK response
    res.statusCode = 200;
    res.send('Alive');
  }
  expressApp.get('/heartbeat', heartbeat);

  /**
   * PUBLIC endpoint to obtain the azure authentication configuration that
   * the client application should use
   * @param {Object} req request object
   * @param {Object} res response object
   */
  function sendAzureConfig(req, res) {
    const azureConfig = {
      clientID: process.env.AZURE_CLIENT_ID,
      authority: process.env.AZURE_AUTHORITY,
      graphScopes: [process.env.AZURE_SCOPE],
    };
    res.send(azureConfig);
  }
  expressApp.get('/azure_config', sendAzureConfig);
  /**
   * PUBLIC endpoint to execute the login, receives the field azureToken with
   * user azure client access token
   * @param {Object} req request object
   * @param {Object} res response object
   */
  function login(req, res) {
    /**
     * quite frankly this is the worst code ever but its not like i can do any
     * better with this forced async garbage from javascript, the next time
     * someone who likes js even dares to complain about C++ and say its
     * hard to read or has boilerplate or anything about code quality i will
     * straight up bitch slap them
     */
    // fetch Azure AD Auth token from form body
    const azureToken = req.body['azureToken'];
    const azure = new AzureADInterface(azureToken);
    // validate the azure token
    azure.validateToken().then((data)=>{
      const displayName = data.displayName;
      const email = data.mail;
      const azureClientId = data.id;
      // check of the user is already registered
      AuthDB.checkIfUserExistsByAzureID(database, azureClientId).then(
          (data)=>{
            if (data) {
              // user exists
              // generate jwt
              const payload = JWTManager.generatePayload(
                  Mongo.generateUUIDFromString(data.azureID),
                  Mongo.generateUUIDFromString(data._id),
                  data.userType);
              const jwt = JWT.generateJWT(payload);
              // 200 OK response with JWT attached
              res.statusCode = 200;
              res.send(jwt);
            } else {
              // user does not exist
              // fetch the azure user group to determine user type
              azure.fetchUserGroup().then((userGroup)=>{
                // for now assume student
                const userType = false;
                // user does not exist and therefore needs to be created
                const result = AuthDB.registerUser(database,
                    azureClientId, userType);
                const internalClientID =
                    Mongo.generateUUIDFromString(result.internalUUID);
                // check promise for registering user in db
                result.promise.then(()=> {
                  // create user profile
                  Accounts.createUser(internalClientID.toString(), displayName,
                      email, userType).then(()=>{
                    Logger.successLog('user profile created', 'API');
                  });
                  // generate jwt
                  const payload = JWTManager.generatePayload(
                      azureClientId.toString(), internalClientID.toString(),
                      userType
                  );
                  const jwt = JWT.generateJWT(payload);
                  // 200 OK response with JWT attached
                  res.statusCode = 200;
                  res.send(jwt);
                }).catch((err)=>{
                  // failed to register user to db
                  AuthDB.userRegisterErrorHandler(err, database,
                      azureClientId, userType);
                });
              }).catch((err)=>{
                // failed to fetch user group
                Logger.errorLog(err, 'API');
              });
            }
          }).catch((err)=>{
        Logger.errorLog(err, 'API');
      });
    }).catch((err)=>{
      // invalid token => 401 UNAUTHORIZED response
      Logger.errorLog(err, 'API');
      res.statusCode = 401;
      res.send('Invalid Azure AD Authentication Token');
    });
  }
  expressApp.post('/login', parser.array(), login);

  /**
   * PRIVATE endpoint that validates an internal JWT, receives a field called
   * token where the JWT is contained
   * @param {Object} req request object
   * @param {Object} res response object
   */
  function validateJWToken(req, res) {
    const token = req.body.token;
    const result = JWT.validateJWT(token);
    if (result === undefined || result == null) {
      // invalid token => 401 UNAUTHORIZED response
      Logger.errorLog('Invalid JWT Detected', 'API:ValidateToken');
      res.statusCode = 401;
      res.send('Invalid JWT token');
    } else {
      Logger.successLog('JWT Validated', 'API');
      // valid token => 200 OK response
      res.statusCode = 200;
      // response object with JWT payload
      const resp = {
        azureClientId: result.azureClientId,
        internalID: result.internalClientID,
        userType: result.userType,
      };
      res.send(resp);
    }
  }
  expressApp.post('/validate_token', parser.array(), validateJWToken);
}

module.exports = {setupRoutes};
