import { StyleSheet, css } from 'aphrodite';
import WithLogging from '../HOC/WithLogging';

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    flexDirection: 'column',
    height: '60vh',
    padding: '20px 20px 20px 40px',
    borderTop: '5px red solid'
  },
  p: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1.3rem'
  },
  form: {
    margin: '20px 0',
    fontSize: '1.2rem',
    fontFamily: 'Roboto, sans-serif'
  },
  label: {
    paddingRight: '10px'
  },
  input: {
    marginRight: '10px'
  },
  button: {
    cursor: 'pointer'
  }
});

export default WithLogging(() => {
  return (
    <div className={css(styles.body)}>
      <p className={css(styles.p)}>Login to access the full dashboard</p>
      <div className={css(styles.form)}>
        <label htmlFor="email" className={css(styles.label)}>Email</label>
        <input type="email" name="user_email" id="email" className={css(styles.input)} />
        <label htmlFor="password" className={css(styles.label)}>Password</label>
        <input type="text" name="user_password" id="password" className={css(styles.input)} />
        <button className={css(styles.button)}>OK</button>
      </div>
    </div>
  )
});
