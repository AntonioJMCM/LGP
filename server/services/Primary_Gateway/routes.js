'use strict';
const AuthRoutes = require('./Service Routes/authRoutes');
const AccountsRoutes = require('./Service Routes/accountsRoutes');
const QuizzRoutes = require('./Service Routes/quizzRoutes');

/**
 * configures routes for all services
 * @param {Object} express express application object
 * @param {Object} parser multer parser object
 */
function setupRoutes(express, parser) {
  AuthRoutes.setupRoutes(express, parser);
  AccountsRoutes.setupRoutes(express, parser);
  QuizzRoutes.setupRoutes(express,parser);
}

module.exports = {setupRoutes};
