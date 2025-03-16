import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Signout from "./Signout";


const Staffdash = () => {
  const navigate = useNavigate();

  // Mock patient queue (same as doctor dashboard)
  const [patientsQueue, setPatientsQueue] = useState([
    { id: 1, name: "Dr SuryaPrakash G Garu", phone: "Cardiologist", disease: "Flu" },
    { id: 2, name: "Dr Srinivasa Rao G Garu", phone: "Gastroentologist", disease: "Migraine" },
    { id: 3, name: "Dr Ramakrishna Garu", phone: "Pulmonologist", disease: "Diabetes" },
    { id: 4, name: "Dr Prakash Garu", phone: "Dentist", disease: "Diabetes" },
    { id: 5, name: "Dr Rajeswari Garu", phone: "Gynecology", disease: "Diabetes" },
    
  ]);

  return (
    <>
      <style>{`
        /* General Layout */
        .staffdash-container {
          display: flex;
          height: 100vh;
          font-family: 'Arial', sans-serif;
          background-color: #eef2f7;
        }

        /* Sidebar - Patient Queue */
        .sidebar {
          width: 25%;
          background-color: teal;
          color: white;
          padding: 20px;
          box-shadow: 3px 0 5px rgba(0, 0, 0, 0.1);
        }

        .sidebar h2 {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 15px;
          border-bottom: 2px solid white;
          padding-bottom: 10px;
        }

        .patient-list {
          list-style: none;
          padding: 0;
        }

        .patient-item {
          padding: 12px;
          background: #34495e;
          margin: 8px 0;
          border-radius: 6px;
          text-align: center;
          transition: 0.3s;
        }

        .patient-item:hover {
          background: #1abc9c;
        }

        /* Right Section - Action Boxes */
        .right-section {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .action-box {
          width: 200px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #3498db;
          color: white;
          font-size: 18px;
          font-weight: bold;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
          text-align: center;
        }

        .action-box:hover {
          background: #2980b9;
        }
      `}</style>

           <div className="text-center">
              <img
                src="./logo.png"
                alt="Hospital Logo"
                width="100"
                height="100"
              />
              <h3 style={{ fontFamily: "serif" }}>Viswayogi Institute Of Medical Sciences (VIMS)</h3>
            </div>

      <div className="staffdash-container">
        
        {/* Sidebar - Patient Queue */}
        <div className="sidebar">
          <Signout />
          <h2>OUR RESPECTED DOCTORS</h2>
          <ul className="patient-list">
            {patientsQueue.length > 0 ? (
              patientsQueue.map((patient) => (
                <li key={patient.id} className="patient-item">
                  {patient.name} ({patient.phone})
                </li>
              ))
            ) : (
              <p>No patients waiting</p>
            )}
          </ul>
        </div>

        {/* Right Section - Navigation Boxes */}
        <div className="right-section">
          <div className="action-box" onClick={() => navigate("/Patientdash")}>
            Register Patient
          </div>
          <div className="action-box" onClick={() => navigate("/Appointment")}>
            Add Appointment
          </div>
        </div>
      </div>
    </>
  );
};

export default Staffdash;