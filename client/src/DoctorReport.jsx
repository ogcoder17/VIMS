import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/DoctorReport.css";

const DoctorReport = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [notDoneCount, setNotDoneCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      const userId = localStorage.getItem("userId");
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");
      const doctorId = localStorage.getItem("userId");

      if (!userId || !refreshToken || !accessToken || !doctorId) {
        console.log("Missing credentials. Current localStorage contents:", {
          userId,
          refreshToken,
          accessToken,
          fullLocalStorage: { ...localStorage } // logs everything in localStorage
        });
      
        setErrorMessage("Authentication error. Please log in again.");
        return;
      }

      const requestBody = {
        auth_params: { user_id: userId, refresh_token: refreshToken },
        payload: { doctor_id: doctorId },
      };

      try {
        const response = await axios.post(
          "http://51.21.150.1:8000/doctor/pat_count/",
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
              accesstoken: accessToken,
            },
          }
        );

        if (response.status === 201) {
          const data = response.data?.appointment_data || [];

          const cleaned = data.map((item) => ({
            name: item.patient_id__full_name || "N/A",
            registrationDate: item.registration_date || "N/A",
            status: item.status || "Pending",
          }));

          setAppointments(cleaned);
          setTotalPatients(cleaned.length);
          setDoneCount(cleaned.filter((apt) => apt.status === "Completed").length);
          setNotDoneCount(cleaned.filter((apt) => apt.status !== "Completed").length);
        } else {
          setErrorMessage("Failed to fetch appointments.");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setErrorMessage("Error fetching appointment data.");
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="doctor-report">
      <h1>Doctor's Patient Report</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="report-summary">
        <p>Total Patients: {totalPatients}</p>
        <p>Completed: {doneCount}</p>
        <p>Pending: {notDoneCount}</p>
      </div>
      <div className="appointment-list">
        {appointments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Patient Name</th>
                <th>Registration Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{appointment.name}</td>
                  <td>{appointment.registrationDate}</td>
                  <td className={appointment.status === "Completed" ? "status-completed" : "status-pending"}>
                    {appointment.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No appointments found for this doctor.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorReport;