import React, { Component } from 'react'

export default class Keys extends Component {
   constructor(props) {
      super(props);

      this.state = {
         users: ['Chandler', 'Monica', 'Ross', 'Pheobe', 'Rachel']
      }
   }
   render() {
     let userList  =  this.state.users.map((user,i) => {
       return <li key={i}> {user} </li>
     })
      return (
         <div>
            {userList}
         </div>
      );
   }
}
