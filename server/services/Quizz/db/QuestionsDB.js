'use strict';
const Mongo = require('../../common/mongodb/Mongo').Mongo;

/**
 * This class encapsulates quizz interaction with the database
 */
class QuestionsDB {

  /**
   *
   * @param {Mongo} dbCon
   * @param {string} description
   * @param {string} type
   * @param {number} score
   * @param {boolean} response
   * @return {Promise}
   */
   static createTrueOrFalse(dbCon, description, score, response){
      const data = {
        description: description,
        type: 'TrueOrFalse',
        score: score,
        response: response,
      };
      return dbCon.insertDataObject('questions', data);
    }

    /**
     *
     * @param {Mongo} dbCon
     * @param {string} description
     * @param {string} type
     * @param {number} score
     * @param {object} choices
     * @return {Promise}
     */
    static createMultipleChoice(dbCon, description, score, choices){
       const data = {
         description: description,
         type: 'MultipleChoice',
         score: score,
         choices: choices,
       };
       return dbCon.insertDataObject('questions', data);
     }

     /**
      *
      * @param {Mongo} dbCon
      * @param {string} description
      * @param {string} type
      * @param {number} score
      * @return {Promise}
      */
     static createOpenAnswer(dbCon, description, score){
        const data = {
          description: description,
          type: 'OpenAnswer',
          score: score,
        };
        return dbCon.insertDataObject('questions', data);
      }

      /**
       *
       * @param {Mongo} dbCon
       * @param {string} description
       * @param {string} type
       * @param {number} score
       * @param {object} pieces
       * @return {Promise}
       */
      static createPuzzle(dbCon, description, score, pieces){
         const data = {
           description: description,
           type: 'Puzzle',
           score: score,
           pieces: pieces,
         };
         return dbCon.insertDataObject('questions', data);
       }

       /**
        *
        * @param {Mongo} dbCon
        * @param {string} description
        * @param {string} type
        * @param {number} score
        * @param {object} response
        * @return {Promise}
        */
       static createLink(dbCon, description, score, response){
          const data = {
            description: description,
            type: 'Link',
            score: score,
            response: response,
          };
          return dbCon.insertDataObject('questions', data);
        }

        /**
         *
         * @param {Mongo} dbCon
         * @param {string} description
         * @param {string} type
         * @param {number} score
         * @param {string} text
         * @return {Promise}
         */
        static createCompleteText(dbCon,internalID, description, score, text){
           const id = Mongo.generateRandomUUID();
           const data = {
            _id: id,
            description: description,
            type: 'CompleteText',
            score: score,
            text: text,
           };
           return dbCon.insertDataObject('questions', data);
         }

         /**
          *
          * @param {Mongo} dbCon
          * @param {string} description
          * @param {string} type
          * @param {number} score
          * @param {object} blocks
          * @return {Promise}
          */
         static createOrderBlocks(dbCon, description, score, blocks){
            const id = Mongo.generateRandomUUID();
            const data = {
              description: description,
              type: 'OrderBlocks',
              score: score,
              blocks: blocks,
            };
            return dbCon.insertDataObject('questions', data);
          }
}

module.exports = {QuestionsDB};
