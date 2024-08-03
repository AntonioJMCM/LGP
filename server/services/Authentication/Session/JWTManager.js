'use strict';
const jwt = require('jsonwebtoken');
const fileStream = require('fs');
const Logger = require('../../common/logger/logger').Logger;

/**
 * This class represents the payload to be encoded into the JWT
 */
class JWTPayload {
  /**
   * constructor for the payload
   * @param {string} azureClientID User Azure Client ID
   * @param {string} internalClientID Internal UUID for the user
   * @param {boolean} userType type of user false => student, true => teacher
   */
  constructor(azureClientID, internalClientID, userType) {
    this.data = {};
    this.data.azureClientId = azureClientID;
    this.data.internalClientID = internalClientID;
    this.data.userType = userType;
  }

  /**
   * obtains the data object what will be encoded into the JWT
   * @return {object} the object with the payload data
   */
  getData() {
    return this.data;
  }
}

/**
 * class that handles sessions
 */
class JWTManager {
  /**
   * Constructor for the JWT Manager where all configurations are read
   * from the environment file
   */
  constructor() {
    // read the private key
    this.privateKey = fileStream.readFileSync(
        process.env.PRIVATE_KEY_PATH, 'utf8');
    // read the public key
    this.publicKey = fileStream.readFileSync(
        process.env.PUBLIC_KEY_PATH, 'utf8');

    // the algorithm defines the workflow and as such must be hardcoded
    this.tokenSignAlgorithm = 'RS256';

    // read the JWT data from env file
    this.tokenExprirationPeriod = process.env.JWT_EXPIRATION_PERIOD;
    this.tokenIssuer = process.env.JWT_ISSUER;
    this.tokenAudience = process.env.JWT_AUDIENCE;
    this.tokenSubject = process.env.JWT_SUBJECT;
  }
  /**
   * Generates JWT session Token
   * @param {JWTPayload} payload this is the payload that will be included
   * in the JWT token
   * @return {null|Object} null if the payload is not valid, otherwise
   * returns token in string format
   */
  generateJWT(payload) {
    if (payload === undefined || payload === null) return null;
    if (!(payload instanceof JWTPayload)) return null;

    const SignOptions = {
      issuer: this.tokenIssuer,
      subject: this.tokenSubject,
      audience: this.tokenAudience,
      expiresIn: this.tokenExprirationPeriod,
      algorithm: this.tokenSignAlgorithm,
    };
    return jwt.sign(payload.getData(), this.privateKey, SignOptions);
  }
  /**
   * Checks if the user session is valid or not
   * @param {object} SessionToken session token that needs to be validated
   * @return {boolean} whether the session is valid or not
   */
  validateJWT(SessionToken) {
    if (SessionToken === undefined || SessionToken === null) {
      return false;
    }
    const verifyOptions = {
      issuer: this.tokenIssuer,
      subject: this.tokenSubject,
      audience: this.tokenAudience,
      expiresIn: this.tokenExprirationPeriod,
      algorithm: [this.tokenSignAlgorithm],
    };
    try {
      return jwt.verify(SessionToken, this.publicKey, verifyOptions);
    } catch (err) {
      Logger.errorLog(err, 'JWTManager');
      return null;
    }
  }
  /**
   * generates payload to be used in the JWT
   * @param {string} azureClientID user azure client id
   * @param {string} internalClientID internal user UUID
   * @param {boolean} userType user type
   * @return {JWTPayload|null} returns the payload or null if the parameters
   * are not valid
   */
  static generatePayload(azureClientID, internalClientID, userType) {
    if (azureClientID === undefined || azureClientID == null) {
      return null;
    }
    if (internalClientID === undefined || internalClientID == null) {
      return null;
    }
    if (userType === undefined || userType == null) {
      return null;
    }
    return new JWTPayload(azureClientID, internalClientID, userType);
  }
}

module.exports = {JWTManager};
