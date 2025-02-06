import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        email: email,
        password: password,
      });
      localStorage.setItem("token", res.data.access_token);
      navigate("/home");
    } catch (error) {
      setMessage("Invalid credentials!");
    }
  };

  return (
    <div>
      <section className="vh-100" style={{ backgroundColor: "#777" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
                <div className="card-body p-5">
                  <h2 className="mb-5 text-center header-lable">LOGIN</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                      <label className="form-label" htmlFor="typeEmailX-2">Email</label>
                      <input type="email" id="typeEmailX-2" className="form-control form-control-lg"
                        placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label" htmlFor="typePasswordX-2">Password</label>
                      <input type="password" id="typePasswordX-2" className="form-control form-control-lg"
                        placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <div className="form-check d-flex justify-content-start mb-4">
                      <input className="form-check-input" type="checkbox" value="" id="form1Example3" />
                      <label className="form-check-label" htmlFor="form1Example3">Remember password</label>
                    </div>

                    <button className="btn btn-primary btn-lg btn-block btn-submit" type="submit">Login</button>
                    {message && <p className="text-danger mt-3">{message}</p>}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;