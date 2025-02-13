import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./EnterCode.module.css";

const EnterCode = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/login");
      } else {
        setMessage(data.message || "Invalid code!");
      }
    } catch (error) {
      setMessage("An error occurred during verification");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.enterCodeCard}>
        <div className={styles.header}>
          <h1>Enter Code</h1>
          <p>Please enter the code sent to your email</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="code">Verification Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="Enter your code"
            />
          </div>
          <button type="submit" className={styles.submitButton}>Submit</button>
          {message && <p className={styles.errorMessage}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default EnterCode;