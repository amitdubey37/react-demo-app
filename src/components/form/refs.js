import React from 'react';
import ReactDOM from 'react-dom';

export default class RefDemo extends React.Component {

   constructor(props) {
      super(props);

      this.state = {
         data: ''
      }

      this.updateState = this.updateState.bind(this);
      this.clearInput = this.clearInput.bind(this);
   };

   updateState(e) {
      this.setState({data: e.target.value});
   }

   clearInput() {
      // this.setState({data: ''});
      this.input.focus();
      this.input.select();
   }

   render() {
      return (
         <div>
            <input value = {this.state.data} onChange = {this.updateState}
               ref={(myInput) => {this.input = myInput}}></input>
            <button onClick = {this.clearInput}>CLEAR</button>
            <h4>{this.state.data}</h4>
         </div>
      );
   }
}
