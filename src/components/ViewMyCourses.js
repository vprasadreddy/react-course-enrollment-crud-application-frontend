import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useRouteMatch,
  useParams,
  NavLink,
  Navigate,
} from "react-router-dom";
import { UserContext } from "../App";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faArrowCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function ViewMyCourses() {
  const {
    userData,
    setUserData,
    myProfileData,
    setMyProfileData,
    isAdmin,
    setIsAdmin,
  } = useContext(UserContext);
  let token = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getMyEnrollments();
  }, []);

  const getMyEnrollments = async () => {
    setIsLoading(true);
    let response = await axios.get("/api/enrollments/viewMyEnrollments", {
      headers: {
        "x-access-token": token,
      },
    });
    setCourses(response.data);
    setIsLoading(false);
    // console.log(response.data);
  };

  const deleteEnrollment = async (course) => {
    let { _id } = course.courseid;
    let confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I want to delete course!",
    });
    //console.log(confirmation);
    if (confirmation.isConfirmed) {
      try {
        const headers = {
          headers: {
            "x-access-token": token,
          },
        };
        let response = await axios.delete("/api/enrollments/deleteEnrollment", {
          headers: {
            "x-access-token": token,
          },
          data: {
            courseid: _id,
          },
        });
        getMyEnrollments();
        toast.success("Course deleted successfully");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400 || error.response.status === 401) {
            toast.error(error.response.data.message);
            //alert(error.response.data.message);
          }
        } else if (error.request) {
          toast.error(error.request);
        } else {
          toast.error(error.errormessage);
        }
        toast.error(error);
      }
    }
  };

  if (!token) {
    // history("/login");
    return <Navigate replace to="/login" />;
  }
  return (
    <React.Fragment>
      <div className="container-fluid h-100">
        {isLoading ? (
          <div className="d-flex justify-content-center">loading....</div>
        ) : courses.length > 0 ? (
          <>
            <div className="d-flex justify-content-center mt-2">
              {" "}
              <h5>My Courses</h5>
            </div>
            <div className="d-flex justify-content-center">
              <Table striped bordered hover className="courses-table">
                <thead className="view-my-courses-table">
                  <tr>
                    <th>#</th>
                    <th>Course Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => {
                    return (
                      <tr key={course._id}>
                        <td>{index + 1}</td>
                        <td>{course.courseid.name}</td>
                        <td>
                          <a>
                            <FontAwesomeIcon
                              icon={faTrash}
                              onClick={() => deleteEnrollment(course)}
                              className="admin-edit-course"
                              title="Delete Enrollment"
                            />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-center mt-2 font-italic">
              <div>
                <h3>Sorry, no enrollments found.</h3>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-2 font-italic">
              <p>
                Interested in enrolling in a new course? Click
                <Link to="/enrollCourse"> here </Link> to enroll.
              </p>
            </div>
          </>
        )}
      </div>
    </React.Fragment>
  );
}

export default ViewMyCourses;
