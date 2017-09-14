import React, { Component } from 'react'

export default class Form extends Component {
  constructor(){
    super()
    this.state = {
      name: '',
      pass: '',
      cnf_pass: '',
      message: ''
    }
  }
  handleChange(e) {
    console.log("target",e.target);
    let state = {}
    state[e.target.name] = e.target.value
    this.setState(state)
  }
  handleSubmit (event) {
    event.preventDefault();
    if(!this.state.name){
      this.inputName.focus();
    }
    if(!this.state.name || !this.state.pass || !this.state.cnf_pass){
      this.setState({message: 'All fields are required'})
    }
    else if(this.state.pass !== this.state.cnf_pass){
      this.setState({message: 'passwords do not match!'})
    }
    else {
      this.setState({message: "You're registered"})
    }
  }
  render () {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <p>
          { this.state.message }
        </p>
        <input ref={(name)=>{this.inputName = name}}type='text' name='name' onChange={this.handleChange.bind(this)} value={this.state.name} placeholder="name"/>
        <input type='password' name='pass' onChange={this.handleChange.bind(this)} value={this.state.pass} placeholder="password"/>
        <input type='password' name='cnf_pass' onChange={this.handleChange.bind(this)} value={this.state.cnf_pass} placeholder="confirm your password"/>
        <input type="submit" value="Signup"/>
      </form>
    )
  }
}
