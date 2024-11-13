import { Component } from 'react';
import './Footer.css';
import { getCurrentYear, getFooterCopy } from '../utils/utils';
import { newContext } from '../Context/context';

export default class Footer extends Component {
  render() {
    return (
      <newContext.Consumer>
        {
          (context) => {
            if (context.user) {
              return (
                <div className="App-footer">
                  <p>Copyright {getCurrentYear()} - {getFooterCopy(true)}</p>
                  {context.user.isLoggedIn && <a href="#">Contact us</a>}
                </div>
              );
            }
          }
        }
      </newContext.Consumer>
    );
  }
}
