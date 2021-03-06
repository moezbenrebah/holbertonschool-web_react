import React, { Fragment } from 'react';
import './App.css';
import Header from '../Header/Header.js';
import Login from '../Login/Login.js';
import Footer from '../Footer/Footer.js';
import Notifications from '../Notifications/Notifications.js';
import CourseList from '../CourseList/CourseList';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { isLoggedIn } = this.props;
    let listOfCourses = [
      { id: 1, name: "ES6", credit: 60 },
      { id: 2, name: "Webpack", credit: 20 },
      { id: 3, name: "React", credit: 40 },
    ];
    return (
      <Fragment>
        <div className="App">
          <div className="upperside">
            <Notifications />
            <Header />
          </div>
          {
            isLoggedIn === false &&
            <Login />
          }
          {
            isLoggedIn === true &&
            <CourseList listOfCourses={listOfCourses}/>
          }
          <Footer />
        </div>
      </Fragment>
    );  
  };
};

App.defaultProps = {
  isLoggedIn: false,
};

export default App;
