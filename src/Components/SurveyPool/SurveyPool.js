import React, { Fragment } from "react";
import axios from "axios";
import QuestionComponent from "./QuestionComponent";
import "./surveyPool.css";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import Report from "../Report/Report";

const URL = {
  getAllQuestionAndAnswer: "http://192.168.1.100:2000/surveyPool/getAllQuestionAndAnswer",
  createResultSurvey: "http://192.168.1.100:2000/survey/createResultSurvey",
  report: "http://192.168.1.100:2000/report/calculateCurrentReport"
};

class SurveyPool extends React.Component {
  constructor(props) {
    super(props);
    this.state = { render: false, totalElement: 0, questionsComponentsArray: [], finalRender: false };
    this.buildResultObject = this.buildResultObject.bind(this);
    this.submit = this.submit.bind(this);
    this.resultObject = {};
    this.currentElementPosition = 0;
    this.nextPrev = this.nextPrev.bind(this);
    this.elmentedSelected = 0;
  }

  componentDidUpdate() {
    this.next = document.getElementById("next");
    this.prev = document.getElementById("prev");
    this.submit = document.getElementById("submit");
    this.result = document.getElementById("result");
    this.good = document.getElementById("good");
    this.good2 = document.getElementById("good2");
    this.contanerFinal = document.getElementById("contaner-final");
  }

  componentDidMount() {
    axios
      .get(URL.getAllQuestionAndAnswer)
      .then(result => {
        let questionsComponentsArray = [];

        for (let question of result.data) {
          let visibility = "";
          if (result.data.indexOf(question) !== 0) {
            visibility = "hidden-content";
          } else {
            visibility = "show-content";
          }
          let component = (
            <div className={visibility} id={"questionComponent" + result.data.indexOf(question)}>
              <QuestionComponent buildResultObject={this.buildResultObject} question={question} questionIndex={result.data.indexOf(question)} />
            </div>
          );
          questionsComponentsArray.push(component);
        }

        this.setState({ render: true, totalElement: result.data.length, questionsComponentsArray: questionsComponentsArray });
      })
      .catch(error => {
        console.error(error);
      });
  }

  submit() {
    if (this.elmentedSelected >= this.state.totalElement) {
      let submitObj = {
        resultSurvey: []
      };
      let keys = Object.keys(this.resultObject);
      for (let k of keys) {
        submitObj.resultSurvey.push(this.resultObject[k]);
      }

      axios
        .post(URL.createResultSurvey, { resultSurvey: submitObj.resultSurvey })
        .then(result => {
          let final = document.getElementById("all-container");
          final.classList.add("finish");
          setTimeout(() => {
            final.classList.add("hidden-content");
            this.contanerFinal.classList.replace("result-blocked", "result-hidden");
            this.contanerFinal.classList.replace("result-hidden", "result-show");
            this.good.classList.replace("result-hidden", "result-show");

            setTimeout(() => {
              this.good2.classList.replace("result-hidden", "result-show");
              setTimeout(() => {
                this.contanerFinal.classList.replace("result-show", "result-hidden");
                this.good.classList.replace("result-show", "result-hidden");
                this.good2.classList.replace("result-show", "result-hidden");
                setTimeout(() => {
                  this.setState({ render: false, finalRender: true });
                }, 1500);
              }, 2200);
            }, 700);
          }, 300);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  buildResultObject(obj, index, check) {
    if (this.resultObject.hasOwnProperty(index)) {
      this.resultObject[index] = obj;
    } else {
      this.resultObject[index] = {};
      this.resultObject[index] = obj;
    }
    if (check) {
      this.elmentedSelected++;
      let p = document.getElementById("progress");
      let r = (this.elmentedSelected / this.state.totalElement) * 100;
      if (r === 100) {
        this.submit.classList.add("pulse");
        p.classList.add("success");
      }
      p.style = "width: " + r + "%";
    }
    if (this.elmentedSelected >= this.state.totalElement) {
      this.submit.classList.remove("button-not-ok");
      this.submit.classList.add("button-ok");
    }
  }

  nextPrev(event) {
    event.preventDefault();
    event.persist();
    let nextElement = null;
    let currentElement = document.getElementById("questionComponent" + this.currentElementPosition);
    if (event.target.id === "next" && this.currentElementPosition !== this.state.totalElement - 1) {
      nextElement = document.getElementById("questionComponent" + (this.currentElementPosition + 1));
      currentElement.classList.replace("show-content", "hidden-content");
      nextElement.classList.replace("hidden-content", "show-content");
      this.currentElementPosition += 1;
    } else if (event.target.id === "prev" && this.currentElementPosition !== 0) {
      nextElement = document.getElementById("questionComponent" + (this.currentElementPosition - 1));
      currentElement.classList.replace("show-content", "hidden-content");
      nextElement.classList.replace("hidden-content", "show-content");
      this.currentElementPosition -= 1;
    }

    if (this.currentElementPosition > 0 && this.currentElementPosition < this.state.totalElement - 1) {
      this.next.classList.replace("button-not-ok", "button-ok");
      this.prev.classList.replace("button-not-ok", "button-ok");
    }
    if (this.currentElementPosition === this.state.totalElement - 1) {
      this.next.classList.replace("button-ok", "button-not-ok");
    }
    if (this.currentElementPosition === 0) {
      this.next.classList.replace("button-not-ok", "button-ok");
      this.prev.classList.replace("button-ok", "button-not-ok");
    }
  }

  render() {
    if (this.state.render) {
      return (
        <Fragment>
          <div id="all-container" className="main-container">
            <div id="SurveyPool" className="title-survey">
              Rispondi a tutte e {this.state.totalElement} le domande!
            </div>
            <IonGrid>
              <IonRow>
                <IonCol sizeXs="12" sizeSm="12" sizeMd="12" sizeLg="6" sizeXl="6" offsetLg="3" offsetMd="3" offsetXl="3">
                  <div class="progress">
                    <div id="progress" class="progress-bar progress-bar-striped" role="progressbar" style={{ width: "0%" }} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>

            <IonGrid id="buttonContainer" className="button-container">
              <IonRow>
                <IonCol sizeXs="12" sizeSm="12" sizeMd="6" sizeLg="6" sizeXl="6" offsetLg="3" offsetMd="3" offsetXl="3">
                  <IonRow>
                    <IonCol className="button-container" sizeXs="4" sizeSm="4" sizeMd="4" sizeLg="4" sizeXl="4">
                      <button id="prev" className="button-not-ok button" onClick={this.nextPrev}>
                        Precedente
                      </button>
                    </IonCol>

                    <IonCol className="button-container" sizeXs="4" sizeSm="4" sizeMd="4" sizeLg="4" sizeXl="4">
                      <button id="submit" className="button-not-ok button" onClick={this.submit}>
                        Invia
                      </button>
                    </IonCol>
                    <IonCol className="button-container" sizeXs="4" sizeSm="4" sizeMd="4" sizeLg="4" sizeXl="4">
                      <button id="next" className="button-ok button" onClick={this.nextPrev}>
                        Successiva
                      </button>
                    </IonCol>
                  </IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
            <div id="main-questions-container">{this.state.questionsComponentsArray}</div>
          </div>

          <div id="contaner-final" className="final-container-question result-blocked">
            <div id="good" className="result-hidden final-text">
              Molto bene!
            </div>

            <div id="good2" className="result-hidden final-text">
              Ora vediamo cosa hanno risposto gli altri utenti.
            </div>
          </div>
        </Fragment>
      );
    } else if (this.state.finalRender) {
      return <Report />;
    } else {
      return <Fragment></Fragment>;
    }
  }
}

export default SurveyPool;
