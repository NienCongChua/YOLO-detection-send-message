import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        email: identifier.includes('@') ? identifier : undefined,
        username: !identifier.includes('@') ? identifier : undefined,
        password: password,
      });
      localStorage.setItem("token", res.data.access_token);
      navigate("/home");
    } catch (error) {
      setMessage("Invalid credentials!");
    }
  };

  return React.createElement("div", { className: styles.container },
    React.createElement("div", { className: styles.loginCard },
      React.createElement("div", { className: styles.header },
        React.createElement("h1", null, "Welcome Back"),
        React.createElement("p", null, "Sign in to continue to your account")
      ),
      React.createElement("form", { onSubmit: handleSubmit, className: styles.form },
        React.createElement("div", { className: styles.formGroup },
          React.createElement("label", { htmlFor: "identifier" }, "Email Address or Username"),
          React.createElement("input", {
            type: "text",
            id: "identifier",
            value: identifier,
            onChange: (e) => setIdentifier(e.target.value),
            required: true,
            placeholder: "Enter your email or username"
          })
        ),
        React.createElement("div", { className: styles.formGroup },
          React.createElement("label", { htmlFor: "password" }, "Password"),
          React.createElement("input", {
            type: "password",
            id: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            placeholder: "Enter your password"
          })
        ),
        React.createElement("div", { className: styles.options },
          React.createElement("div", { className: styles.rememberMe },
            React.createElement("input", { type: "checkbox", id: "remember" }),
            React.createElement("label", { htmlFor: "remember" }, "Remember me")
          ),
          React.createElement(Link, {
            to: "/forgot-password",
            className: styles.forgotPassword
          }, "Forgot Password?")
        ),
        React.createElement("button", {
          type: "submit",
          className: styles.submitButton
        }, "Sign In"),
        message && React.createElement("p", { className: styles.errorMessage }, message),
        React.createElement("div", { className: styles.register },
          React.createElement("p", null,
            "Don't have an account? ",
            React.createElement(Link, { to: "/register" }, "Register")
          )
        )
      )
    )
  );
};

export default Login;