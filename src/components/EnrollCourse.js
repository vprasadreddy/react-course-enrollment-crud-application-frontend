import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  BrowserRouter as Router,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { UserContext } from "../App";

function EnrollCourse() {
  const history = useNavigate();
  const { userData, setUserData } = useContext(UserContext);
  const [myProfileData, setMyProfileData] = useState({});
  const [isAdmin, setIsAdmin] = useState(null);
  let token = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseid: "",
  });

  let { courseid } = formData;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    //console.log(formData);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const getCourses = async () => {
      let response = await axios.get("/api/courses/activeCourses");
      setCourses(response.data);
      //console.log(response.data);
    };
    getCourses();
  }, []);

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        let response = await axios.get("/api/users/myProfile", {
          headers: {
            "x-access-token": token,
          },
        });
        setUserData(response.data.user);
        setMyProfileData(response.data);
        setIsAdmin(response.data.user.isAdmin);
        //console.log(userData);
      } catch (error) {
        if (error.response) {
          if (error.response.status == 400) {
            toast.error(error.response.data.message);
          }
        } else if (error.request) {
          toast.error(error.request);
        } else {
        }
      }
    };
    getMyProfile();
  }, []);

  const onSubmit = async (data, e) => {
    //console.log(data, e);
    e.preventDefault();
    try {
      let response = await axios.post(
        "/api/enrollments/enrollCourse",
        formData,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      toast.success(response.data.message);
      setTimeout(() => {
        history("/viewMyCourses");
        //return <Navigate replace to="/viewMyCourses" />;
      }, 2000);
    } catch (error) {
      if (error.response) {
        if (error.response.status == 400) {
          toast.error(error.response.data.message);
        }
      } else if (error.request) {
        toast.error(error.request);
      } else {
      }
    }
  };

  const onError = (errors, e) => console.log(errors, e);

  if (!token) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div>
      <React.Fragment>
        <div className="container-fluid h-100">
          <div className="row d-flex justify-content-center align-items-center h-100 mx-auto mt-2 enrollcourse-box">
            <h3 className="d-flex justify-content-center">Enroll a Course</h3>
            <form onSubmit={handleSubmit(onSubmit, onError)} autoComplete="off">
              <div className="row mb-3">
                <label htmlFor="courseid" className="col-sm-12 col-form-label">
                  Course
                </label>
                <div className="col-sm-12">
                  <select
                    className="custom-select"
                    id="courseid"
                    name="courseid"
                    {...register("courseid", { required: true })}
                    defaultValue=""
                    onChange={handleInputChange}
                  >
                    <option value="">Select a Course</option>
                    {courses.map((course, index) => {
                      return (
                        <option key={course._id} value={course._id}>
                          {course.name}
                        </option>
                      );
                    })}
                  </select>
                  {errors.course && (
                    <span className="form-text small text-danger">
                      Course is required
                    </span>
                  )}
                </div>
              </div>

              <input
                type="submit"
                name="submit"
                className="btn btn-warning text-white"
              />
            </form>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
}

export default EnrollCourse;
