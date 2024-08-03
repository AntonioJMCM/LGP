'use strict';
const Mongo = require('./../../common/mongodb/Mongo').Mongo;

/**
 * this class encapsulates interacting with the database
 */
class AuthDB {
  /**
   * checks if a user is registered in the system and returns his data is he
   * is registered, this is done by comparing the azure client ID
   * @param {Mongo} dbCon Database Connection Object
   * @param {string} azureID User Azure Client ID
   * @return {Promise} Promise to the result of the request
   */
  static checkIfUserExistsByAzureID(dbCon, azureID) {
    const azureUUID = Mongo.generateUUIDFromString(azureID);
    return dbCon.fetchCollectionSingleDataEntry('users', {azureID: azureUUID});
  }
  /**
   * registers a user in the database, the internal client id is generated
   * and then returned alongside the promise to the request
   * @param {Object} dbCon Database connection object
   * @param {string} azureID User Azure Client ID
   * @param {boolean} userType type of user false => student, true => teacher
   * @return {{internalUUID: BinaryType, promise: Promise}} object containing a
   * promise to the data insert request and the generated internal client id
   */
  static registerUser(dbCon, azureID, userType) {
    const internalUUID = Mongo.generateRandomUUID();
    const azureUUID = Mongo.generateUUIDFromString(azureID);
    const dataInsertPromise = dbCon.insertDataObject('users', {
      _id: internalUUID,
      azureID: azureUUID,
      userType: userType,
    });
    return {
      promise: dataInsertPromise,
      internalUUID: internalUUID,
    };
  }
  /**
   * This method handles errors in registering the user in teh database. If the
   * problem is a duplicate id then the insert in retried with a new ID,
   * otherwise nothing is done
   * @param {Object} err error object
   * @param {Object} dbCon database connection object
   * @param {String} azureID user azure client id
   * @param {boolean} userType the user type
   * @return {{internalUUID: BinaryType, promise: Promise}} false if the
   * issue was not a duplicate id, a promise to the new insert request if it
   * was
   */
  static userRegisterErrorHandler(err, dbCon, azureID, userType) {
    // if somehow a duplicate UUID is generated we must retry
    // error code 11000 indicates a duplicate key
    if (err.code === 11000) {
      return this.registerUser(dbCon, azureID, userType);
    }
    return false;
  }
}

module.exports = {AuthDB};
