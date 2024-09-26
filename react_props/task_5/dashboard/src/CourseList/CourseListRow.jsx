import PropTypes from 'prop-types';

function CourseListRow({ 
  isHeader = false, 
  textFirstCell = '', 
  textSecondCell = null 
}) {
  return (
    isHeader ? (
      <tr>
        <th colSpan={textSecondCell ? 1 : 2}>{textFirstCell}</th>
        {textSecondCell ? <th>{textSecondCell}</th> : null}
      </tr>
    ) : (
      <tr>
        <td>{textFirstCell}</td>
        <td>{textSecondCell}</td>
      </tr>
    )
  )
  // if (isHeader) {
  //   return (
  //     <tr style={{ backgroundColor: 'rgb(222, 181, 181)' }}>
  //       <th colSpan={textSecondCell ? 1 : 2}>{textFirstCell}</th>
  //       {textSecondCell && <th>{textSecondCell}</th>}
  //     </tr>
  //   );
  // } else {
  //   return (
  //     <tr style={{ backgroundColor: 'rgb(214, 210, 210)' }}>
  //       <td>{textFirstCell}</td>
  //       <td>{textSecondCell}</td>
  //     </tr>
  //   );
  // }
}

CourseListRow.propTypes = {
  isHeader: PropTypes.bool, 
  textFirstCell: PropTypes.string, 
  textSecondCell: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number
  ]),
}

export default CourseListRow