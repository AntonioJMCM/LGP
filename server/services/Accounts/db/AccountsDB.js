'use strict';
const Mongo = require('../../common/mongodb/Mongo').Mongo;

/**
 *
 */
class AccountsDB {
  /**
   *
   * @param {Mongo} dbCon
   * @param {string} internalID
   * @return {Promise}
   */
  static fetchUserProfile(dbCon, internalID) {
    const UUID = Mongo.generateUUIDFromString(internalID);
    return dbCon.fetchCollectionSingleDataEntry('profiles', {_id: UUID});
  }

  /**
   *
   * @param {Mongo} dbCon
   * @param {string} internalID
   * @param {string} name
   * @param {string} email
   * @param {boolean} userType
   * @param {string} profilePicture
   * @return {Promise}
   */
  static createUser(dbCon, internalID, name, email, userType,
      profilePicture = 'http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png') {
    const internalUUID = Mongo.generateUUIDFromString(internalID);
    const data = {
      _id: internalUUID,
      name: name,
      email: email,
      userType: userType,
      picture: profilePicture,
    };
    return dbCon.insertDataObject('profiles', data);
  }
}

module.exports = {AccountsDB};
