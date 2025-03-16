import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Appointment.css";
import Signout from "./Signout";

const Appointment = () => {
  const { state } = useLocation(); 
  const navigate = useNavigate();
  const patient = state?.patient || {};
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(localStorage.getItem("doctorId") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    phone: patient.phone_no || "",
    disease: patient.healthinfo || "",
    bp: "",
    temperature: "",
    weight: "",
    datetime: "",
    readyToBook: "",
  });

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      const userId = localStorage.getItem("userId");
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !refreshToken || !accessToken) {
        setErrorMessage("Authentication error. Please log in again.");
        return;
      }

      const requestBody = {
        auth_params: { user_id: userId, refresh_token: refreshToken },
        payload: {},
      };

      try {
        const response = await axios.post(
          "http://51.21.150.1:8000/doctor/fetch_doctors/",
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
              accesstoken: accessToken,
            },
          }
        );
        setDoctors(response.data?.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error.response || error);
        setErrorMessage("Failed to fetch doctors. Please try again.");
      }
    };

    fetchDoctors();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle appointment submission
  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    // Validation: Ensure required fields are filled
    if (!formData.phone || !formData.disease || !formData.bp || !formData.weight || !formData.temperature || !selectedDoctorId || !formData.datetime) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

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
        doctor_id: selectedDoctorId,
        patient_phone: formData.phone,
        health_condition: formData.disease,
        blood_pressure: formData.bp,
        weight: formData.weight,
        body_temp: formData.temperature,
        ready: formData.readyToBook === "yes",
        appointment_sch: new Date(formData.datetime).toLocaleTimeString(),
      },
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "http://51.21.150.1:8000/doctor/book_appointment/",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            accesstoken: accessToken,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Appointment booked successfully!");
        setFormData({
          phone: "",
          disease: "",
          bp: "",
          weight: "",
          temperature: "",
          datetime: "",
          readyToBook: "",
        });
        setSelectedDoctorId("");
        navigate("/Staffdash");
      } else {
        setErrorMessage("Failed to book the appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error.response || error);
      setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }

  
  };



  return (
    <div className="doc">
      <Signout />
      <center><h1>Book Appointment</h1></center>
      <form>
        <div>
          <label>Patient Contact:</label>
          <input type="number" name="phone" value={formData.phone} onChange={handleChange} disabled={isSubmitting} />
        </div>
        <div>
          <label>Disease:</label>
          <input type="text" name="disease" value={formData.disease} onChange={handleChange} required disabled={isSubmitting} />
        </div>
        <div>
          <label>Select Doctor:</label>
          <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} disabled={isSubmitting}>
            <option value="">-- Select a Doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor.user_id} value={doctor.user_id}>
                {doctor.full_name} ({doctor.designation})
              </option>
            ))}
          </select>
        </div>
        <br />
        <label>Vitals</label>
        <div>
          <label>Blood Pressure (BP):</label>
          <input type="text" name="bp" value={formData.bp} onChange={handleChange} required disabled={isSubmitting} />
        </div>
        <div>
          <label>Temperature (°C):</label>
          <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} required disabled={isSubmitting} />
        </div>
        <div>
          <label>Weight (kg):</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} required disabled={isSubmitting} />
        </div>
        <br />
        <div>
          <label>Ready to book?</label>
          <div>
            <label><input type="radio" name="readyToBook" value="yes" checked={formData.readyToBook === "yes"} onChange={handleChange} disabled={isSubmitting} /> Yes</label>
            <label><input type="radio" name="readyToBook" value="no" checked={formData.readyToBook === "no"} onChange={handleChange} disabled={isSubmitting} /> No</label>
          </div>
        </div>
        <div>
          <label>Preferred Date & Time:</label>
          <input type="datetime-local" name="datetime" value={formData.datetime} onChange={handleChange} required disabled={isSubmitting} />
        </div>
        <br />
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
        <div>
          <button type="button" className="btn btn-success" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save & Book Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Appointment;