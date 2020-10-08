import React, { Component } from 'react';
import Header from "./components/Header";
import Form from "./components/Form";
import Count from "./components/Count";
import API from "./utils/API";
import 'office-ui-fabric-react/dist/css/fabric.css';
import "./assets/css/style.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      file: {},
      isParsing: false,
      paper: {}
    };
    this.updateUpload = this.updateUpload.bind(this);
  }

  componentDidMount() {  
    API.getPaper().then(res => {
      if (res.data) {
        this.setState({ paper: res.data });
        API.deletePaper().then(res => {
          console.log("paper completely processed at App.js");
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }

  updateUpload(file) {
    this.setState({
      file: file,
      isParsing: true,
      paper: {}
    });
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="row no-gutters">
            <div className="col-12">
              <h6 className="wordcount-blurb ms-fontSize-14">
                <span className="highlight">
                  Word count is computed by first converting the .PDF file to text using the <span className="command">pdftotext</span> command-line utility, and then running the <span className="command">wc -w</span> command on the output .TXT file
                </span>
              </h6>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-12 col-lg-4 align-self-start">
              <Form updateUpload={this.updateUpload} />
            </div>
            <div className="col-12 col-lg-8">
              <Count
                fileName={this.state.file.name || this.state.paper.fileName}
                isParsing={this.state.isParsing}
                parsedPDF={this.state.paper.parsedPDF}
                wordCount={this.state.paper.wordCount}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
