import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import "./css/Prescription.css";

const Prescription = () => {
  const { state } = useLocation();
  const patient = state?.patient || {};
  const prescriptionRef = useRef(null); // Reference for printing & capturing

  const medicinesList = ["Pantaprozole", "Vibact", "Cremaffin"];

  const [prescriptionData, setPrescriptionData] = useState({
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (index, field, value) => {
    const updatedMedicines = [...prescriptionData.medicines];
    updatedMedicines[index][field] = value;
    setPrescriptionData({ ...prescriptionData, medicines: updatedMedicines });
  };

  const addMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { name: "", dosage: "", frequency: "", duration: "" }],
    });
  };

  const removeMedicine = (index) => {
    const updatedMedicines = prescriptionData.medicines.filter((_, i) => i !== index);
    setPrescriptionData({ ...prescriptionData, medicines: updatedMedicines });
  };

  const userId = localStorage.getItem("userId");
  const refreshToken = localStorage.getItem("refreshToken");

  const captureAndUploadPrescription = async () => {
    if (!prescriptionRef.current) return;

    try {
      const canvas = await html2canvas(prescriptionRef.current);
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("prescription", blob, "prescription.png");

        const requestBody = {
          auth_params: {
            user_id: userId,
            refresh_token: refreshToken,
          },
          payload: {
            appointment_id: patient?.appointment_id || "APPOINTMENT_ID_HERE",
            presecription: formData, // Attach prescription as binary
          },
        };

        const response = await fetch("http://51.21.150.1:8000/doctor/update_prescription/", {
          method: "POST",
          headers: {
            "Accept": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log("API Response:", data);
        alert("Prescription saved successfully!");

      }, "image/png");
    } catch (error) {
      console.error("Error capturing prescription:", error);
    }
  };

  const printPrescription = () => {
    const printContent = prescriptionRef.current;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();

    document.body.innerHTML = originalContent;
    window.location.reload(); // Restore UI
  };

  return (
    <div className="prescription">
      <h1>Prescription</h1>
      <div ref={prescriptionRef} className="prescription-container">
        <div className="patient-info">
          <p><strong>Patient Name:</strong> {patient.patient_id__full_name || "N/A"}</p>
          <p><strong>Contact:</strong> {patient.patient_id__phone_no || "N/A"}</p>
          <p><strong>Health Condition:</strong> {patient.patient_id__Health_info || "N/A"}</p>
          <p><strong>Date:</strong> {prescriptionData.date}</p>
        </div>

        <div className="medicine-section">
          <h3>Medicines</h3>
          {prescriptionData.medicines.map((med, index) => (
            <div key={index} className="medicine-row">
              <select value={med.name} onChange={(e) => handleChange(index, "name", e.target.value)} required>
                <option value="">Select Medicine</option>
                {medicinesList.map((medicine, i) => (
                  <option key={i} value={medicine}>{medicine}</option>
                ))}
              </select>
              <input type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => handleChange(index, "dosage", e.target.value)} required />
              <input type="text" placeholder="Frequency (e.g., 3 times/day)" value={med.frequency} onChange={(e) => handleChange(index, "frequency", e.target.value)} required />
              <input type="text" placeholder="Duration (e.g., 7 days)" value={med.duration} onChange={(e) => handleChange(index, "duration", e.target.value)} required />
              <button onClick={() => removeMedicine(index)}>Remove</button>
            </div>
          ))}
          <button onClick={addMedicine}>+ Add Medicine</button>
        </div>

        <br /><br />

        <div className="notes-section">
          <h3>DIAGNOSIS</h3>
          <textarea placeholder="Your Diagnosis here..." value={prescriptionData.notes} onChange={(e) => setPrescriptionData({ ...prescriptionData, notes: e.target.value })} />
        </div>
      </div>

      <button className="print-btn" onClick={printPrescription}>Print</button>
      <button className="upload-btn" onClick={captureAndUploadPrescription}>Save Prescription</button>
    </div>
  );
};

export default Prescription;