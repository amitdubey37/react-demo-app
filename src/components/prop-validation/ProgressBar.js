import React, { Component } from 'react';
import PropTypes from 'prop-types';

 class ProgressBar extends Component {
  render() {
    const { total, downloaded, user } = this.props;
    const progress  = (downloaded / total) * 100;
    return (
      <h1> You progress is : { progress } % </h1>
    )
  }
}
ProgressBar.defaultProps ={
  total: 100
};
ProgressBar.propTypes = {
  total: PropTypes.number,
  downloaded: PropTypes.number.isRequired,
}


export default ProgressBar;
