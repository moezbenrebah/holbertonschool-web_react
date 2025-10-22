import { Component } from 'react';
import Notifications from '../Notifications/Notifications';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Login from '../Login/Login';
import CourseList from '../CourseList/CourseList';
import { getLatestNotification } from '../utils/utils';
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom';
import BodySection from '../BodySection/BodySection';
import newContext from '../Context/context';


const notificationsList = [
    { id: 1, type: 'default', value: 'New course available' },
    { id: 2, type: 'urgent', value: 'New resume available' },
    { id: 3, type: 'urgent', html: { __html: getLatestNotification() } }
]
const coursesList = [
    { id: 1, name: 'ES6', credit: 60 },
    { id: 2, name: 'Webpack', credit: 20 },
    { id: 3, name: 'React', credit: 40 }
]


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayDrawer: true,
      user: {
        email: '',
        password: '',
        isLoggedIn: false
      },
      logOut: this.logOut,
      notifications: notificationsList,
      courses: coursesList
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  handleDisplayDrawer = () => {
    this.setState({ displayDrawer: true }, () => {
      console.log(this.state.displayDrawer);
    });
  }

  handleHideDrawer = () => {
    this.setState({ displayDrawer: false }, () => {
      console.log(this.state.displayDrawer)
    });
  }

  logIn = (email, password) => {
    this.setState({
      user: {
        email: email,
        password: password,
        isLoggedIn: true
      }
    });
  }

  logOut = () => {
    this.setState({
      user: {
        email: '',
        password: '',
        isLoggedIn: false
      }
    });
  }

  markNotificationAsRead = (id) => {
    console.log(`Notification ${id} has been marked as read`);
    this.setState((prevState) => ({
      notifications: prevState.notifications.filter(notification => notification.id !== id)
    }));
  }

  handleKeydown = (e) => {
    if (e.ctrlKey && e.key === "h" ) {
      alert("Logging you out");
      this.logOut();
    }
  }

  render() {
    const { displayDrawer, user, logOut, notifications, courses } = this.state;
    const contextValue = { user, logOut };

    return (
      <newContext.Provider value={contextValue}>
        <div className="relative px-3 min-h-screen flex flex-col">
          <div className="absolute top-0 right-0 z-10">
            <Notifications
              notifications={notifications}
              handleHideDrawer={this.handleHideDrawer}
              handleDisplayDrawer={this.handleDisplayDrawer}
              displayDrawer={displayDrawer}
              markNotificationAsRead={this.markNotificationAsRead}
            />
          </div>
          <div className="flex-1">
            <Header />
            {
              !user.isLoggedIn ? (
                <BodySectionWithMarginBottom title='Log in to continue'>
                  <Login logIn={this.logIn} email={user.email} password={user.password} />
                </BodySectionWithMarginBottom>
              ) : (
                <BodySectionWithMarginBottom title='Course list'>
                  <CourseList courses={courses} />
                </BodySectionWithMarginBottom>
              )
            }
            <BodySection title="News from the School">
              <p>
                Holberton School news goes here
              </p>
            </BodySection>
          </div>
          <Footer />
        </div>
      </newContext.Provider>
    );
  }
}

export default App;
