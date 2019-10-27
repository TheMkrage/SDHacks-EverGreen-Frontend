import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles'
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import {
  FoldingCube,
} from 'better-react-spinkit'
import zIndex from '@material-ui/core/styles/zIndex';

const styles = ({
  paper: {
    padding: 25,
    zIndex: 5,
    backgroundColor: "#ffffff90",
  },
  outer: {

  },
  emoji: {
    marginBlockStart: "0.25em",
    marginBlockEnd: "0.25em",
    color: "#484848",
    fontWeight: "normal",
  },
  bigNum: {
    color: "#484848",
    fontSize: "5em",
    marginBlockStart: "0",
    marginBlockEnd: "0",
    fontWeight: "normal",
  },
  smallWord: {
    marginBlockStart: "0",
    marginBlockEnd: "0",
    color: "#777777",
    fontWeight: "normal",
  }
});

class InputPanel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      machine: "local",
      requests_per_day: 100
    }
  }

  handleMachineChange(event) {
    this.setState({ machine: event.target.value })
    this.props.onChange(event.target.value, this.state.requests_per_day)
  }

  handleRequestsPerDayChange(event) {
    this.setState({ requests_per_day: parseInt(event.target.value) })
    this.props.onChange(this.state.machine, parseInt(event.target.value))
  }

  render() {
    const { classes } = this.props
    var counter = 0

    var inputPanel = (
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={0} alignItems="stretch">
          <Grid item container direction="row" spacing={5}  justify="space-evenly" alignItems="center">
            <Grid item xs>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel htmlFor="machine-select">Machine</InputLabel>
                <Select
                  value={this.state.machine}
                  onChange={this.handleMachineChange.bind(this)}
                  inputProps={{
                    name: 'machine',
                    id: 'machine-select',
                  }}
                >
                  <MenuItem value={"local"}>local</MenuItem>
                  <MenuItem value={"a1.medium"}>a1.medium</MenuItem>
                  <MenuItem value={"a1.metal"}>a1.metal</MenuItem>
                  <MenuItem value={"m4.large"}>m4.large</MenuItem>
                  <MenuItem value={"m4d.metal"}>m4d.metal</MenuItem>
                  <MenuItem value={"m5.large"}>m5.large</MenuItem>
                  <MenuItem value={"m5d.metal"}>m5d.metal</MenuItem>
                  <MenuItem value={"t2.2xlarge"}>t2.2xlarge</MenuItem>
                  <MenuItem value={"t2.nano"}>t2.nano</MenuItem>
                  <MenuItem value={"t3.2xlarge"}>t3.2xlarge</MenuItem>
                  <MenuItem value={"t3.nano"}>t3.nano</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs>
              <TextField
                id="requests_per_day"
                label="Requests Per Day"
                fullWidth
                className={classes.textField}
                value={this.state.requests_per_day}
                onChange={this.handleRequestsPerDayChange.bind(this)}
                margin="normal"
              />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )

    var outputPanel = (
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={1} alignItems="stretch" justify="center">

          <Grid item>
            <Typography variant="h6" text-align="left">Analytics</Typography>
          </Grid>

          <Grid item container direction="row" spacing={2} justify="space-between" alignItems="center">
            <Grid item xs container direction="column" alignItems="left" xs={5}>
              <Grid item>
                <p className={classes.smallWord}>Every 24 hours</p> 
              </Grid>
              <Grid item>
                <h1 className={classes.bigNum}> {this.props.pounds} </h1>  
              </Grid>
              <Grid item>
                <h2 className={classes.smallWord}> lbs CO<sub>2<sub> </h2>  
              </Grid>
            </Grid>

            <Grid item container direction="column" xs={7} spacing={-2}>
            {this.props.impacts ? this.props.impacts.map((impact) => {
              var text = ""
              var emoji = ""
              if (counter === 0) {
                  text = "Avg Human Daily Consumption"
                  emoji = "💻 "
              } else if (counter === 1) {
                text = "Flight from LA to NY"
                emoji = "✈️ "
              } else if (counter === 2) {
                  text = "Car Lifetimes"
                  emoji = "🚘 "
              }
              counter++
              return (
                <Grid item container direction="row" spacing={0} alignItems="center">
                  <Grid item xs={5}>
                    <h1 className={classes.emoji}> {emoji} {impact} </h1>
                  </Grid>
                  <Grid item container direction="column" xs={7}>
                    <Grid item>
                      <p className={classes.smallWord}> {text} </p>
                    </Grid>
                  </Grid>
                </Grid>
              )
            }) : null}
            </Grid>
          </Grid>

        </Grid>
      </Paper>
    )
    if(this.props.pounds === 0) {
      outputPanel = (
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={1} alignItems="center" justify="center">
            <Grid item>
              <Typography variant="h2">😞</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">Add or check your code!</Typography>
            </Grid>
          </Grid>
        </Paper>
      )
    }
    if(this.props.isAnalyzing) {
      outputPanel = (
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={1} alignItems="center" justify="center">
            <Grid item>
              <FoldingCube color='#448479' size={50}/>
            </Grid>
            <Grid item>
              <Typography>Analyzing your code...</Typography>
            </Grid>
          </Grid>
        </Paper>
      )
    }
    return (
      <Grid container direction="column" spacing={2} zIndex={10}>
        <Grid item>
          {inputPanel}
        </Grid>
        <Grid item>
          {outputPanel}
        </Grid>
      </Grid>

    )
  }
}

export default withStyles(styles)(InputPanel)
