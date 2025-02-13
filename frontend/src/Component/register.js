import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EnterCode from "./enterCode";
import styles from "./Register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [showEnterCode, setShowEnterCode] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setEmail(formData.email);
        setShowEnterCode(true);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
    }
  };

  const handleCloseEnterCode = () => {
    setShowEnterCode(false);
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h1>Create Account</h1>
          <p>Join us today! Please fill in your details</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.submitButton}>Create Account</button>
          <div className={styles.login}>
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </form>
      </div>
      {showEnterCode && <EnterCode email={email} onClose={handleCloseEnterCode} />}
    </div>
  );
};

export default Register;