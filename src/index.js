import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "glyphicons-only-bootstrap/css/bootstrap.css";
import ClientSurvey from './ClientSurvey';

const index = (
    <div id="index">
      <ul >
        <li><a href="surveyPool">Sondaggio</a></li>
        <li><a href="report">Report Ufficio Marketing</a></li>
        <li><a href="survey">Questionario Ufficio Copywriter</a></li>
      </ul>
    </div>)

ReactDOM.render(<ClientSurvey index={index}/>, document.getElementById('root'));

