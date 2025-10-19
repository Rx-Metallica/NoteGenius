// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Note from "../pages/Note.jsx";
import ChatAI from "../pages/ChatAI.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Analytics from "../pages/Analytics.jsx";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute element={<Note />} />} />
      <Route path="/chat" element={<ProtectedRoute element={<ChatAI />} />} />
      <Route path="/analytics" element={<ProtectedRoute element={<Analytics />} />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
