import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Internships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [stipendFilter, setStipendFilter] = useState("");
  const [message, setMessage] = useState("");
  const [appliedIds, setAppliedIds] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchInternships();
    if (user?.role === "student") fetchApplied();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await API.get("/internships");
      setInternships(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplied = async () => {
    try {
      const res = await API.get("/applications/student");
      const ids = res.data.map((app) => app.internship_id);
      setAppliedIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (title = search, location = locationFilter, stipend = stipendFilter) => {
    try {
      const res = await API.get(
        `/internships/search?title=${title}&location=${location}&stipend=${stipend}`
      );
      setInternships(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (internship_id) => {
    try {
      await API.post("/applications/apply", { internship_id });
      setAppliedIds([...appliedIds, internship_id]);
      setMessage("Applied successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/internships/${id}`);
      setInternships(internships.filter((intern) => intern.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">InternNexus</h1>
        <div className="flex gap-4 items-center">
          {user?.role === "student" && (
            <button
              onClick={() => navigate("/my-applications")}
              className="bg-white text-indigo-600 px-4 py-1 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              My Applications
            </button>
          )}
          {user?.role === "company" && (
            <button
              onClick={() => navigate("/company-dashboard")}
              className="bg-white text-indigo-600 px-4 py-1 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Dashboard
            </button>
          )}
          <span className="text-indigo-200">Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Internships</h2>

        {/* Search Bar */}
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search internships by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value, locationFilter, stipendFilter);
          }}
        />

        {/* Filters Row */}
        <div className="flex gap-3 mb-6">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              handleSearch(search, e.target.value, stipendFilter);
            }}
          />
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={stipendFilter}
            onChange={(e) => {
              setStipendFilter(e.target.value);
              handleSearch(search, locationFilter, e.target.value);
            }}
          >
            <option value="">Any Stipend</option>
            <option value="1000">₹1000+</option>
            <option value="3000">₹3000+</option>
            <option value="5000">₹5000+</option>
            <option value="10000">₹10000+</option>
          </select>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-center font-semibold ${
            message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Internship Cards */}
        <div className="grid gap-4">
          {internships.length === 0 ? (
            <p className="text-center text-gray-500">No internships found</p>
          ) : (
            internships.map((intern) => (
              <div key={intern.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{intern.title}</h3>
                    <p className="text-indigo-600 font-semibold">{intern.company_name}</p>
                    <p className="text-gray-500 mt-1">{intern.description}</p>
                    <div className="flex gap-4 mt-3">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                        📍 {intern.location}
                      </span>
                      <span className="bg-green-100 px-3 py-1 rounded-full text-sm text-green-700">
                        💰 ₹{intern.stipend}/month
                      </span>
                    </div>
                  </div>
                  {user?.role === "student" && (
                    <button
                      onClick={() => !appliedIds.includes(intern.id) && handleApply(intern.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        appliedIds.includes(intern.id)
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {appliedIds.includes(intern.id) ? "Applied ✓" : "Apply"}
                    </button>
                  )}
                  {user?.role === "company" && (
                    <button
                      onClick={() => handleDelete(intern.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}