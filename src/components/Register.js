import axios from "axios";
import React, { useState, useEffect } from "react";
import blankprofile from "../assests/blankprofile.png";
import { useForm } from "react-hook-form";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useRouteMatch,
  useParams,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Register() {
  const history = useNavigate();
  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  let { name, email, password } = registerFormData;

  const handleInputChange = (e) => {
    setRegisterFormData({
      ...registerFormData,
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
      let response = await axios.post("/api/users/register", registerFormData);
      toast.success(response.data.message);
      setRegisterFormData({
        name: "",
        email: "",
        password: "",
      });
      setTimeout(() => {
        history("/login");
        //return <Navigate replace to="/viewMyCourses" />;
      }, 1000);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const onError = (errors, e) => console.log(errors, e);
  return (
    <React.Fragment>
      <div className="container-fluid h-100">
        <div className="row d-flex justify-content-center align-items-center h-100 mx-auto mt-5 register-box">
          <h3 className="d-flex justify-content-center">Register</h3>
          <form onSubmit={handleSubmit(onSubmit, onError)} autoComplete="off">
            <div className="row mb-3">
              <label htmlFor="name" className="col-sm-12 col-form-label">
                Name
              </label>
              <div className="col-sm-12">
                <input
                  type="name"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={name}
                  {...register("name", { required: true })}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <span className="form-text small text-danger">
                    Name is required
                  </span>
                )}
              </div>
            </div>
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
              value="Register"
              className="btn btn-warning text-white"
            />
            <span className="form-text small mt-3">
              Already registered? Click
              <Link to="/login"> here</Link> to login.
            </span>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Register;
