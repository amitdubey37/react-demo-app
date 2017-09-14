import React, { Component } from 'react';
import Form from './components/form';
import RefDemo from './components/form/refs';
import ProgressBar from './components/prop-validation/ProgressBar'
import EmployeeList from './components/EmployeeList'
import ReactForm from './components/ReactForm'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
        heading: 'Login Form'
      }

  }
  render() {
    const list = [{
      id: 123,
      name: 'Amit',
      age: 26
    },
    {
      id: 25,
      name: 'Yatin',
      age: 28
    },
  ]
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">

        </p>
        <EmployeeList employees={list}/ >
        

      </div>
    );
  }
}

export default App;
