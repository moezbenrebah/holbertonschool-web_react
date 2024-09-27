import './App.css';
import Notifications from '../Notifications/Notifications';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Login from '../Login/Login';
import CourseList from '../CourseList/CourseList';
import { getLatestNotification } from '../utils/utils';

const notificationsList = [];

const coursesList = [
  { id:1, name:'ES6', credit:60 },
  { id:2, name:'Webpack', credit:20 },
  { id:3, name:'React', credit:40 }
];

export default function App({ isLoggedIn = true }) {

  return (
    <>
      <Notifications 
        notifications={notificationsList}
      />
      <>
        <Header />
        {
          !isLoggedIn ? (
            <Login />
          ) : (
            <CourseList courses={coursesList} />
          )
        }
      </>
      <Footer />
    </>
  );
}
