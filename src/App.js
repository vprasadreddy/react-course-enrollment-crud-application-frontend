import "./App.css";
import React, { useState, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ViewMyCourses from "./components/ViewMyCourses";
import EnrollCourse from "./components/EnrollCourse";
import AdminDashboard from "./components/AdminDashboard";
import Logout from "./components/Logout";
import PageNotFound from "./components/PageNotFound";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

export const UserContext = createContext();

function App() {
  console.log(process.env.NODE_ENV);
  console.log(process.env.REACT_APP_BASEURL_LOCAL);
  const [userData, setUserData] = useState(null);
  const [myProfileData, setMyProfileData] = useState({});
  const [isAdmin, setIsAdmin] = useState(null);
  let token = localStorage.getItem("token");
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
            //console.log(error.response.data);
            toast.error(error.response.data.message);
          }
        } else if (error.request) {
          toast.error(error.request);
        } else {
          // Something happened in setting up the request and triggered an Error
          //console.log("Error", error.message);
        }
        //console.log(error);
      }
    };
    getMyProfile();
  }, []);

  return (
    <div className="App">
      <UserContext.Provider
        value={{
          userData,
          setUserData,
          myProfileData,
          setMyProfileData,
          isAdmin,
          setIsAdmin,
        }}
      >
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/viewMyCourses" element={<ViewMyCourses />} />
            <Route path="/enrollCourse" element={<EnrollCourse />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </UserContext.Provider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ScrollToTop />
    </div>
  );
}

export default App;
