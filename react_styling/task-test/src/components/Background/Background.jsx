import React from "react";
import Icon from "../../assets/SkillSwap-icon.png";
import { FileUpload } from "primereact/fileupload";
import "./Background.css";

function Background() {
  return (
    <div className="background-container">
      <div className="logo-container">
        <img src={Icon} alt="SkillSwap Logo" />
      </div>
      
      <div className="main-content">
        <h1>Your Background</h1>
        
        <div className="background-form">
          <div className="personal-inputs">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input id="name" placeholder="Enter your name" type="text" />
            </div>
            
            <div className="input-group">
              <label htmlFor="lastname">Last Name</label>
              <input id="lastname" placeholder="Enter your last name" type="text" />
            </div>
            
            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input id="age" placeholder="Enter your age" type="number" name="Age" />
            </div>
          </div>
          
          <div className="resume-upload">
            <h2>Upload your Resume</h2>
            <FileUpload
              name="resume"
              url={'/api/upload'}
              accept="application/pdf"
              maxFileSize={5000000}
              chooseOptions={{ 
                label: 'Choose File', 
                icon: 'pi pi-plus', 
                className: 'upload-btn choose-btn' 
              }}
              uploadOptions={{ 
                label: 'Upload', 
                icon: 'pi pi-upload', 
                className: 'upload-btn upload-btn' 
              }}
              cancelOptions={{ 
                label: 'Cancel', 
                icon: 'pi pi-times', 
                className: 'upload-btn cancel-btn' 
              }}
              emptyTemplate={() => (
                <div className="upload-placeholder">
                  <i className="pi pi-cloud-upload upload-icon"></i>
                  <p>Drag and drop your PDF resume here</p>
                  <span>or</span>
                  <button className="browse-btn">Browse Files</button>
                </div>
              )}
            />
          </div>
          <div className="button-container">
            <button className="next-button">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Background;