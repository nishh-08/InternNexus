import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Internships from "./pages/Internships";
import MyApplications from "./pages/MyApplications";
import CompanyDashboard from "./pages/CompanyDashboard";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}