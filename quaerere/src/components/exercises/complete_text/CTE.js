import React, { Component } from 'react';
const request = require('request-promise');
const configs = require('../../../utils/globalConfigs').configs;

class CTE extends Component {

handleSubmit(event)
{
  event.preventDefault();
  let description = document.getElementById("descriptionID").nodeValue;
  let score = document.getElementById("scoreID").nodeValue;
  let textData = document.getElementById("textDataID").nodeValue;

  const endpoint = configs.SERVER_HOST+":"+configs.SERVER_PORT+"/createQuestion";
  const session = document.session;
  const options = {
    url: endpoint,
    headers: {
      auth: session,
    },
    form: {
       description: description,
       type:  "CompleteText",
       score: score,
       other: textData,
    }
  };
  return request.post(options);
}

    render() {
      //if student
      return (
          <div id="CreateCPT">
            <h1>Create your text completion exercise</h1>
            <h2>Use [*XXX*] to create an empty line, replace the X with the wanted word</h2>
            
            <form onSubmit={this.handleSubmit}>
              <label>
                Descrição
                <input id="descriptionID" type="textarea" required></input>
              </label>
              <label>
                Texto
                <input id="textDataID" type="textarea" required></input>
              </label>
              <label>
                Pontuação
                <input id="scoreID" type="text" required></input>
              </label>
              <input type="submit"></input>
            </form>
          </div>
      );
  
    }
  }

export default CTE;