import React, { Fragment } from "react";
import axios from "axios";
import QuestionComponent from "./QuestionComponent"
import "./surveyPool.css";

const URL = {
  getAllQuestionAndAnswer: "http://192.168.1.100:2000/surveyPool/getAllQuestionAndAnswer",
  createResultSurvey: "http://192.168.1.100:2000/survey/createResultSurvey"
};

class SurveyPool extends React.Component {
  constructor(props) {
    super(props);
    this.state = { render: false, currentQuestionIndex: 0, questionsComponentsArray: [] };
    this.buildResultObject = this.buildResultObject.bind(this);
    this.submit = this.submit.bind(this);
    this.resultObject = {};
    
  }

  componentDidMount() {
    axios
      .get(URL.getAllQuestionAndAnswer)
      .then(result => {
        console.log(result);
        let questionsComponentsArray = [];
        
        for(let question of result.data){
            let component = (
                <div id={"questionComponent"+ result.data.indexOf(question)}>
            <QuestionComponent buildResultObject={this.buildResultObject} question={question} questionIndex={result.data.indexOf(question)}/>
            </div>
            )
            questionsComponentsArray.push(component);
        }
    
        this.setState({ render: true, questionsComponentsArray: questionsComponentsArray  });
      })
      .catch(error => {
        console.error(error);
      });
  }

  submit(){
    let submitObj = {
        "resultSurvey": []
    }
    let keys = Object.keys(this.resultObject)
    for(let k of keys){
        submitObj.resultSurvey.push(this.resultObject[k]);
    }
    axios.post(URL.createResultSurvey, {resultSurvey: submitObj.resultSurvey}).then(result=>{
        console.log("ok")
    }).catch(error=>{
        console.error(error);
    })
  }

  buildResultObject(obj, index){

    if(this.resultObject.hasOwnProperty(index)){
        this.resultObject[index] = obj;
    }
    else{
        this.resultObject[index] = {}
        this.resultObject[index] = obj;
    }
    
  }


  render() {
    if (this.state.render) {
      return (
        <Fragment>
          <div id="SurveyPool">Sondaggio Utente</div>
          <div id="main-questions-container">
        {this.state.questionsComponentsArray}
        </div>
        <div>
            <button onClick={this.submit}>Clicca</button>
        </div>
        </Fragment>
      );
    } else {
      return <Fragment></Fragment>;
    }
  }
}

export default SurveyPool;
