// import { Component } from 'react';


// class NotificationItem extends Component {

//   render() {
//     const { type, html, value, markAsRead, id } = this.props;
//     if (type === 'default') {
//       return (
//         <li 
//           style={{color: "blue"}} 
//           data-notification-type={type}
//         >{value}</li>
//       );
//     } else if (type === 'urgent' && html !== undefined) {
//       return (
//         <li 
//           style={{color: "red"}} 
//           data-notification-type={type} 
//           dangerouslySetInnerHTML={html}
//         ></li>
//       );
//     } else {
//       return (
//         <li 
//           style={{color: "red"}} 
//           data-notification-type={type}
//         >{value}</li>
//       );
//     }
//   }
// }

// export default NotificationItem; // Should FAIL

// import WithLogging from "./src/HOC/WithLogging";

// export default WithLogging(() => {
//   return (
//     <div className="App-body">
//       <p>Login to access the full dashboard</p>
//       <div className="form">
//         <label htmlFor="email">Email</label>
//         <input type="email" name="user_email" id="email" />
//         <label htmlFor="password">Password</label>
//         <input type="text" name="user_password" id="password" />
//         <button>OK</button>
//       </div>
//     </div>
//   )
// });


// import React from 'react';
// import './Header.css';
// import logo from '../assets/holberton-logo.jpg';
// import { newContext } from './src/Context/context';

// class Header extends React.Component {
//   static contextType = newContext;

//   render() {
//     const { user, logOut } = this.context;

//     return (
//       <div className="App-header">
//         <img src={logo} className="App-logo" alt="holberton logo" />
//         <h1>School Dashboard</h1>
//         {/* faulty implementation for tests purpose */}
//         <div id="logoutSection">
//           Welcome <b>{user.email || 'Guest'}</b>
//           <a href="" onClick={() => console.log('Logout clicked')}>
//             (logout)
//           </a>
//         </div>
//       </div>
//     );
//   }
// }

// export default Header;

// import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchNotifications } from './src/features/notifications/notificationsSlice';
// import { fetchCourses } from './src/features/courses/coursesSlice';
// import Header from './src/components/Header/Header';
// import Footer from './src/components/Footer/Footer';
// import Login from './src/pages/Login/Login';
// import CourseList from './src/pages/CourseList/CourseList';
// import Notifications from './src/components/Notifications/Notifications';
// import BodySection from './src/components/BodySection/BodySection';
// import BodySectionWithMarginBottom from './src/components/BodySectionWithMarginBottom/BodySectionWithMarginBottom';


// export default function App() {
//   const dispatch = useDispatch();
//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

//   useEffect(() => {
//     dispatch(fetchNotifications());
//   }, [dispatch]);

//   useEffect(() => {
//     if (isLoggedIn) {
//       dispatch(fetchCourses());
//     }
//   }, [dispatch, isLoggedIn]);

//   return (
//     <>
//       <Notifications />
//       <Header />
//       {!isLoggedIn ? (
//         <BodySectionWithMarginBottom title="Log in to continue">
//           <Login />
//         </BodySectionWithMarginBottom>
//       ) : (
//         <BodySectionWithMarginBottom title="Course list">
//           <CourseList />
//         </BodySectionWithMarginBottom>
//       )}
//       <BodySection title="News from the School">
//         <p>Holberton School news goes here</p>
//       </BodySection>
//       <Footer />
//     </>
//   );
// }


// import { useDispatch } from 'react-redux';
// import WithLogging from './src/components/HOC/WithLogging';
// import useLogin from './src/hooks/useLogin';
// import './src/pages/Login/Login.css';
// import { login } from './src/features/auth/authSlice';

// function Login() {
//   const dispatch = useDispatch();
//   const {
//     email,
//     password,
//     enableSubmit,
//     handleChangeEmail,
//     handleChangePassword,
//     handleLoginSubmit
//   } = useLogin({
//     onLogin: (email, password) => dispatch(login({ _, password }))
//   });

//   return (
//     <form aria-label="form" onSubmit={handleLoginSubmit}>
//       <div className="App-body">
//         <p>Login to access the full dashboard</p>
//         <div className="form">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             name="email"
//             id="email"
//             value={email}
//             onChange={handleChangeEmail}
//           />
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             name="password"
//             id="password"
//             value={password}
//             onChange={handleChangePassword}
//           />
//           <input
//             type="submit"
//             value="OK"
//             disabled={!enableSubmit}
//           />
//         </div>
//       </div>
//     </form>
//   );
// }

