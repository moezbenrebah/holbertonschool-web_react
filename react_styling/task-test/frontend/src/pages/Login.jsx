import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../util/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  // input fields, messages, and UI control
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); 
  const location = useLocation();
  const { login } = useAuth(); // Access auth context

  // Process the login form when submitted
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Send login request to backend
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {

        // If login successful, store token & user, then redirec
        const { token, user } = data;
        login(token, user);
        setMessage("Login successful! Redirecting...");
        
        const from = location.state?.from?.pathname || "/dashboard";
        setTimeout(() => navigate(from, { replace: true }), 1500);
      } else {

        // If login failed, show error message
        setMessage(data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen -mt-16">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <FontAwesomeIcon icon={faCamera} className="text-3xl mr-2 m-4" />
        </div>

        {/* Heading form */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Log in to your account</h2>

        {/* feedback Message display */}
        {message && (
          <div className={`mb-4 p-2 rounded-md ${
            message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
        
         {/* Login form */}
        <form onSubmit={handleLogin} autoComplete="on">

          {/* Email input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              name="email" placeholder="Enter your email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
              required 
            />
          </div>

          {/* Password input */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password" placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
              required
            />
          </div>

          {/* Show password and forgot link */}
          <div className="flex justify-between items-center mb-6 text-sm">
            <label className="flex items-center space-x-2 text-gray-600">
              <input
                type="checkbox"
                onChange={(e) => setShowPassword(e.target.checked)}
                className="form-checkbox h-4 w-4 text-black"
              />
              <span>Show password</span>
            </label>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-green-800 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;