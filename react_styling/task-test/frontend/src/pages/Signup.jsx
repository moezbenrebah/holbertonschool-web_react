import React, { useState } from "react";
import { Link } from "react-router-dom";

// Signup component
const Signup = () => {

  // form inputs and messages
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

   // Handles user signup form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    const username = `${firstName} ${lastName}`; // Combine first and last name

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }), // Send signup data
      });

      const data = await response.json();

      if (!response.ok) {

        // Display error message from server
        setMessage(data.message || "Signup failed.");
      } else {

        // Show success message
        setMessage(data.message || "Signup successful.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");  // Fallback error
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen -mt-8">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm">
        {/* Page heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h2>

        {/* Message display area */}
        {message && (
          <div className="mb-4 text-sm text-center text-blue-600">{message}</div>
        )}

          {/* Signup form */}
        <form onSubmit={handleSignUp}>
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
              required
            />
          </div>

          {/* Last Name input*/}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
              required
            />
          </div>

          {/* Email input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
              required
            />
          </div>

          {/* Show Password  checkbox*/}
          <div className="flex justify-start items-center mb-6 text-sm">
            <label className="flex items-center space-x-2 text-gray-600">
              <input
                type="checkbox"
                onChange={(e) => setShowPassword(e.target.checked)}
                className="form-checkbox h-4 w-4 text-black"
              />
              <span>Show password</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-green-800 transition 
            active:scale-95 active:bg-gray-900"
          >
            Sign up
          </button>
        </form>

        {/* Login redirect link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
