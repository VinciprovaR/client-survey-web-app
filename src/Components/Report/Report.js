import React, { Fragment } from "react";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import "./Report.css";
import axios from "axios";
import Chart from "chart.js";
import ChartDataLabels from "chart.js";

const URL = {
  report: "http://192.168.1.100:2000/report/calculateCurrentReport"
};

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      charts: [],
      result: null
    };
    this.result = "";
    this.buildCharts = this.buildCharts.bind(this);
    this.chartsIst = [];
  }

  componentDidMount() {
    axios
      .get(URL.report)
      .then(result => {
        let keys = Object.keys(result.data);
        let charts = [];
        keys.forEach((e, i) => {
          charts.push(
            <IonCol className="container-q" sizeXs="12" sizeSm="12" sizeMd="12" sizeLg="5" sizeXl="5" offsetLg="1" offsetXl="1">
              <div className="title-q">{e}</div>
              <canvas className="chart" id={"pieChart" + i}></canvas>
            </IonCol>
          );
        });

        this.setState({ charts: charts, result: result });
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentDidUpdate() {
    let result = document.getElementById("result");
    result.classList.replace("result-blocked", "result-hidden");

    setTimeout(() => {
      result.classList.replace("result-hidden", "result-show");
      this.buildCharts();
    }, 50);
  }

  buildCharts() {
    for (let i = 0; i < Object.keys(this.state.result.data).length; i++) {
      let data = [];
      let labels = [];
      let q = this.state.result.data[Object.keys(this.state.result.data)[i]];

      for (let a of Object.keys(q)) {
        data.push(q[a]);
        labels.push(a + " " + q[a] + "%");
      }
      var ctxP = document.getElementById("pieChart" + i).getContext("2d");
      var c = new Chart(ctxP, {
        plugins: [ChartDataLabels],
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
              hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
            }
          ]
        },
        options: {
          responsive: true,
          legend: {
            position: "right",
            labels: {
              padding: 20,
              boxWidth: 10
            }
          },
          plugins: {
            datalabels: {
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                  sum += data;
                });
                let percentage = ((value * 100) / sum).toFixed(2) + "%";
                return percentage;
              },
              color: "white",
              labels: {
                title: {
                  font: {
                    size: "1"
                  }
                }
              }
            }
          }
        }
      });
      this.chartsIst.push(c);
    }

    console.log(this.chartsIst);
  }

  render() {
    return (
      <IonGrid id="result" className="result-blocked">
        <IonRow>
          <IonCol sizeXs="12" sizeSm="12" sizeMd="12" sizeLg="11" sizeXl="11">
            <div className="title-report">Gli altri utenti hanno risposto:</div>
            <IonRow>{this.state.charts}</IonRow>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }
}

export default Report;
