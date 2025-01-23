export default function CourseListRow({ 
  isHeader = false, 
  textFirstCell = '', 
  textSecondCell = null,
  isSelected = false,
  onChangeRow = () => {},
  id,
}) {
  return (
    isHeader ? (
      <tr>
        <th colSpan={textSecondCell ? 1 : 2}>{textFirstCell}</th>
        {textSecondCell ? <th>{textSecondCell}</th> : null}
      </tr>
    ) : (
      <tr>
        <td>
          <input
            type="checkbox"
            checked={isSelected} // Use isSelected directly
            onChange={(e) => onChangeRow(id, e.target.checked)} // Handle checkbox changes
          />
          {textFirstCell}
        </td>
        <td>{textSecondCell}</td>
      </tr>
    )
  )
}
