import React, {Component} from 'react';
import {PropTypes, number, shape, string} from 'prop-types'

class Detail extends Component {
  render() {
    const {data} = this.props
    return (
      <div>
        <p>Id: {data.id}</p>
        <p>Name: {data.name}</p>
        <p>Age: {data.age}</p>
      </div>
    )
  }
}

Detail.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired
  }).isRequired
}

export default Detail;
