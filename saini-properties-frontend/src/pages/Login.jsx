import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "./AuthForm.css";

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    
    const targetRedirect = localStorage.getItem("redirectTo");

    try {
      const response = await login(credentials); 
      localStorage.setItem("token", JSON.stringify(response.data)); 
      alert("Login Successful!");

      if (targetRedirect) {
        localStorage.removeItem("redirectTo");
        navigate(targetRedirect); // Redirect back to specific property layout page
      } else {
        navigate("/"); // Default home page redirect on standard login
      }
    } catch (err) {
      // On failure, clear saved target route and redirect to home page
      localStorage.removeItem("redirectTo");
      
      if (err.response?.data && typeof err.response.data === "object") {
        setError(err.response.data.message || err.response.data.error || "Login failed.");
      } else {
        setError(err.response?.data || "An error occurred during login.");
      }
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Welcome <span>Back</span></h2>
          <p>Sign in to manage your real estate preferences</p>
        </div>

        {error && <p className="auth-error-msg" style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="name@example.com" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <button type="submit" className="auth-submit-btn">Login</button>
        </form>

        <p className="auth-footer-text">
          Don't have an account yet? <Link to="/register" className="auth-link">Register here</Link>
        </p>
      </div>
    </div>
  );
}