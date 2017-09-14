import React, {Component, PropTypes} from 'react';
import Detail from './Detail'

class EmployeeList extends Component {
  render() {
    const {employees} = this.props
    const empList = employees.map((employee, i) => {
      return <Detail data={employee} key={i} />
    })
    return (
      <div>
          {empList}
      </div>
    )
  }
}
const employeeShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  age: PropTypes.string.isRequired
})
EmployeeList.propTypes = {
  employees: PropTypes.arrayOf(employeeShape).isRequired
}


export default EmployeeList;
