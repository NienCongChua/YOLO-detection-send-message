import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
    }
  };

  return React.createElement("div", { className: styles.container },
    React.createElement("div", { className: styles.registerCard },
      React.createElement("div", { className: styles.header },
        React.createElement("h1", null, "Create Account"),
        React.createElement("p", null, "Join us today! Please fill in your details")
      ),
      React.createElement("form", { onSubmit: handleSubmit, className: styles.form },
        React.createElement("div", { className: styles.formGroup },
          React.createElement("label", { htmlFor: "username" }, "Username"),
          React.createElement("input", {
            type: "text",
            id: "username",
            name: "username",
            value: formData.username,
            onChange: handleChange,
            required: true,
            placeholder: "Choose a username"
          })
        ),
        React.createElement("div", { className: styles.formGroup },
          React.createElement("label", { htmlFor: "email" }, "Email Address"),
          React.createElement("input", {
            type: "email",
            id: "email",
            name: "email",
            value: formData.email,
            onChange: handleChange,
            required: true,
            placeholder: "Enter your email"
          })
        ),
        React.createElement("div", { className: styles.formGroup },
          React.createElement("label", { htmlFor: "password" }, "Password"),
          React.createElement("input", {
            type: "password",
            id: "password",
            name: "password",
            value: formData.password,
            onChange: handleChange,
            required: true,
            placeholder: "Create a password"
          })
        ),
        React.createElement("div", { className: styles.formGroup },
          React.createElement("label", { htmlFor: "confirmPassword" }, "Confirm Password"),
          React.createElement("input", {
            type: "password",
            id: "confirmPassword",
            name: "confirmPassword",
            value: formData.confirmPassword,
            onChange: handleChange,
            required: true,
            placeholder: "Confirm your password"
          })
        ),
        error && React.createElement("p", { className: styles.errorMessage }, error),
        React.createElement("button", {
          type: "submit",
          className: styles.submitButton
        }, "Create Account"),
        React.createElement("div", { className: styles.login },
          React.createElement("p", null,
            "Already have an account? ",
            React.createElement(Link, { to: "/login" }, "Sign In")
          )
        )
      )
    )
  );
};

export default Register;