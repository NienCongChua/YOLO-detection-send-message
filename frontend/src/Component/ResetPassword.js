import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const resetPassword = async () => {
      try {
        const res = await fetch(`http://localhost:5000/reset-password/${token}`, {
          method: "GET"
        });

        if (res.ok) { // Kiểm tra trạng thái phản hồi
          setMessage("Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ.");
          setTimeout(() => navigate("/login"), 3000); // Chuyển hướng sau 3 giây
      } else {
          const data = await res.json();
          setMessage(data.message || "Đặt lại mật khẩu thất bại.");
      }
      } catch (err) {
        setMessage("An error occurred while resetting the password");
      }
    };

    resetPassword();
  }, [token, navigate]);

  return (
    <div className={styles.container}>
      <h1>Reset Password</h1>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ResetPassword;