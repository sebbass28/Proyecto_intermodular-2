import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/auth/Register.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import Login from "./components/auth/Login.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
