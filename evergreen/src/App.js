import React from 'react';
import AceEditor from 'react-ace';

import './App.css';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-dreamweaver";


export default class App extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render(){
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
          </p>
        </div>
        <div className="ide">
          <AceEditor
            mode="java"
            theme="dreamweaver"
            wrapEnabled="true"
            height="80vh"
            width="85vw"
            className="ide-editor"
          />
        </div>
        <div className="scene">
          <img src={require("../src/worst.png")} id="scene"/>
        </div>
      </div>
    );
  } 
}