// export default WithLogging(Login);


// import { useSelector } from 'react-redux';
// import { getCurrentYear, getFooterCopy } from './src/utils/utils';
// import './src/components/Footer/Footer.css';

// export default function Footer() {
//   const { isLoggedIn } = useSelector((state) => state.auth);

//   return (
//     <div className="App-footer">
//       <p>Copyright {getCurrentYear()} - {getFooterCopy(true)}</p>
//       {!isLoggedIn && <a href="#">Contact us</a>}
//     </div>
//   );
// }

// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from './src/features/auth/authSlice';
// import './src/components/Header/Header.css';
// import logo from './src/assets/holberton-logo.jpg';


// export default function Header() {
//   const dispatch = useDispatch();
//   const { isLoggedIn, user } = useSelector((state) => state.auth);

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   return (
//     <div className="App-header">
//       <img src={logo} className="App-logo" alt="holberton logo" />
//       <h1>School Dashboard</h1>
//       {isLoggedIn ? (
//         <div id="logoutSection">
//           Welcome <b>{user.user}</b><a href="#" onClick={handleLogout}>(logout)</a>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// import { useSelector } from 'react-redux';
// import CourseListRow from './src/pages/CourseList/CourseListRow/CourseListRow';
// import './src/pages/CourseList/CourseList.css'
// import WithLogging from './src/components/HOC/WithLogging';


// function CourseList() {
//   const { course } = useSelector((state) => state.courses);

//   return (
//     <div className="courses">
//       {course.length > 0 ? (
//         <table id="CourseList">
//           <thead>
//             <CourseListRow textFirstCell="Available courses" isHeader={true} />
//             <CourseListRow textFirstCell="Course name" textSecondCell="Credit" isHeader={true} />
//           </thead>
//           <tbody>
//             {courses.map((course) => (
//               <CourseListRow key={course.id} textFirstCell={course.name} textSecondCell={course.credit} />
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <table id="CourseList">
//           <thead>
//             <CourseListRow isHeader={true} textFirstCell="No course available yet" />
//           </thead>
//         </table>
//       )}
//     </div>
//   );
// }

// export default WithLogging(CourseList);

// import { memo, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { markNotificationAsRead, showDrawer, hideDrawer } from './src/features/notifications/notificationsSlice';
// import NotificationItem from './src/components/NotificationItem/NotificationItem';
// import './src/components/Notifications/Notifications.css';
// import closeIcon from './src/assets/close-icon.png';


// const Notifications = memo(function Notifications () {
//   const dispatch = useDispatch();
//   const { notifications, displayDrawer } = useSelector((state) => state.notifications);

//   const handleDisplayDrawer = useCallback(() => {
//     dispatch(showDrawer());
//   }, [dispatch]);

//   const handleHideDrawer = useCallback(() => {
//     dispatch(hideDrawer());
//   }, [dispatch]);

//   const handleMarkNotificationAsRead = useCallback((id) => {
//     dispatch(markNotificationAsRead(id));
//   }, [dispatch]);

//   return (
//     <>
//       <div className="notification-title" onClick={handleDisplayDrawer}>
//         Your notifications
//       </div>
//       {displayDrawer && (
//         <div className="Notifications">
//           {notifications.length > 0 ? (
//             <>
//               <p>Here is the list of notifications</p>
//               <button onClick={handleHideDrawer} aria-label="Close">
//                 <img src={closeIcon} alt="close icon" />
//               </button>
//               <ul>
//                 {notifications.map((notification) => (
//                   <NotificationItem
//                     key={notification.id}
//                     id={notification.id}
//                     type={notification.type}
//                     value={notification.value}
//                     html={notification.html}
//                     markAsRead={() => {}}
//                   />
//                 ))}
//               </ul>
//             </>
//           ) : (
//             <p>No new notifications for now</p>
//           )}
//         </div>
//       )}
//     </>
//   );
// });

// export default Notifications;


export default function CourseListRow({ 
  isHeader = false, 
  textFirstCell = '', 
  textSecondCell = null 
}) {
  return (
    isHeader ? (
      <tr>
        <th colSpan={textSecondCell ? 1 : 1}>{textFirstCell}</th>
        {textSecondCell ? <th>{textSecondCell}</th> : null}
      </tr>
    ) : (
      <tr>
        <td>{textFirstCell}</td>
        <td>{textSecondCell}</td>
      </tr>
    )
  )
}
