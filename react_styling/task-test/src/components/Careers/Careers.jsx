import React, { useState } from "react";
import Logo from "../../assets/SkillSwap-icon.png";
import downArrow from "../../assets/Arrow Down Icon.svg";
import "./Careers.css";

function Careers() {
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState("");

  const careers = [
    "Programmer",
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "Data Analyst",
    "UI/UX Designer",
    "Sign Language",
    "Language",
    "Agriculture",
    "Computer Repair",
    "Handy Man",
    "Instruments",
    "Sing",
    "Cars Mechanic",
    "Electronics"
  ];

  const toggleList = () => {
    setIsListVisible(!isListVisible);
  };

  const selectCareer = (career) => {
    setSelectedCareer(career);
    setIsListVisible(false);
  };

  return(
    <div className="careers-container">
      <div className="logo-container">
        <img src={Logo} alt="SkillSwap Logo" />
      </div>
      
      <div className="title-container">
        <h1>What is your career?</h1>
      </div>
      
      <div className="dropdown-container">
        <button 
          className="dropdown-button" 
          onClick={toggleList}
        >
          {selectedCareer || "Choose your career"} 
          <img 
            src={downArrow} 
            alt="down arrow" 
            className={isListVisible ? "arrow-up" : "arrow-down"}
          />
        </button>
        
        {isListVisible && (
          <ul className="dropdown-list">
            {careers.map((career, index) => (
              <li 
                key={index} 
                onClick={() => selectCareer(career)}
                className="dropdown-item"
              >
                {career}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="next-button-container">
        <button className="next-button">
          Next
        </button>
      </div>
    </div>
  );
}

export default Careers;