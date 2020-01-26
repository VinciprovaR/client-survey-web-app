import React from "react";

class Report extends React.Component {
    constructor(props) {
      super(props);
      this.state = {

      }
    }
  
    componentWillMount(){
      console.log(this.state)
    }
  
    render() {
      return <div id="Report">Report</div>;
    }
  }

export default Report;