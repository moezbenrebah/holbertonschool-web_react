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

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications } from './src/features/notifications/notificationsSlice';
import { fetchCourses } from './src/features/courses/coursesSlice';
import Header from './src/components/Header/Header';
import Footer from './src/components/Footer/Footer';
import Login from './src/pages/Login/Login';
import CourseList from './src/pages/CourseList/CourseList';
import Notifications from './src/components/Notifications/Notifications';
import BodySection from './src/components/BodySection/BodySection';
import BodySectionWithMarginBottom from './src/components/BodySectionWithMarginBottom/BodySectionWithMarginBottom';


export default function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCourses());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <>
      <Notifications />
      <Header />
      {!isLoggedIn ? (
        <BodySectionWithMarginBottom title="Log in to continue">
          <Login />
        </BodySectionWithMarginBottom>
      ) : (
        <BodySectionWithMarginBottom title="Course list">
          <CourseList />
        </BodySectionWithMarginBottom>
      )}
      <BodySection title="News from the School">
        <p>Holberton School news goes here</p>
      </BodySection>
      <Footer />
    </>
  );
}
