import WithLogging from '../HOC/WithLogging';

function Login() {
  return (
    <div className="App-body flex flex-col p-5 pl-10 h-[45vh] border-t-4 border-[color:var(--main-color)] max-[520px]:pl-1">
      <p className="text-xl">Login to access the full dashboard</p>
      <div className="mt-8 text-lg">
        {/* Desktop layout - unchanged */}
        <div className="max-[768px]:hidden">
          <label htmlFor="email" className="pr-2">Email</label>
          <input type="email" name="user_email" id="email" className="border rounded" />
          <label htmlFor="password" className="pl-2 pr-2">Password</label>
          <input type="password" name="user_password" id="password" className="border rounded" />
          <button className="cursor-pointer border px-1 rounded ml-2">OK</button>
        </div>
        
        {/* Mobile layout - stacked vertically */}
        <div className="hidden max-[768px]:block">
          <div className="mb-1">
            <div>Email</div>
            <input type="email" name="user_email_mobile" id="email_mobile" className="border rounded w-60" />
          </div>
          <div className="mb-1">
            <div>Password</div>
            <input type="password" name="user_password_mobile" id="password_mobile" className="border rounded w-60" />
          </div>
          <button className="cursor-pointer border px-1 rounded mt-1">OK</button>
        </div>
      </div>
    </div>
  );
}

const LoginWithLogging = WithLogging(Login)
export default LoginWithLogging;
