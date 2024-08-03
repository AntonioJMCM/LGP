'use strict';
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const Logger = require('../common/logger/logger').Logger;
const routes = require('./routes');
const cors = require('cors');

dotenv.config();

const parser = multer();

const app = express();
const port = process.env.SERVER_PORT;
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

routes.setupRoutes(app, parser);

app.listen(port, (err) => {
  if (err) {
    Logger.errorLog(err, 'API');
    process.exit(-1);
  }
  Logger.successLog('REST API Ready to take requests', 'API');
});
