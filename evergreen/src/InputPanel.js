import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default class InputPanel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      machine: "local"
    }
  }

  handleMachineChange(newValue) {
    console.log(newValue)
    this.setState({ machine: newValue })
  }

  render() {
    return (
      <Paper>
        <Grid container direction="column">
          <Select
            value={this.state.machine}
            onChange={this.handleMachineChange.bind(this)}
            inputProps={{
              name: 'age',
              id: 'age-simple',
            }}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </Grid>

        InputPanel
      </Paper>
    )
  }
}
