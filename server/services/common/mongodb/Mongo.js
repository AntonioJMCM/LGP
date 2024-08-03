'use strict';
const Mongodb = require('mongodb');
const Logger = require('./../logger/logger').Logger;
const MUUID = require('uuid-mongodb');

/**
 * Class that encapsulates basic interaction with a MongoDB database
 */
class Mongo {
  /**
   * constructor for the database connection object, the configurations to
   * connect to the database are read from the .env file
   */
  constructor() {
    this.mongoConnection='';

    const mongoHostPrepend = 'mongodb://';
    this.mongoDBName = process.env.DB_NAME;
    this.mongoHost = mongoHostPrepend+process.env.DB_HOST;
    this.mongoPort = process.env.DB_PORT;
    this.mongoUser = process.env.DB_USER;
    this.mongoPassword = process.env.DB_PASS;
    this.mongoConnectionPoolSize = process.env.DB_CONN_POOL_SIZE;
    this.isReady = false;

    this.mongoClient = new Mongodb.
        MongoClient(this.mongoHost+':'+this.mongoPort, {
          useNewUrlParser: true,
          auth: {
            user: this.mongoUser,
            password: this.mongoPassword,
          },
          poolSize: this.mongoConnectionPoolSize,
        });
  }
  /**
   * method that connects us to the MongoDB database
   * @return {Promise<MongoClient>} promise to the connection request result
   */
  connectToMongo() {
    const connectionPromise = this.mongoClient.connect();
    connectionPromise.then(()=>{
      this.database = this.mongoClient.db(this.mongoDBName);
      this.isReady = true;
      Logger.successLog('Connected To Database', 'MongoDBWrapper');
    }).catch((err) => {
      Logger.errorLog(err, 'MongoDBWrapper');
    });
    return connectionPromise;
  }
  /**
   * closes the connection to the MongoDB database
   */
  closeMongoConnection() {
    this.mongoClient.close(false).then(()=>{
      Logger.successLog('Closed Connection To MongoDB', 'MongoDBWrapper');
    }).catch((err)=>{
      Logger.errorLog(err, 'MongoDBWrapper');
    });
  }
  /**
   * Inserts a single object into the database
   * @param {string} collection collection to insert data into
   * @param {Object} data data to insert
   * @return {Promise} promise to the insert request
   */
  insertDataObject(collection, data) {
    // log request
    Logger.infoLog(
        `Attempting To Insert Data:${JSON.stringify(data)}`+
                  ` into database collection:${collection}`,
        'MongoDBWrapper');
    // execute insert request
    const insertPromise = this.database.collection(collection)
        .insertOne(data);
    insertPromise.then(()=>{
      // Log success
      Logger.successLog('Data inserted into database', 'MongoDBWrapper');
    }).catch((err)=>{
      // Log failure
      Logger.errorLog(
          `Error inserting data:${data} into collection:${collection}`+
                    ` reason:${err}`,
          'MongoDBWrapper');
    });
    // return promise to the insert request
    return insertPromise;
  }

  /**
   * fetches all data entries that match a query
   * @param {string} collection collection to fetch from
   * @param {Object} query query to be used, the way this works is by
   * specifying the field we want and giving a regex for that field that will
   * server to match entries
   * @param {Object} projection projection that allows us to filter result data
   * fields
   * @return {Promise} promise to the fetch request
   */
  fetchCollectionDataEntries(collection, query = {}, projection = {}) {
    // Log fetch request
    Logger.infoLog(`Attempting to fetch data from collection:${collection}`+
        ` with query ${JSON.stringify(query)}`+
        ` and using the projection ${JSON.stringify(projection)}`,
    'MongoDBWrapper');
    // execute fetch request
    const fetchPromise = this.database.collection(collection)
        .find(query, projection).toArray();
    fetchPromise.then(()=>{
      // log fetch request success
      Logger.successLog('Data fetched from database', 'MongoDBWrapper');
    }).catch((err)=>{
      // log fetch request failure
      Logger.errorLog(err, 'MongoDBWrapper');
    });
    return fetchPromise;
  }
  /**
   * fetches a single data entry that matches the supplied query
   * @param {string} collection collection to fetch from
   * @param {Object} query query query to be used, the way this works is by
   * specifying the field we want and giving a regex for that field that will
   * server to match entries
   * @param {Object} projection projection that allows us to filter fields from
   * the resulting data object
   * @return {Promise} promise to the fetch request
   */
  fetchCollectionSingleDataEntry(collection, query = {}, projection = {}) {
    // Log fetch request
    Logger.infoLog(`Attempting to fetch data from collection:${collection}`+
        ` with query ${JSON.stringify(query)}`+
        ` and using the projection ${JSON.stringify(projection)}`,
    'MongoDBWrapper');
    // execute fetch request
    const fetchPromise = this.database.collection(collection)
        .findOne(query, projection);
    fetchPromise.then(()=>{
      // log fetch request success
      Logger.successLog('Data fetched from database', 'MongoDBWrapper');
    }).catch((err)=>{
      // log fetch request failure
      Logger.errorLog(err, 'MongoDBWrapper');
    });
    return fetchPromise;
  }
  /**
   * generates a random UUID in binary format
   * @return {*|undefined} binary UUID object
   */
  static generateRandomUUID() {
    return MUUID.v4();
  }
  /**
   * generates a binary UUID object from a string
   * @param {string} uuid string to be transformed
   * @return {*|undefined} binary UUID object
   */
  static generateUUIDFromString(uuid) {
    return MUUID.from(uuid);
  }
}

module.exports = {Mongo};
