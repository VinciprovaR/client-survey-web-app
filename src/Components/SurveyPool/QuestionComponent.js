import React, { Fragment } from "react";
import axios from "axios";
import { IonRow, IonCol, IonGrid, IonRadioGroup, IonRadio, IonItem, IonLabel } from "@ionic/react";
import "./surveyPool.css";

class QuestionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { render: false, question: {} };
    this.clickOption = this.clickOption.bind(this);
  }

  componentDidMount() {
    let internalObj = {
      titleQuestion: <IonLabel id={"q" + this.props.questionIndex}>{this.props.question.testo_domanda}</IonLabel>,
      allAnswers: []
    };

    for (let answer of this.props.question.allAnswers) {
        
      internalObj.allAnswers.push(
        <div id={"item" + this.props.question.allAnswers.indexOf(answer)} className="item">
          <div id={this.props.question.allAnswers.indexOf(answer)} onClick={this.clickOption} className="transition option" name={"option"+this.props.questionIndex}>
            <div className="icon-check glyphicon"></div>
          </div>
          <div id="answer" className="answer">
            {answer.testo_risposta}
          </div>
        </div>
      );
    }

    this.setState({ render: true, question: internalObj });
  }

  clickOption(event) {
    event.preventDefault();
    event.persist();
    let elementChecked = document.getElementsByName("option"+this.props.questionIndex);


    for (let i = 0; i < elementChecked.length; i++) {
      if (elementChecked[i].classList.value.indexOf("active") >= 0) {
        elementChecked[i].classList.remove("active");
        elementChecked[i].children[0].classList.remove("glyphicon-ok");
      }
    }
    event.target.classList.add("active");
    event.target.children[0].classList.add("glyphicon-ok");

    let resultData = {
        "id": this.props.question.id,
        "testo_domanda": this.props.question.testo_domanda,
        "created_by": this.props.question.created_by,
        "created_date": this.props.question.created_date,
        "last_modified_by": this.props.question.last_modified_by,
        "last_modified_date": this.props.question.last_modified_date,
        "answer": this.props.question.allAnswers[event.target.id]
    }

    this.props.buildResultObject(resultData, this.props.questionIndex)
  }

  render() {
    if (this.state.render) {
      return (
        <IonGrid className="main-container">
          <IonRow>
            <IonCol sizeXs="12" sizeSm="12" sizeMd="10" sizeLg="10" sizeXl="10" offsetLg="1" offsetMd="1" offsetXl="1" className="container-question">
              <IonRow>
                <IonCol sizeXs="12" sizeSm="12" sizeMd="12" sizeLg="12" sizeXl="12" className="title-question-container">
                  {this.state.question.titleQuestion}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol sizeXs="12" sizeSm="12" sizeMd="12" sizeLg="12" sizeXl="10" className="answers-container">
                  {this.state.question.allAnswers}
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      );
    } else {
      return <Fragment></Fragment>;
    }
  }
}

export default QuestionComponent;
