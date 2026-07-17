import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "./AuthForm.css";

export default function Register() {
  const navigate = useNavigate();
  const [registration, setRegistration] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setRegistration({
      ...registration,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  try {
    await register(registration); // or whatever your registration state variable is named
    alert("Registration Successful!");
    navigate("/login");
  } catch (err) {
    // Look closely here: Extract the string, never set 'error' to a raw object!
    if (err.response?.data && typeof err.response.data === "object") {
      setError(err.response.data.message || err.response.data.error || "Registration failed.");
    } else {
      setError(err.response?.data || "An error occurred during registration.");
    }
  }
}

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Create <span>Account</span></h2>
          <p>Join SAINI Properties to find your dream home</p>
        </div>

        {error && <p className="auth-error-msg" style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" placeholder="John Doe" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="name@example.com" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <button type="submit" className="auth-submit-btn">Create Account</button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Login here</Link>
        </p>
      </div>
    </div>
  );
}