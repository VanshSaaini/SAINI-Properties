import { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthForm.css";

export default function Register() {
  const [registration, setRegistration] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  function handleChange(e) {
    setRegistration({
      ...registration,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(registration);
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Create <span>Account</span></h2>
          <p>Join SAINI Properties to find your dream home</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">Create Account</button>
        </form>

        <p className="auth-footer-text">
          Already have an account?
          <Link to="/login" className="auth-link">Login here</Link>
        </p>
      </div>
    </div>
  );
}