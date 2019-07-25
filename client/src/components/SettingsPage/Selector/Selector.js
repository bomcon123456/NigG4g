import React, { Component } from 'react'

export default class Selector extends Component {
  constructor(props) {
    super(props)
    this.selectVal = null;

  }

  render() {
    return (
      <select name={this.props.name} value={this.props.optionValue} onChange={this.props.handleSelector}>
        <option value="true" >On</option>
        <option value="false">Off</option>
      </select>
    )
  }
}
