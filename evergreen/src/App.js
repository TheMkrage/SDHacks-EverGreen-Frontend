import React from 'react';
import AceEditor from 'react-ace';
import { getPound } from './network/backend.js';
import InputPanel from "./InputPanel.js";
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';

import './App.css';

import "ace-builds/src-noconflict/mode-java";
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
        code: '',
        typing: false,
        typingTimeout: 0,
        pounds: 0
    }
  }

  onTypingEnded() {
    console.log("typing ended!")
    getPound(this.state.code, 100, "local")
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        this.setState({ pounds: data.pounds })
      })
  }

  onEditorChange(newValue) {

    if (this.state.typingTimeout) {
       clearTimeout(this.state.typingTimeout);
    }

    console.log(newValue)
    const self = this
    this.setState({
       code: newValue,
       typing: false,
       typingTimeout: setTimeout(function () {
           self.onTypingEnded();
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
            <Grid item xs={10}>
              <AceEditor
                mode="java"
                value={this.state.code}
                theme="dreamweaver"
                wrapEnabled="true"
                height="80vh"
                width="78vw"
                onChange={this.onEditorChange.bind(this)}
                className="ide-editor"
              />
            </Grid>
            <Grid item xs={2}>
              <InputPanel />
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
