import React, { Component } from 'react';
export default class MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount(){
    console.log('component is about to mount');
  }
  componentDidMount() {
    this.username.focus();
    console.log('component did mount');
  }
  componentwillreceiveprops(previousProps, nextProps) {
    console.log('previous props', previousProps, nextProps);
  }
  componentShouldUpdate(nextProps, nextState) {
    console.log('calling should component update');
  }
  componentWillUpdate(){
    console.log('component is about to update');
  }
  componentDidUpdate() {
    console.log('component updated');
  }
  handleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }
  handleSubmit(e){
    e.preventDefault();
    if(!this.state.username) {
      this.setState({userError: 'UserName cannot be blank'});
    }
    console.log('form submitted with', this.state.username, this.state.password);

  }

  render() {
    return (
      <div>
      <h1> {this.props.heading}</h1>
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.username} onChange={this.handleChange} name="username" ref={(username) => this.username = username}/>
        <p>{this.state.userError} </p>
        <input type="text" value={this.state.password} onChange={this.handleChange} name="password"/>
        <input type="submit" value="submit"/>
      </form>
      </div>
    )
  }
}
