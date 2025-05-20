import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn.jsx";
import LogIn from "./components/LogIn/LogIn.jsx";
import Careers from "./components/Careers/Careers.jsx";
import Background from "./components/Background/Background.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import "./App.css";

function App() {
  return(
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/background" element={<Background />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App;