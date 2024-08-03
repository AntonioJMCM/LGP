'use strict';
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const routes = require('./routes');
const Logger = require('../common/logger/logger').Logger;
const Mongo = require('../common/mongodb/Mongo').Mongo;

dotenv.config();

const parser = multer();

const db = new Mongo();
db.connectToMongo().then(()=> {
  const app = express();
  const port = process.env.SERVER_PORT;
  // for parsing application/json
  app.use(bodyParser.json());
  // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: true}));

  routes.setupRoutes(app, db, parser);

  app.listen(port, (err) => {
    if (err) {
      Logger.errorLog(err, 'API');
      process.exit(-1);
    }
    Logger.successLog('REST API Ready to take requests', 'API');
  });
}).catch(()=>{
  process.exit(-1);
});
