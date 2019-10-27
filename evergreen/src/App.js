import React from 'react';
import AceEditor from 'react-ace';
import { getPound, getMetric } from './network/backend.js'
import InputPanel from "./InputPanel.js"
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';

import './App.css';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dreamweaver";
import { styled } from '@material-ui/core';

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
        code: 'def run():\n\tpass',
        typing: false,
        typingTimeout: 0,
        pounds: 0,
        requests_per_day: 100,
        machine: "local",
        animation_stage_cur: 0,
        animation_stage: 0
    }
  }

  onInputPanel(machine, requests_per_day) {
    this.setState({
      machine: machine,
      requests_per_day: requests_per_day
    })
    this.makeRequest(requests_per_day, machine)
  }

  incrementAnimationStage() {
    var cur_stage = this.state.animation_stage_cur + 1
    this.setState({ animation_stage_cur: cur_stage })
    this.respondToStage()
  }

  decrementAnimationStage() {
    var cur_stage = this.state.animation_stage_cur - 1
    this.setState({ animation_stage_cur: cur_stage })
    this.respondToStage()
  }

  respondToStage() {
    var self = this
    if(this.state.animation_stage_cur > this.state.animation_stage) {
      setTimeout(function () {
          self.decrementAnimationStage();
        }, 800)
    } else if(this.state.animation_stage_cur < this.state.animation_stage) {
      setTimeout(function () {
          self.incrementAnimationStage();
        }, 800)
    }
  }

  makeRequest(requests_per_day, machine) {
    getPound(this.state.code, requests_per_day, machine)
      .then(response => {
        return response.json()
      })
      .then(data => {
        var stage = Math.floor( 1 * (Math.log(data.pounds + 1) / Math.log(1.8)));
        console.log(stage)
        this.setState({ pounds: data.pounds, animation_stage: stage })
        var self = this
        setTimeout(function () {
            self.respondToStage();
          }, 400)
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
    this.setState({ animation_stage: this.state.animation_stage + 1})
    // const sceneFadeOut = document.getElementById('scene');
    // sceneFadeOut.classList.toggle('scene-leave');
    // const sceneFadeIn = document.getElementById('next-scene');
    // sceneFadeIn.classList.toggle('scene-come');
  }

  render() {
    const { classes } = this.props

    return (
      <div className="App">
        <header className="App-header">
          <p>
            EVERGREEN LMAOOOO
          </p>
        </header>
        <div className="menu">
          <p>
            menu stuff change language idk
             Pounds: {this.state.pounds}
          </p>
        </div>
        <div className="ide">
          <Grid container direction="row" className={classes.outer}>
            <Grid item xs={8}>
              <AceEditor
                mode="python"
                value={this.state.code}
                theme="dreamweaver"
                wrapEnabled="true"
                height="80vh"
                width="60vw"
                onChange={this.onEditorChange.bind(this)}
                className="ide-editor"
                fontSize={20}
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
              src={require("../src/phase2tree.png")}
              id="art"
              className={this.state.animation_stage_cur <= 2 ? 'slideIn' : 'slideOut'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/phase2.png")}
              id="art"
              className="slideIn"
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />

        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App)
