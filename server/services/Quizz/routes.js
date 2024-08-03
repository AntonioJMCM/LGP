'use strict';
const Questions = require('./db/QuestionsDB.js').QuestionsDB;
const Auth = require('./../common/ServiceInterfaces/Authentication')
    .Authentication;

/**
 * function that creates the API routes
 * @param {Object} express express application object
 * @param {Mongo} database database connection object
 * @param {Object} parser multer parser object
 */
function setupRoutes(express, database, parser) {

  /**
   * creates a question in the database
   * @param {Object} req request object
   * @param {Object} res response object
   */
  function createQuestion(req, res) {
    
    const body = req.body;
    const description= body['description'];
    const type = body['type'];
    const score = body['score'];
    switch (type) {
      case 'TrueOrFalse':{
        const response = body['response'];
        Questions.createTrueOrFalse(database, description, score, response).then(()=>{
          res.statusCode = 200;
          res.send();
        }).catch((err)=>{
          res.statusCode = 400;
          res.send(err);
        });
        break;}
      case 'MultipleChoice':{
        const choices = body['choices'];
        Questions.createMultipleChoice(database, description, score, choices).then(()=>{
          res.statusCode = 200;
          res.send();
        }).catch((err)=>{
          res.statusCode = 400;
          res.send(err);
        });
        break;}
      case 'OpenAnswer':{
        Questions.createOpenAnswer(database, description, score).then(()=>{
          res.statusCode = 200;
          res.send();
        }).catch((err)=>{
          res.statusCode = 400;
          res.send(err);
        });
        break;}
      case 'Puzzle':{
        const pieces = body['pieces'];
        Questions.createPuzzle(database, description, score, pieces).then(()=>{
          res.statusCode = 200;
          res.send();
        }).catch((err)=>{
          res.statusCode = 400;
          res.send(err);
        });
        break;}
      case 'Link':{
        const response = body['response'];
        Questions.createLink(database, description, score, response).then(()=>{
          res.statusCode = 200;
          res.send();
        }).catch((err)=>{
          res.statusCode = 400;
          res.send(err);
        });
        break;}
      case 'CompleteText':{
        
        const text = body['text'];
        const jwt = req.headers['auth'];

        if (jwt === undefined || jwt == null) {
          res.statusCode = 401;
          res.send('Missing Auth token');
          return;
        }
        Auth.validateToken(jwt).then((token) => {
          const internalID = token.internalID;
          Questions.createCompleteText(database, description, score, text, internalID).then(()=>{
          res.statusCode = 200;
          res.send();
        }).catch((err)=>{
          res.statusCode = 400;
          res.send(err);
        });
        });
        break;}
      case 'OrderBlocks':{
        const blocks = body['blocks'];
        Questions.createOrderBlocks(database, description, score, blocks).then(()=>{
          res.statusCode = 200;
          res.send();
        }).catch((err)=>{
          res.statusCode = 400;
          res.send(err);
        });
        break;}
      default:{
        break;}
    }
  }
  express.post('/createQuestion', parser.array(), createQuestion);
}

module.exports = {setupRoutes};
