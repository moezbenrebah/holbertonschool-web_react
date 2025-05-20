import React from "react";
import avatar from "../../../assets/avatar.png";
import "./CareerList.css"

function CareerList() {
  const list = [
    "Programming",
    "Sign Laguage",
    "Language",
    "Agriculture",
    "Computer Repair",
    "Handy Man",
    "Instruments",
    "Sing",
    "Cars Mechanic",
    "Electronics",
    "Agriculture",
    "Mathematics"
  ];

  return(
  <>
    <div className="box">
      <div className="profile">
        <div className="avatar">
          <img height="80" width="80" src={avatar} alt="avatar" /> 
        </div>
        <div className="profile-p">
          <p>Profile</p>
        </div>
      </div>
      <div className="list">
        <ul>
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </>
  );
}

export default CareerList;