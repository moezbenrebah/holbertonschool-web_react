const headerRowStyle = { backgroundColor: '#deb5b545' };
const rowStyle = { backgroundColor: '#f5f5f5ab' };

export default function CourseListRow({
  isHeader = false,
  textFirstCell = '',
  textSecondCell = null
}) {
  return (
    isHeader ? (
      <tr style={headerRowStyle}>
        <th colSpan={textSecondCell ? 1 : 2}>{textFirstCell}</th>
        {textSecondCell ? <th>{textSecondCell}</th> : null}
      </tr>
    ) : (
      <tr style={rowStyle}>
        <td>{textFirstCell}</td>
        <td>{textSecondCell}</td>
      </tr>
    )
  )
}
