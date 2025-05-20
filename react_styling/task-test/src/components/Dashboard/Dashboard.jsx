import React from "react";
import CareerList from "./CareerList/CareerList";
import setting from "../../assets/Settings Gear Icon.png"
import "./Dashboard.css"

function Dashboard() {
  return(
    <>
    {/* Start Careers Side */}
      <CareerList />
      {/* Finish Career Side */}
      {/* ---------------------------------------------------- */}
      {/* Start Settings */}
      <div className="settings">
        <div className="setting-text">
          <button className="settings-btn" aria-label="Settings">
            <img height="30" width="30" src={setting} alt="Settings icon" />
          </button>
        </div>
      </div>
      {/* Finish Settings */}
      {/* ---------------------------------------------------- */}
      {/* Start Notification */}
      <main className="notifications-box">
        <div className="noti-h1">
          <h1>Notifications</h1>
        </div>
        <div className="boxes">
          <div className="box-1">1</div>
          <div className="box-2">2</div>
          <div className="box-3">3</div>
        </div>
      </main>
      {/* Notification Finish */}
    </>
  );
}

export default Dashboard;