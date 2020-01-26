import React from "react";

class Survey extends React.Component {
    constructor(props) {
      super(props);
      this.state = {

      }
    }
  
    componentWillMount(){
      console.log(this.state)
    }
  
    render() {
      return <div id="Survey">Survey</div>;
    }
  }

export default Survey;