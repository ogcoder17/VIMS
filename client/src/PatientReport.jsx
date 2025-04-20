import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Patientreport.css";

const PatientReport = () => {
  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD
  const [selectedMonth, setSelectedMonth] = useState(""); // YYYY-MM
  const [selectedYear, setSelectedYear] = useState(""); // YYYY
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (
      (reportType === "daily" && selectedDate) ||
      (reportType === "monthly" && selectedMonth) ||
      (reportType === "yearly" && selectedYear)
    ) {
      fetchReport();
    }
  }, [reportType, selectedDate, selectedMonth, selectedYear]);

  const fetchReport = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !refreshToken || !accessToken) {
        setErrorMessage("Authentication error. Please log in again.");
        return;
      }

      const payload = {};
      if (reportType === "daily" && selectedDate) {
        const dateObj = new Date(selectedDate)
        payload.date = dateObj.getDate();
        payload.month = dateObj.getMonth() + 1;
        payload.year = dateObj.getFullYear();
      } else if (reportType === "monthly" && selectedMonth) {
        const [year, month] = selectedMonth.split("-");
        payload.month = parseInt(month, 10);
        payload.year = parseInt(year, 10);
      } else if (reportType === "yearly" && selectedYear) {
        payload.year = parseInt(selectedYear, 10);
      }

      const requestBody = {
        auth_params: { user_id: userId, refresh_token: refreshToken },
        payload,
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
        const formatted = Object.entries(response.data).map(([department, count]) => ({
          department,
          count,
        }));
        setReportData(formatted);
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to fetch patient report.");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setErrorMessage("Failed to generate the report.");
    }
  };

  const handleReportTypeChange = (e) => {
    const type = e.target.value;
    setReportType(type);
    setReportData([]);
    setSelectedDate("");
    setSelectedMonth("");
    setSelectedYear("");
  };

  return (
    <div className="patient-report-container">
      <div className="header">
        <h2>Patient Report</h2>
        <select onChange={handleReportTypeChange} value={reportType}>
          <option value="daily">Daily Report</option>
          <option value="monthly">Monthly Report</option>
          <option value="yearly">Yearly Report</option>
        </select>

        {reportType === "daily" && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        )}

        {reportType === "monthly" && (
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        )}

        {reportType === "yearly" && (
          <input
            type="number"
            placeholder="Enter Year (e.g. 2024)"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            min="2000"
            max="2100"
          />
        )}

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
        <div className="no-data-message">Select a {reportType} to view report.</div>
      )}
    </div>
  );
};

export default PatientReport;