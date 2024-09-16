import HolbertonLogo from './assets/holbertonlogo.jpg';
import './App.css'
import { getCurrentYear, getFooterCopy } from './utils';
import Notifications from './Notifications';

function App() {
  return (
    <div className="App">
      <div className="root-notifications">
        <Notifications />
      </div>
      <div className='App-header'>
        <img className='App-logo' src={HolbertonLogo} alt='logo'></img>
        <h1>School dashboard</h1>
      </div>
      <div className='App-body'>
        <p>Login to access the full dashboard</p>
        <label htmlFor='email' className='email'>
          Email:
        </label>
        <input id='email' type='email'/>
        <label htmlFor='password' className='password'>
          Password: 
        </label>
        <input id='password' type='password'/>
        <button className='label-button'>OK</button>
      </div>
      <div className='App-footer'>
        <p> Copyright {getCurrentYear()} {getFooterCopy()}</p>
      </div>
    </div>
  );
}

export default App;