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
    email: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctor, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));

    if (patients.length > 0) {
      localStorage.setItem("registeredPatients", JSON.stringify(patients));
    }
    setTimeout(() => {
      localStorage.removeItem("patients");
      setPatients([]);
    }, 60000); // Persist for 5 minutes
  }, [patients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      auth_params: {
        user_id: localStorage.getItem("userId"),
        refresh_token: localStorage.getItem("refreshToken"),
      },
      payload: {
        full_name: formData.fullName,
        email_id: formData.email,
        patient_phone: formData.phone_no,
        address: formData.address,
        sex: formData.sex,
        dob: formData.dob,
        health_info: formData.healthinfo,
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
        setSuccessMessage(editIndex !== null ? "Patient updated successfully!" : "Patient registered successfully!");

        let updatedPatients = [...patients];

        if (editIndex !== null) {
          updatedPatients[editIndex] = { ...formData };
          setEditIndex(null);
        } else {
          updatedPatients.push({ ...formData });
        }
  
        // Update localStorage
        localStorage.setItem("registeredPatients", JSON.stringify(updatedPatients));
  
        // Update state
        setPatients(updatedPatients);
        setSelectedPatient({ ...formData }); // Ensure modal shows updated data
        setSearchQuery(formData.phone_no); // Update search query if phone number changed
  
        // Clear form
        setFormData({
          fullName: "",
          healthinfo: "",
          sex: "",
          dob: "",
          age:"",
          address: "",
          phone_no: "",
          email: "",
        });
        clearTimeout(window.patientTimeout);
      window.patientTimeout = setTimeout(() => {
        localStorage.removeItem("registeredPatients");
        setPatients([]);
      }, 600000); // 10 minutes (600,000 ms)
      } else {
        setErrorMessage("Failed to register the patient. Please try again.");
      }
    } catch (err) {
      console.error("Error registering patient:", err);
      setErrorMessage("An Error Occurred. Re-Check Patient's details.");
    } finally {
      setIsSubmitting(false);
    }
  };
    // Fetch doctors and navigate to Appointment
    const handleFetchDoctorsAndNavigate = async (patient) => {

      const payload = {
          auth_params: {
            user_id: localStorage.getItem("userId"), 
            refresh_token: localStorage.getItem("refreshToken"),
          },
          payload: {
  
          },
        };
      try {
  
        const response = await axios.post(
          "http://51.21.150.1:8000/doctor/fetch_doctors/",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              accesstoken: localStorage.getItem("accessToken"),
            },
          }
        );
  
        setDoctors(response.data); // Assuming the response contains a list of doctors
        navigate('/Appointment', { state: { patient, doctor: response.data } });
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setErrorMessage("Failed to fetch doctors. Please try again.");
      }
    };
  
    
      const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
    
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
    
        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }
    
        return age;
      };

      const handleChange = (e) => {
        const dob = e.target.value;
        const age = calculateAge(dob);
    
        setFormData({ ...formData, dob, age });
      };

  const handleEdit = (index) => {
    setFormData(patients[index]);
    setEditIndex(index);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const storedPatients = JSON.parse(localStorage.getItem("registeredPatients")) || [];
    const foundPatient = storedPatients.find((p) => p.phone_no === e.target.value);
    setSelectedPatient(foundPatient || null);
  };

  const handleEditFromSearch = () => {
    if (!selectedPatient) return;
  
    // Load selected patient into the form for editing
    setFormData({ ...selectedPatient });
  
    // Find the index of the patient in localStorage
    let storedPatients = JSON.parse(localStorage.getItem("registeredPatients")) || [];
    const index = storedPatients.findIndex((p) => p.phone_no === selectedPatient.phone_no);
  
    if (index !== -1) {
      setEditIndex(index); // Set the edit index
    }
  };


  return (
    <div className="app">
      <Signout />
      <h1>Patient Registration</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
        <input type="text" placeholder="Health Information" value={formData.healthinfo} onChange={(e) => setFormData({ ...formData, healthinfo: e.target.value })} required />
        <select value={formData.sex} onChange={(e) => setFormData({ ...formData, sex: e.target.value })} required>
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" value={formData.dob} onChange={handleChange} required /><p>Age: {formData.age}</p>
        <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
        <input type="tel" placeholder="Phone" value={formData.phone_no} onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })} pattern="[0-9]{10}" maxLength="10" required />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        <button type="submit" disabled={isSubmitting}>{editIndex !== null ? "Update Patient" : "Add Patient"}</button>
      </form>
      <br />
      <br />
      
      <div className="search-container">
        <input className="search-bar" type="tel" placeholder="Search by Phone Number"  value={searchQuery} onChange={handleSearch} />
      </div>
      <br />
      <br />
      
      <div className="registered-patients">
        <center><h2>Registered Patients</h2></center>
        {patients.length > 0 ? (
          <ul>
            {patients.map((patient, index) => (
              <li key={index}>
                <p><strong>Name:</strong> {patient.fullName}</p>
                <p><strong>Contact Number:</strong> {patient.phone_no}</p>
                <p><strong>Sex:</strong> {patient.sex}</p>
                <p><strong>DOB:</strong>{patient.dob}</p>
                <p><strong>Age:</strong>{patient.age}</p>
                <p><strong>Email:</strong>{patient.email}</p>
                <button onClick={() => handleEdit(index)}>Edit</button>&nbsp;&nbsp;&nbsp;
                <button type="button" onClick={() => handleFetchDoctorsAndNavigate(patient)}>
                Regsiter
              </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No patients registered yet.</p>
        )}
      </div>
      
      {selectedPatient && (
        <div className="modal">
          <div className="modal-content">
            <h2>Patient Details</h2>
            <p><strong>Name:</strong> {selectedPatient.fullName}</p>
            <p><strong>Health Information:</strong> {selectedPatient.healthinfo}</p>
            <p><strong>Sex:</strong> {selectedPatient.sex}</p>
            <p><strong>DOB:</strong> {selectedPatient.dob}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone_no}</p>
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            <button onClick={() => handleEditFromSearch(selectedPatient)}>Edit</button>
            <button onClick={() => setSelectedPatient(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patientdash;
