import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminkey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!fullName.trim()) {
      return "Full Name is required.";
    }
    if (!email || !emailRegex.test(email)) {
      return "Enter a valid email address.";
    }
    if (!password || password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    const validationError = validateInputs();
    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage("");
      return;
    }

    // Prepare the payload for the backend
    const requestBody = {
      auth_params : {},
      payload: {
        full_name: fullName,
        role: role,
        designation: designation,
        email_id: email,
        phone_no: phone || null,
        password: password,
        admin_key: adminKey,
      },
    };

    try {
      // Make the POST request to the backend
      const response = await axios.post(
        "http://51.21.150.1:8000/user/signup/",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success
      console.log(response.data);
      setErrorMessage("");
      setSuccessMessage("Sign up successful! Redirecting to login...");
      setFullName("");
      setRole("");
      setDesignation("")
      setEmail("");
      setPhone("");
      setPassword("");
      setAdminkey("");
      navigate('/')
    } catch (err) {
      // Handle errors
      console.error("Error Response:", err.response || err);
      if (err.response && err.response.status === 400) {
        setErrorMessage(err.response.data.error || "User already exists");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setSuccessMessage("");
    }
  };

  return (
    <section className="bg-light py-3 py-md-5 py-xl-8">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div className="mb-5">
              <div className="text-center mb-4">
                <img src="./logo.png" alt="Hospital Logo" width="50" height="50" />
                <h3 style={{ fontFamily: "serif" }}>VIMS</h3>
              </div>
            </div>
            <div className="card border border-light-subtle rounded-4">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <form onSubmit={handleSubmit}>
                  <h5 style={{ fontFamily: "serif" }} className="text-center mb-4">
                    SIGN UP
                  </h5>
                  <div className="row gy-3 overflow-hidden">
                    <p>
                      <b style={{ fontFamily: "initial" }}>
                        <sup>*</sup>All fields are mandatory
                      </b>
                    </p>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                        <label htmlFor="fullName" className="form-label">
                          Full Name
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
      <div className="form-floating mb-3">
        {/* Doctor Button */}
        <button
          type="button"
          className={`btn ${role === "doctor" ? "btn-info" : "btn-outline-info"}`}  // Active styling for Doctor
          onClick={() => setRole("doctor")}  // Set role to Doctor
        >
          Doctor
        </button>&nbsp;&nbsp;&nbsp;
        {/* Staff Button */}
        <button
          type="button"
          className={`btn ${role === "Staff" ? "btn-info" : "btn-outline-info"}`}  // Active styling for Staff
          onClick={() => setRole("Staff")}  // Set role to Staff
        >Staff</button>
        </div>
    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="designation"
                          placeholder="Email"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          required
                        />
                        <label htmlFor="designation" className="form-label">
                          Designation
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          placeholder="Phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          pattern="[0-9]{10}"
                          maxLength="10" 
                          required                       
                          />
                        <label htmlFor="phone" className="form-label">
                          Phone
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          id="adminKey"
                          placeholder="Admin Key"
                          value={adminKey}
                          onChange={(e) => setAdminkey(e.target.value)}
                          required
                        />
                        <label htmlFor="adminKey" className="form-label">
                          Admin Key
                        </label>
                      </div>
                    </div>
                    
                    {errorMessage && (
                      <small className="error-message" style={{ color: "red" }}>
                        {errorMessage}
                      </small>
                    )}
                    {successMessage && (
                      <small className="success-message" style={{ color: "green" }}>
                        {successMessage}
                      </small>
                    )}
                    <div className="col-12">
                      <div className="d-grid">
                        <button className="btn btn-info btn-lg" type="submit">
                          Sign up
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="m-0 text-secondary">
                Already have an account?{" "}
                <a href="/" className="link-info text-decoration-none">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
