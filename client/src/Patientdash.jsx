import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Patientdash.css";
import axios from "axios";
import Signout from "./Signout";

const Patientdash = () => {
  const [patients, setPatients] = useState(() => {
    const savedPatients = localStorage.getItem("patients");
    return savedPatients ? JSON.parse(savedPatients) : [];
  });
  const [formData, setFormData] = useState({
    fullName: "",
    healthinfo: "",
    sex: "",
    dob: "",
    age: "",
    address: "",
    phone_no: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState(localStorage.getItem("doctorId") || "");
  const [doctors, setDoctors] = useState([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [foundPatient, setFoundPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
    if (patients.length > 0) {
      localStorage.setItem("registeredPatients", JSON.stringify(patients));
    }

    const timeout = setTimeout(() => {
      localStorage.removeItem("patients");
      setPatients([]);
    }, 60000); // 1 minute

    return () => clearTimeout(timeout);
  }, [patients]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "dob") {
      const age = calculateAge(value);
      newFormData = { ...newFormData, age };
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const selectedDoctor = doctors.find((doctor) => doctor.user_id === selectedDoctorId);
    const department = selectedDoctor ? selectedDoctor.designation : "Unknown";

    if (selectedDoctor) {
      localStorage.setItem("doctorDesignation", selectedDoctor.designation);
    }

    const payload = {
      auth_params: {
        user_id: localStorage.getItem("userId"),
        refresh_token: localStorage.getItem("refreshToken"),
      },
      payload: {
        full_name: formData.fullName,
        patient_phone: formData.phone_no,
        address: formData.address,
        sex: formData.sex,
        dob: formData.dob,
        health_info: formData.healthinfo,
        doctor_id: selectedDoctorId,
        department,
      },
    };

    try {
      const response = await axios.post(
        "http://51.21.150.1:8000/doctor/patient_register/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            accesstoken: localStorage.getItem("accessToken"),
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Patient registered successfully!");
        setPatients([...patients, { ...formData, doctor_id: selectedDoctorId, department }]);
        setFormData({
          fullName: "",
          healthinfo: "",
          sex: "",
          dob: "",
          age: "",
          address: "",
          phone_no: "",
        });
        setSelectedDoctorId("");
      } else {
        setErrorMessage("Failed to register the patient. Please try again.");
      }
    } catch (err) {
      console.error("Error registering patient:", err);
      setErrorMessage("An error occurred. Please check patient's details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookAppointment = (patient) => {
    navigate("/Appointment", { state: { patient, doctor: doctors } });
  };

  const handleSearch = () => {
    const allPatients = JSON.parse(localStorage.getItem("registeredPatients")) || [];
    const match = allPatients.find((p) => p.phone_no === searchPhone.trim());
    setFoundPatient(match);
    setShowModal(!!match);
  };

  const closeModal = () => {
    setShowModal(false);
    setSearchPhone("");
    setFoundPatient(null);
  };

  return (
    <div className="app">
      <Signout />
      <h1>Patient Registration</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input type="text" name="healthinfo" placeholder="Health Information" value={formData.healthinfo} onChange={handleChange} required />
        <div>
          <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} disabled={isSubmitting}>
            <option value="">-- Select a Doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor.user_id} value={doctor.user_id}>
                {doctor.full_name} ({doctor.designation})
              </option>
            ))}
          </select>
        </div>
        <select name="sex" value={formData.sex} onChange={handleChange} required>
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        <p>Age: {formData.age}</p>
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <input type="tel" name="phone_no" placeholder="Phone" value={formData.phone_no} onChange={handleChange} pattern="[0-9]{10}" maxLength="10" required />
        <button type="submit" disabled={isSubmitting}>Add Patient</button>
      </form>

      <br />
      <div className="registered-patients">
        <center><h2>Registered Patients</h2></center>
        <div className="search-container">
        <input
          type="text"
          pattern="[0-9]{10}" 
          maxLength="10"
          value={searchPhone}

          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        </div>


        {patients.length > 0 ? (
          <ul>
            {patients.map((patient, index) => (
              <li key={index}>
                <p><strong>Name:</strong> {patient.fullName}</p>
                <p><strong>Contact Number:</strong> {patient.phone_no}</p>
                <p><strong>Sex:</strong> {patient.sex}</p>
                <p><strong>DOB:</strong> {patient.dob}</p>
                <p><strong>Age:</strong> {patient.age}</p>
                <button type="button" onClick={() => handleBookAppointment(patient)}>
                  Book Appointment
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No registered patients found.</p>
        )}
      </div>

      {showModal && foundPatient && (
        <div className="modal">
          <div className="modal-content">
            <h3>Patient Details</h3>
            <p><strong>Name:</strong> {foundPatient.fullName}</p>
            <p><strong>Phone:</strong> {foundPatient.phone_no}</p>
            <p><strong>Age:</strong> {foundPatient.age}</p>
            <p><strong>Sex:</strong> {foundPatient.sex}</p>
            <p><strong>Address:</strong> {foundPatient.address}</p>
            <p><strong>Health Info:</strong> {foundPatient.healthinfo}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patientdash;