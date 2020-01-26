import React, { Fragment } from "react";
import SurveyPool from "./Components/SurveyPool/SurveyPool";
import Report from "./Components/Report/Report";
import Survey from "./Components/Survey/Survey";

const paths = {
  root: "/",
  survey: "/survey",
  report: "/report",
  surveyPool: "/surveyPool"
};

class ClientSurvey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pathName: window.location.pathname
    };
  }

  componentDidMount() {}

  render() {
    let renderedComponent = null;
    if (this.state.pathName === paths.root) {
      renderedComponent = this.props.index;
    } else if (this.state.pathName === paths.surveyPool) {
      renderedComponent = <SurveyPool />;
    } else if (this.state.pathName === paths.report) {
      renderedComponent = <Report />;
    } else if (this.state.pathName === paths.survey) {
      renderedComponent = <Survey />;
    } else {
      renderedComponent = <div>NOT FOUND!</div>;
    }

    return <Fragment>{renderedComponent}</Fragment>;
  }
}

export default ClientSurvey;
