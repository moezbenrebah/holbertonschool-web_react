import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SkillSwapLogo from "../../assets/SkillSwap-Logo.png";
import { loginUser } from "../../utils/auth";
import "./LogIn.css";

function LogIn() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefualt();

    if (!email || !pass) {
      return setError("Both fields are required");
    }

    const result = loginUser(email, pass);
    if (!result.success) {
      return setError(result.message);
    }

    navigate("/dashboard");
  };

  return (
    <>
      <div className="login-container">
        <div className="login-form">
          <div className="logo-container">
            <img src={SkillSwapLogo} alt="SkillSwap Logo" />
          </div>
          <h1>Log In</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit} className="form-inputs">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <label>Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} />
            <button className="signin-button" type="submit">Log In</button>
          </form>
          <div className="login-link">
            <p>You don't have an account? <Link to="/">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogIn;