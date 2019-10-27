import React from 'react';
import AceEditor from 'react-ace';
import { getPound, getMetric } from './network/backend.js'
import InputPanel from "./InputPanel.js"
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';
import WebFont from 'webfontloader';

import './App.css';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-dreamweaver";
import { styled } from '@material-ui/core';

WebFont.load({
  google: {
    families: ['Lato:400,900', 'sans-serif']
  }
});

const styles = ({
  root: {
    flexGrow: 1,
    padding: 25,
  },
  outer: {

  },
});

class App extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
        code: '',
        typing: false,
        typingTimeout: 0,
        pounds: 0,
        requests_per_day: 100,
        machine: "local"
    }
  }

  onInputPanel(machine, requests_per_day) {
    this.setState({
      machine: machine,
      requests_per_day: requests_per_day
    })
    this.makeRequest(requests_per_day, machine)
  }

  makeRequest(requests_per_day, machine) {
    getPound(this.state.code, requests_per_day, machine)
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.setState({ pounds: data.pounds })

        getMetric(data.pounds)
          .then(response => {
            return response.json()
          })
          .then(data => {
            this.setState({ impacts: data.impacts })
          })
      })
  }

  onEditorChange(newValue) {
    newValue = newValue.replace(/"/g, "'");
    if (this.state.typingTimeout) {
       clearTimeout(this.state.typingTimeout);
    }
    console.log(newValue)
    const self = this
    this.setState({
       code: newValue,
       typing: false,
       typingTimeout: setTimeout(function () {
           self.makeRequest(self.state.requests_per_day, self.state.machine);
         }, 2000)
    });
  }

  handleClick() {
    const sceneFadeOut = document.getElementById('scene');
    sceneFadeOut.classList.toggle('scene-leave');
    const sceneFadeIn = document.getElementById('next-scene');
    sceneFadeIn.classList.toggle('scene-come');
  }

  render() {
    const { classes } = this.props

    return (
      <div className="App">
        <header className="header">
          <img
              src={require("../src/evergreenlogo.png")}
              id="logo"
          />
          <p>
            EVERGREEN
          </p>
        </header>

        <div className="ide">
          <Grid container direction="row" className={classes.outer}>
            <Grid item xs={8}>
              <AceEditor
                mode="java"
                value={this.state.code}
                theme="dreamweaver"
                wrapEnabled="true"
                height="86vh"
                width="60vw"
                onChange={this.onEditorChange.bind(this)}
                className="ide-editor"
                fontSize={18}
              />
            </Grid>
            <Grid item xs={4}>
              <InputPanel
                pounds={this.state.pounds}
                impacts={this.state.impacts}
                onChange={this.onInputPanel.bind(this)}
              />
            </Grid>
          </Grid>
        </div>
        <div className="scenediv">
            <img
              src={require("../src/best.png")}
              id="scene"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/worst.png")}
              id="next-scene"
              onClick={() => this.handleClick()}
            />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App)
