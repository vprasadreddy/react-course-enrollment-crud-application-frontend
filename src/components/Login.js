import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { BrowserRouter as Router, Link, Navigate } from "react-router-dom";
import { UserContext } from "../App";

function Login() {
  const { userData, setUserData } = useContext(UserContext);
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  let { email, password } = loginFormData;

  const handleInputChange = (e) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, e) => {
    //console.log(data, e);
    e.preventDefault();
    try {
      let response = await axios.post("/api/users/login", loginFormData);
      setUserData(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success(response.data.message);
    } catch (error) {
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        if (error.response.status == 400) {
          //console.log(error.response.data);
          toast.error(error.response.data.message);
        }
      } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        //console.log(error.request);
        toast.error(error.request);
      } else {
        // Something happened in setting up the request and triggered an Error
        console.log("Error", error.message);
      }
      console.log(error);
    }
  };

  const onError = (errors, e) => console.log(errors, e);
  if (localStorage.getItem("token")) {
    return <Navigate replace to="/home" />;
  }

  return (
    <React.Fragment>
      <div className="container-fluid h-100">
        <div className="row d-flex justify-content-center align-items-center h-100 mx-auto mt-5 login-box">
          <div className="col-sm-12">
            <h3 className="d-flex justify-content-center">Login</h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit, onError)} autoComplete="off">
            <div className="row mb-3">
              <label htmlFor="email" className="col-sm-12 col-form-label">
                Email
              </label>
              <div className="col-sm-12">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  {...register("email", { required: true })}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <span className="form-text small text-danger">
                    Email is required
                  </span>
                )}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="password" className="col-sm-12 col-form-label">
                Password
              </label>
              <div className="col-sm-12">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  {...register("password", { required: true })}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <span className="form-text small text-danger">
                    Password is required
                  </span>
                )}
              </div>
            </div>
            <input
              type="submit"
              name="submit"
              className="btn btn-warning text-white"
            />
            <span className="form-text small mt-3">
              Not registered yet? Click
              <Link to="/register"> here</Link> to register.
            </span>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Login;
