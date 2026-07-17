import { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthForm.css";

export default function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  function handleChange(e) {
    setLogin({
      ...login,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(login);
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Welcome <span>Back</span></h2>
          <p>Login to manage your property selections</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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

          <button type="submit" className="auth-submit-btn">Sign In</button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?
          <Link to="/register" className="auth-link">Register here</Link>
        </p>
      </div>
    </div>
  );
}