import React, { Component } from 'react';
import Moment from 'moment';
const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;

export default class DateEditor extends Component {
  constructor(props) {
    super(props);
    this.state = this.createInitialState(props);
    this.handleChange = this.handleChange.bind(this);
    // console.log(props)
  }

  createInitialState(props) {
    let startValue;

    if (props.keyPress === KEY_BACKSPACE || props.keyPress === KEY_DELETE) {
      // if backspace or delete pressed, we clear the cell
      startValue = '';
    } else if (props.charPress) {
      // if a letter was pressed, we start with the letter
      startValue = props.charPress;
    } else {
      // otherwise we start with the current value
      startValue = props.value;
      
    }

    return {
      value: startValue,
    };
  }

  afterGuiAttached() {
    // get ref from React component
    const eInput = this.refs.input;
    // eInput.focus();
    eInput.select();
  
    }

  getValue() {
    return this.state.value;
  }


  handleChange(event) {
    // console.log(Moment(event.target.value).format('MM/DD/YYYY'))
    // console.lof(event.target.value.format("mm/dd/yyyy"))
    this.setState({ value: Moment(event.target.value).format('yyyy-MM-DD') });
  }


  render() {
    console.log(this.props)
    return (<div>
        <input
        ref="input"
        type="date"
        value={this.state.value}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      /> 
      </div>
    );
  }

}