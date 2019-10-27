import React from 'react';
import AceEditor from 'react-ace';
import { getPound, getMetric } from './network/backend.js'
import InputPanel from "./InputPanel.js"
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';
import WebFont from 'webfontloader';

import './App.css';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
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
        }, 400)
    } else if(this.state.animation_stage_cur < this.state.animation_stage) {
      setTimeout(function () {
          self.incrementAnimationStage();
        }, 600)
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
    this.setState({ animation_stage: this.state.animation_stage + 15})
    var self = this
        setTimeout(function () {
            self.respondToStage();
          }, 400)
    // const sceneFadeOut = document.getElementById('scene');
    // sceneFadeOut.classList.toggle('scene-leave');
    // const sceneFadeIn = document.getElementById('next-scene');
    // sceneFadeIn.classList.toggle('scene-come');
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
                mode="python"
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
            {/* Tree Animations */}
            <img
              src={require("../src/treeBack2.png")}
              id="art"
              className={this.state.animation_stage_cur <= 1 ? 'slideIn' : 'slideOut'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/treeBack4.png")}
              id="art"
              className={this.state.animation_stage_cur <= 3 ? 'slideIn' : 'slideOut'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/treeBack6.png")}
              id="art"
              className={this.state.animation_stage_cur <= 5 ? 'slideIn' : 'slideOut'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/treeBack7.png")}
              id="art"
              className={this.state.animation_stage_cur <= 6 ? 'slideIn' : 'slideOut'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/backGood.png")}
              id="art-scene"
              className= "fadeIn"
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/treeFront3.png")}
              id="art"
              className={this.state.animation_stage_cur <= 2 ? 'slideIn' : 'slideOut'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/treeFront5.png")}
              id="art"
              className={this.state.animation_stage_cur <= 4 ? 'slideIn' : 'slideOut'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/frontGood.png")}
              id="art-scene"
              className= "fadeIn"
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />

            {/* Factory Animations */}
            <img
              src={require("../src/factoryBack10.png")}
              id="art-factory"
              className={this.state.animation_stage_cur <= 9 ? 'slideOut' : 'slideIn'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/factoryBack11.png")}
              id="art-factory"
              className={this.state.animation_stage_cur <= 10 ? 'slideOut' : 'slideIn'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/backBad.png")}
              id="art-factory-scene"
              className={this.state.animation_stage_cur >= 7 ? 'fadeIn' : 'fadeOut'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/factoryFront8.png")}
              id="art-factory"
              className={this.state.animation_stage_cur <= 7 ? 'slideOut' : 'slideIn'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/factoryFront9.png")}
              id="art-factory"
              className={this.state.animation_stage_cur <= 8 ? 'slideOut' : 'slideIn'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />
            <img
              src={require("../src/frontBad.png")}
              id="art-factory-scene"
              className={this.state.animation_stage_cur >= 7 ? 'fadeIn' : 'fadeOut'}
              alt="stop warning me"
              onClick={() => this.handleClick()}
            />

        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App)
