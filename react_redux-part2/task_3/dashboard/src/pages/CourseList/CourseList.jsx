import CourseListRow from './CourseListRow/CourseListRow';
import { useDispatch, useSelector } from 'react-redux';
import './CourseList.css'
import WithLogging from '../../components/HOC/WithLogging';
import { selectCourse, unSelectCourse } from '../../features/courses/coursesSlice';


function CourseList() {
  const { courses } = useSelector((state) => state.courses);
  const dispatch = useDispatch();

  const onChangeRow = (id, checked) => {
    const action = checked ? selectCourse : unSelectCourse;
    dispatch(action(id));
  };

  return (
    <div className="courses">
      {courses.length > 0 ? (
        <table id="CourseList">
          <thead>
            <CourseListRow textFirstCell="Available courses" isHeader={true} />
            <CourseListRow textFirstCell="Course name" textSecondCell="Credit" isHeader={true} />
          </thead>
          <tbody>
            {courses.map((course) => (
              <CourseListRow 
                key={course.id}
                id={course.id}
                textFirstCell={course.name} 
                textSecondCell={course.credit}
                onChangeRow={onChangeRow}
                isSelected={course.isSelected || false}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <table id="CourseList">
          <thead>
            <CourseListRow isHeader={true} textFirstCell="No course available yet" />
          </thead>
        </table>
      )}
    </div>
  );
}

export default WithLogging(CourseList);
