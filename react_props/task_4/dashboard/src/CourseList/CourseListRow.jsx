import PropTypes from 'prop-types';

function CourseListRow({ isHeader, textFirstCell, textSecondCell }) {
  return (
      isHeader ? (
        <tr>
          <th colSpan={textSecondCell ? 1 : 2}>{textFirstCell}</th>
          {textSecondCell && <th>{textSecondCell}</th>}
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

CourseListRow.defaultProps = {
  isHeader: false, 
  textFirstCell: '', 
  textSecondCell: '',
}

export default CourseListRow