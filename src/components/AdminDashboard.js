import React, { useState, useEffect, useContext } from "react";
import { Table, Modal, Button, ListGroup } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faArrowCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function AdminDashboard() {
  const {
    userData,
    setUserData,
    myProfileData,
    setMyProfileData,
    isAdmin,
    setIsAdmin,
  } = useContext(UserContext);
  const history = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [addCourseModalShow, setAddCourseModalShow] = useState(false);
  const [updatedCourse, setUpdatedCourse] = useState({
    name: "",
    isActive: true,
    _id: "",
  });
  const [updateCourseModalShow, setUpdateCourseModalShow] = useState(false);
  let token = localStorage.getItem("token");
  if (localStorage.getItem("user")) {
    let user = JSON.parse(localStorage.getItem("user"));
  }

  const addCourseModalOpen = () => {
    setAddCourseModalShow(true);
  };

  const addCourseModalClose = () => {
    setAddCourseModalShow(false);
  };

  const updateCourseModalOpen = (course) => {
    let { name, isActive, _id } = course;
    setUpdateCourseModalShow(true);
    setUpdatedCourse({ ...updatedCourse, name, isActive, _id });
  };

  const updateCourseModalClose = () => {
    setUpdateCourseModalShow(false);
  };

  const handleCourseUpdate = (e) => {
    if (e.target.type == "checkbox") {
      setUpdatedCourse({
        ...updatedCourse,
        [e.target.name]: !updatedCourse[e.target.name],
      });
    } else {
      setUpdatedCourse({ ...updatedCourse, [e.target.name]: e.target.value });
    }
    //console.log(updatedCourse);
  };

  useEffect(() => {
    getCourses();
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      let response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
        }
        if (error.response.status === 401) {
          toast.error(error.errormessage);
        }
      } else if (error.request) {
        toast.error(error.request);
      } else {
      }
    }
  };
  //Get all courses
  const getCourses = async () => {
    try {
      let response = await axios.get("/api/courses", {
        headers: {
          "x-access-token": token,
        },
      });
      setAllCourses(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
        }
        if (error.response.status === 401) {
          toast.error(error.errormessage);
        }
      } else if (error.request) {
        toast.error(error.request);
      } else {
        console.log("Error", error.message);
      }
    }
  };

  //Add course
  const addCourse = async () => {
    let courseData = {
      name: courseName,
    };
    try {
      let response = await axios.post("/api/courses/add", courseData, {
        headers: {
          "x-access-token": token,
        },
      });
      setCourseName();
      addCourseModalClose();
      getCourses();
      toast.success("course addedd successfully");
    } catch (error) {
      setCourseName();
      addCourseModalClose();
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
        }
        if (error.response.status === 401) {
          toast.error(error);
        }
      } else if (error.request) {
        toast.error(error.request);
      } else {
        toast.error(error.errormessage);
      }

      toast.error(error);
    }
  };

  //Update course
  const updateCourse = async () => {
    let confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, make changes to the couse!",
    });
    //console.log(confirmation);
    if (confirmation.isConfirmed) {
      try {
        const headers = {
          headers: {
            "x-access-token": token,
          },
        };
        let response = await axios.put(
          "/api/courses/updatecourse",
          updatedCourse,
          headers
        );
        getCourses();
        updateCourseModalClose();
        toast.success("course updated successfully");
      } catch (error) {
        updateCourseModalClose();
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.message);
            //alert(error.response.data.message);
          }
          if (error.response.status === 401) {
            toast.error(error);
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
        <h1 className="d-flex justify-content-center mt-2">
          Hello, {myProfileData?.user?.name}
        </h1>
        <div className="row d-flex justify-content-center align-items-center enrollments-row">
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-6 m-2 d-flex justify-content-center">
            <a onClick={addCourseModalOpen}>
              <div
                className="card add-course"
                style={{ width: "18rem", height: "15rem" }}
              >
                <div className="card-body view-my-courses-body">
                  <h5 className="card-title justify-content-center align-items-center">
                    Add Course
                  </h5>
                </div>
              </div>
            </a>
          </div>
        </div>
        <h3 className="mt-5">All Courses</h3>
        <div className="d-flex justify-content-center mt-3">
          <Table
            responsive
            striped
            bordered
            hover
            className="admin-courses-table"
          >
            <thead className="view-courses-table ">
              <tr>
                <th>#</th>
                <th>Course Name</th>
                <th>Is Active?</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allCourses.map((course, index) => {
                return (
                  <tr key={course._id}>
                    <td>{index + 1}</td>
                    <td>{course.name}</td>
                    <td>{course.isActive ? "true" : "false"}</td>
                    <td>
                      <a>
                        <FontAwesomeIcon
                          icon={faPencilAlt}
                          onClick={() => updateCourseModalOpen(course)}
                          className="admin-edit-course"
                          title="Edit Course"
                        />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <h3 className="mt-5">All Users</h3>
        <div className="d-flex justify-content-center mt-3">
          <Table
            responsive
            striped
            bordered
            hover
            className="admin-users-table"
          >
            <thead className="view-users-table">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Is Admin?</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                return (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "true" : "false"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <Modal
          show={addCourseModalShow}
          onHide={addCourseModalClose}
          animation={false}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              <form>
                <div className="form-group">
                  <label htmlFor="courseName">Course Name</label>
                  <input
                    type="input"
                    className="form-control"
                    id="courseName"
                    value={courseName}
                    placeholder="Course Name"
                    required
                    onChange={(e) => {
                      setCourseName(e.target.value);
                    }}
                  />
                </div>
              </form>
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="warning"
              className="text-white"
              onClick={addCourse}
            >
              Submit
            </Button>
            <Button variant="secondary" onClick={addCourseModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={updateCourseModalShow}
          onHide={updateCourseModalClose}
          animation={false}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Update Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              <form>
                <div className="form-group">
                  <label htmlFor="name">Course Name</label>
                  <input
                    type="input"
                    className="form-control"
                    id="name"
                    name="name"
                    value={updatedCourse.name}
                    placeholder="Course Name"
                    required
                    onChange={handleCourseUpdate}
                  />
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isActive"
                    name="isActive"
                    checked={updatedCourse.isActive}
                    required
                    onChange={handleCourseUpdate}
                  />
                  <label htmlFor="isActive" className="form-check-label">
                    Is Course Active?
                  </label>
                </div>
              </form>
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="warning"
              className="text-white"
              onClick={updateCourse}
            >
              Submit
            </Button>
            <Button variant="secondary" onClick={updateCourseModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </React.Fragment>
  );
}

export default AdminDashboard;
