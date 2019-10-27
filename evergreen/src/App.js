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
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

WebFont.load({
  google: {
    families: ['Lato:400,900', 'sans-serif']
  }
});

const styles = ({
  popover: {
    //pointerEvents: 'none'
  },
  paper: {
    padding: 5,
    //pointerEvents: 'none'
  },
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
        animation_stage: 0,
        animation_timeout: 9,
        markers: [],
        isAnalyzing: true
    }
    this.makeRequest(100, "local")
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
      this.setState({
        animation_timeout: setTimeout(function () {
            self.decrementAnimationStage();
          }, 200)
      })

    } else if(this.state.animation_stage_cur < this.state.animation_stage) {
      this.setState({
        animation_timeout: setTimeout(function () {
            self.incrementAnimationStage();
          }, 200)
      })
    }
  }

  makeRequest(requests_per_day, machine) {
    this.setState({
      isAnalyzing: true,
    })
    getPound(this.state.code, requests_per_day, machine)
      .then(response => {
        return response.json()
      })
      .then(data => {
        var stage = Math.floor( 1 * (Math.log(data.pounds + 1) / Math.log(1.8)));
        var suggestions = data.suggestions
        var markers = suggestions.map(s => { return { startRow: s.start - 1, startCol: 0, endRow: s['end'], endCol: 0, className: 'error-marker', type: 'background', line: s.line }})
        console.log(markers)
        if (this.state.animation_timeout) {
           clearTimeout(this.state.animation_timeout);
        }
        this.setState({
          pounds: data.pounds,
          animation_stage: stage,
          markers: markers,
          impacts: data.impacts,
          isAnalyzing: false,
          animation_timeout: setTimeout(function () {
              self.respondToStage();
            }, 100)
        })
        var self = this

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
       isAnalyzing: true,
       typingTimeout: setTimeout(function () {
           self.makeRequest(self.state.requests_per_day, self.state.machine);
         }, 1000)
    });
  }

  handleClick() {
    // const sceneFadeOut = document.getElementById('scene');
    // sceneFadeOut.classList.toggle('scene-leave');
    // const sceneFadeIn = document.getElementById('next-scene');
    // sceneFadeIn.classList.toggle('scene-come');
  }

  handleAccept(key) {
    var marker = this.state.markers[key]
    var new_code = this.state.code.split('\n')
    var new_code_with_modification = new_code.slice(0, marker.startRow).concat(marker.line.split('\n'), new_code.slice(marker.endRow))

    var s = this.state.markers
    delete s[key]
    var s_filtered = s.filter(function (el) {
      return el != null;
    });
    var n = new_code_with_modification.join('\n')
    this.setState({ code: n, markers: s_filtered })
    this.onEditorChange(n)
  }

  handleReject(key) {
    console.log("No")
    console.log(key)
    var s = this.state.markers
    delete s[key]
    var s_filtered = s.filter(function (el) {
      return el != null;
    });
    this.setState({ markers: s_filtered })
    console.log(s_filtered)
  }

  render() {
    const { classes } = this.props
    var docs = document.getElementsByClassName('error-marker')
    var docs_filter = Array.prototype.filter.call(docs, function(testElement){
      return testElement.outerHTML.includes('start');
    });


    if(docs_filter.length === 0 && this.state.markers.length !== 0) {
      var self = this
      setTimeout(function () {
          self.setState({ state: self.state });
        }, 100)
    }

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
                fontSize={17}
                annotations={[{ row: 0, column: 2, type: 'checkmark', text: 'Some error.'}]}
                markers={this.state.markers}
              />

            {docs_filter.length > 0 ?
              Object.keys(docs_filter).map(key => {
                if(key >= this.state.markers.length) {
                  return null
                }
                var el = docs_filter[key]

                return (
                  <Popper
                    className={classes.popover}
                    open
                    anchorEl={el}
                    placement="bottom-end"
                    key={key}
                    modifiers={{
                      arrow: {
                        enabled: true
                      }
                    }}
                  >
                    <Paper className={classes.paper}>
                      {this.state.markers[key].line}
                      <IconButton className={classes.button} aria-label="Accept" onClick={() => this.handleAccept(key)}>
                        <CheckIcon/>
                      </IconButton>
                      <IconButton className={classes.button} aria-label="Reject" onClick={() => this.handleReject(key)}>
                        <CloseIcon/>
                      </IconButton>
                    </Paper>
                  </Popper>
                )
              }) : null}
            </Grid>
            <Grid item xs={4}>
              <InputPanel
                pounds={this.state.pounds}
                impacts={this.state.impacts}
                onChange={this.onInputPanel.bind(this)}
                isAnalyzing={this.state.isAnalyzing}
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
