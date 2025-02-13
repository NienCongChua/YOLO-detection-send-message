import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const resetPassword = async () => {
      try {
        const res = await fetch(`http://localhost:5000/reset-password/${token}`, {
          method: "GET"
        });

        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        setMessage("An error occurred while resetting the password");
      }
    };

    resetPassword();
  }, [token]);

  return (
    <div className={styles.container}>
      <h1>Reset Password</h1>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ResetPassword;