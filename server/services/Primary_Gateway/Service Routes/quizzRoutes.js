'use strict';
/**
 * setup routes to the authentication service
 */
const Auth = require('../../common/ServiceInterfaces/Authentication')
    .Authentication;

    const Quizz = require('../../common/ServiceInterfaces/QuizzInterface')
    .QuizzInterface;

/**
 * setup routes to the accounts service
 * @param {Object} express express application object
 * @param {Object} parser multer parser object
 */

function setupRoutes(express, parser) {
    /**
   * function for the profile fetching endpoint
   * @param {Object} req request object
   * @param {Object} res response object
   */
    function createQuestion(req, res) {
        const jwt = req.headers['auth'];
        const description = req.body['description'];
        const type = req.body['type'];
        const score = req.body['score'];
       
        if (type == 'OpenAnswer'){
            Quizz.createQuestion(jwt, description, type, score).then((data)=>{
                res.statusCode = 200;
                res.send(data);
            }).catch((err)=>{
                res.statusCode = 400;
                res.send(err);
            });
        }
        else {
            const other = req.body['other'];
            Quizz.createQuestion(jwt, description, type, score, other).then((data)=>{
                
                res.statusCode = 200;
                res.send(data);
            }).catch((err)=>{
                res.statusCode = 400;
                res.send(err);
            });
        }
    }
    express.post('/createQuestion', parser.array(), createQuestion);


    function getQuiz(req, res)
    {
        const jwt = req.headers['auth'];
        
    }
}
  
  module.exports = {setupRoutes};
