import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import EmailSentPage from "./pages/auth/EmailSent";
import ResetPasswordPage from "./pages/auth/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<EmailSentPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
