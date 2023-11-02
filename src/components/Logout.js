import React, { useState, useEffect, useContext } from "react";
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

function Logout() {
  useEffect(() => {
    localStorage.setItem("token", "");
    localStorage.setItem("user", "");
    return <Navigate replace to="/login" />;
  }, []);
  return (
    <div>
      <h1>logout</h1>
    </div>
  );
}

export default Logout;
