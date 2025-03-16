import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Function to check if tokens are stored in localStorage
  const checkTokens = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userId = localStorage.getItem("userId");

    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);
    console.log("User ID:", userId);

    if (accessToken && refreshToken && userId) {
      console.log("Tokens are successfully stored in localStorage.");
    } else {
      console.log("Tokens are not found in localStorage.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      auth_params: {
        user_id: "",
        refresh_token: "",
      },
      payload: {
        email: email,
        role: role,
        password: password,
      },
    };

    try {
      // Make the POST request to the backend
      const response = await axios.post("http://51.21.150.1:8000/user/login/", requestBody);

      if (response && response.data) {
        console.log(response.data); // Log response data
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
        localStorage.setItem("userId", response.data.user_id);

        checkTokens(); // Check if tokens are stored in localStorage

        // Handle success
        setErrorMessage("");
        setSuccessMessage("Login successful! Redirecting to Home Page...");
        setEmail("");
        setRole("");
        setPassword("");
        navigate('/Patientdash');

        if (role == "doctor") {
          navigate('/Docdash');
        }
        else if (role == "Staff") {
          navigate('/Staffdash');
        }
        else {
          setErrorMessage('Unexpected role selected')
        }

      } else {
        setErrorMessage("Unexpected response structure.");
      }
    } catch (err) {
      console.error("Error Response:", err.response || err); // Log error details
      if (err.response && err.response.status === 400) {
        setErrorMessage(err.response.data.error || "Invalid email or password.");
      } else {
        setErrorMessage("Error. Please re-check your details.");
      }
      setSuccessMessage("");
    }
  };

  return (
    <section className="bg-light py-3 py-md-5 py-xl-8">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div className="text-center mb-4">
              <img
                src="./logo.png"
                alt="Hospital Logo"
                width="50"
                height="50"
              />
              <h3 style={{ fontFamily: "serif" }}>VIMS</h3>
            </div>
            <div className="card border border-light-subtle rounded-4">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <form onSubmit={handleSubmit}>
                  <h5 style={{ fontFamily: "serif" }} className="text-center mb-4">LOGIN</h5>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="loginInput" className="form-label">
                      Email ID
                    </label>
                  </div>
                  <div className="col-12">
                    <div className="form-floating mb-3">
                      <button
                        type="button"
                        className={`btn ${role === "doctor" ? "btn-info" : "btn-outline-info"}`}  // Active styling for Doctor
                        onClick={() => setRole("doctor")}  // Set role to Doctor
                      >
                        Doctor
                      </button>&nbsp;&nbsp;&nbsp;
                      <button
                        type="button"
                        className={`btn ${role === "Staff" ? "btn-info" : "btn-outline-info"}`}  // Active styling for Staff
                        onClick={() => setRole("Staff")}  // Set role to Staff
                      >
                        Staff
                      </button>
                    </div>
                  </div>
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
                    <label htmlFor="password" className="form-label">Password</label>
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
                  <div className="d-grid">
                    <button className="btn btn-info btn-lg" type="submit">
                      Log In
                    </button>
                  </div>
                  <div className="text-center mt-3">
                    <a href="#!" className="text-secondary text-decoration-none">
                      Forgot your password?
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="m-0 text-secondary">
                Don't have an account?{' '}
                <a href="/Signup" className="link-info text-decoration-none">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;