import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/Docdash.css";
import Signout from "./Signout";

const Docdash = () => {
  const navigate = useNavigate();
  const [patientsQueue, setPatientsQueue] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      const userId = localStorage.getItem("userId");
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !refreshToken || !accessToken) {
        setErrorMessage("Authentication error. Please log in again.");
        return;
      }

      const requestBody = {
        auth_params: { user_id: userId, refresh_token: refreshToken },
        payload: { doctor_id: userId },
      };

      try {
        const response = await axios.post(
          "http://51.21.150.1:8000/doctor/fetch_queue/",
          requestBody,
          {
            headers: { "Content-Type": "application/json", accesstoken: accessToken },
          }
        );

        if (response.data?.appointment_data) {
          console.log("Appointments received:", response.data.appointment_data);
          setPatientsQueue(response.data.appointment_data);
        }
      } catch (error) {
        setErrorMessage("Failed to fetch appointments. Please try again.");
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 2000);
    return () => clearInterval(interval);
  }, []);

  // Function to handle appointment completion
  const handleAppointmentDone = async () => {
    if (!selectedPatient) return;

    const userId = localStorage.getItem("userId");
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    if (!userId || !refreshToken || !accessToken) {
      setErrorMessage("Authentication error. Please log in again.");
      return;
    }

    const requestBody = {
      auth_params: { user_id: userId, refresh_token: refreshToken },
      payload: { 
        appointment_id: selectedPatient.appointment_id,
        done: true, // Mark the appointment as completed
      },
    };

    try {
      await axios.post(
        "http://51.21.150.1:8000/doctor/update_queue/", // Correct API endpoint
        requestBody,
        {
          headers: { "Content-Type": "application/json", accesstoken: accessToken },
        }
      );

      // Remove the patient from the frontend queue immediately
      setPatientsQueue((prevQueue) => prevQueue.filter((p) => p.appointment_id !== selectedPatient.appointment_id));

      // Clear the selected patient
      setSelectedPatient(null);

      console.log("Appointment marked as done:", selectedPatient.appointment_id);
    } catch (error) {
      console.error("Error completing appointment:", error);
      setErrorMessage("Failed to complete the appointment. Please try again.");
    }
  };


  const navigatePrescription = () => {
    if (!selectedPatient) return;
  
    
    // Store selected patient details in sessionStorage
    sessionStorage.setItem("selectedPatient", JSON.stringify(selectedPatient));
    localStorage.setItem("selectedPatient", JSON.stringify(selectedPatient));
  
    // Open prescription page in a new tab
    window.open("/Prescription", "_blank");
  };


  return (
    <div className="docdash-container">
      <Signout />
      <div className="sidebar">
        <h2>Patient Queue</h2>
        <ul className="patient-list">
          {patientsQueue.length > 0 ? (
            patientsQueue.map((patient, index) => (
              <li key={index} className="patient-item" onClick={() => setSelectedPatient(patient)}>
                {patient.patient_id__full_name} ({patient.patient_id__phone_no})
              </li>
            ))
          ) : (
            <p>No patients waiting</p>
          )}
        </ul>
      </div>

      <div className="main-content">
        <div className="text-center">
          <img src="./logo.png" alt="Hospital Logo" width="100" height="100" />
          <h3 style={{ fontFamily: "serif" }}>VIMS</h3>
        </div>

        <div className="patient-details">
          <h2>Patient Details</h2>
          {selectedPatient ? (
            <div className="details-card">
              <p><strong>Name:</strong> {selectedPatient.patient_id__full_name || "N/A"}</p>
              <p><strong>Phone:</strong> {selectedPatient.patient_id__phone_no || "N/A"}</p>
              <p><strong>Disease:</strong> {selectedPatient.patient_id__Health_info || "N/A"}</p>
              <p><strong>Blood Pressure:</strong> {selectedPatient.blood_pressure || "N/A"}</p>
              <p><strong>Temperature:</strong> {selectedPatient.body_temp || "N/A"}</p>
              <p><strong>Weight:</strong> {selectedPatient.weight || "N/A"}</p>
              <p><strong>Appointment Time:</strong> {selectedPatient.appointment_sch || "N/A"}</p>

              {/* Appointment Done button */}
              <button className="done-btn" onClick={handleAppointmentDone}>
                Appointment Done
              </button>&nbsp;&nbsp;
              <button
                className="prescription-btn" onClick={navigatePrescription}>
                  Prescription & Diagnosis
              </button>
            </div>
          ) : (
            <p>Select a patient from the queue</p>
          )}
        </div>

        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Docdash;