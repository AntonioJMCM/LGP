'use strict';
const request = require('request-promise');

const endpoints = {
    createQuestion: '/createQuestion',
};

class QuizzInterface {
    static createQuestion(jwt, description, type, score, other = null){
        const host = process.env.QUIZZ_HOST;
        const port = process.env.QUIZZ_PORT;
        const endpoint = host + ':' + port + endpoints.createQuestion;
        console.log(jwt);
        const options = {
            uri: endpoint,
            json: true,
            headers: {
                auth: jwt,
            },
            form: {
                description: description,
                type: type,
                score: score,
            },
        };
        switch (options.type) {
            case 'TrueOrFalse':
                options.form.response = other;
                break;
            case 'MultipleChoice':
                options.form.choices = other;
                break;
            case 'Puzzle':
                options.form.pieces = other;
                break;
            case 'Link':
                options.form.response = other;
                break;
            case 'CompleteText':
                options.form.text = other;
                break;
            case 'OrderBlocks':
                options.form.blocks = other;
            default:
                break;
        }
        return request.post(options);
    }
}

module.exports = {QuizzInterface};