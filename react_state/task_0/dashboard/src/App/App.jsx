import { Component } from 'react';
import './App.css';
import Notifications from '../Notifications/Notifications';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Login from '../Login/Login';
import CourseList from '../CourseList/CourseList';
import { getLatestNotification } from '../utils/utils';
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom';
import BodySection from '../BodySection/BodySection';

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: { __html: getLatestNotification()} }
];

const coursesList = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayDrawer: true
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown);
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = (e) => {
    if (e.ctrlKey && e.key === "h" ) {
      alert("Logging you out");
      if (this.props.logOut) {
        this.props.logOut();
      }
    }
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

  render() {
    const { isLoggedIn = false, logOut = () => {} } = this.props;


    return (
      <>
        <Notifications 
          notifications={notificationsList}
          handleHideDrawer={this.handleHideDrawer}
          handleDisplayDrawer={this.handleDisplayDrawer}
          displayDrawer={this.state.displayDrawer}
        />
        <>
          <Header />
          {
            !isLoggedIn ? (
              <BodySectionWithMarginBottom title='Log in to continue'>
                <Login />
              </BodySectionWithMarginBottom>
            ) : (
              <BodySectionWithMarginBottom title='Course list'>
                <CourseList courses={coursesList} />
              </BodySectionWithMarginBottom>
            )
          }
          <BodySection title="News from the School">
            <p>
              Holberton School news goes here
            </p>
          </BodySection>
        </>
        <Footer />
      </>
    );
  }
}

export default App;
