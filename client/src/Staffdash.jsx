import React from "react";
import { useNavigate } from "react-router-dom";
import Signout from "./Signout";
import "./css/staffdash.css";

const Staffdash = () => {
  const navigate = useNavigate();

  const patientsQueue = [
    { id: 1, name: "Dr SuryaPrakash G Garu", phone: "Cardiologist", disease: "Flu" },
    { id: 2, name: "Dr Srinivasa Rao G Garu", phone: "Gastroenterologist", disease: "Migraine" },
    { id: 3, name: "Dr Ramakrishna Garu", phone: "Pulmonologist", disease: "Asthma" },
    { id: 4, name: "Dr Prakash Garu", phone: "Dentist", disease: "Cavities" },
    { id: 5, name: "Dr Rajeswari Garu", phone: "Gynecology", disease: "Pregnancy" },
  ];

  return (
    <>
      <div className="text-center">
        <img src="./logo.png" alt="Hospital Logo" width="100" height="100" />
        <h3 className="hospital-name">
          Viswayogi Institute Of Medical Sciences (VIMS)
        </h3>
      </div>

      <div className="staffdash-container">
        {/* Sidebar - Doctor List */}
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
              <p>No doctors available</p>
            )}
          </ul>
        </div>

        {/* Right Section - Action Boxes */}
        <div className="right-section">
          <div className="action-box" onClick={() => navigate("/Patientdash")}>
            Register Patient
          </div>
          <div className="action-box" onClick={() => navigate("/Appointment")}>
            Add Appointment
          </div>
          <div className="action-box" onClick={() => navigate("/PatientReport")}>
            Generate Patient Report
          </div>
        </div>
      </div>
    </>
  );
};

export default Staffdash;