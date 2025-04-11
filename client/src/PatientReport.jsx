import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Patientreport.css";

const PatientReport = () => {
  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState("daily");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const fetchReport = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !refreshToken || !accessToken) {
        console.error("Missing Local Storage:", {
          userId,
          refreshToken,
          accessToken,
        });
        setErrorMessage("Authentication error. Please log in again.");
        return;
      }

      const requestBody = {
        auth_params: { user_id: userId, refresh_token: refreshToken },
        payload: {},
      };

      const response = await axios.post(
        "http://51.21.150.1:8000/doctor/fetch_patients/",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            accesstoken: accessToken,
          },
        }
      );

      if (response.status === 200 && response.data) {
        const data = response.data;
        const formattedReport = Object.entries(data).map(([department, counts]) => ({
          department,
          count: counts[reportType] || 0,
        }));

        setReportData(formattedReport);
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to fetch patient report.");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setErrorMessage("Failed to generate the report.");
    }
  };

  return (
    <div className="patient-report-container">
      <div className="header">
        <h2>Patient Report</h2>
        <select onChange={(e) => setReportType(e.target.value)} value={reportType}>
          <option value="daily">Daily Report</option>
          <option value="monthly">Monthly Report</option>
          <option value="yearly">Yearly Report</option>
        </select>
        <button className="btn back-btn" onClick={() => navigate("/Staffdash")}>
          Back to Staff Dashboard
        </button>
      </div>

      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : reportData.length > 0 ? (
        <div className="report-section">
          <table className="report-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Patient Count</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  <td>{row.department}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data-message">No report data available.</div>
      )}
    </div>
  );
};

export default PatientReport;