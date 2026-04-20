import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Internships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [stipendFilter, setStipendFilter] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
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
    } catch (err) { console.error(err); }
  };

  const fetchApplied = async () => {
    try {
      const res = await API.get("/applications/student");
      setAppliedIds(res.data.map((app) => app.internship_id));
    } catch (err) { console.error(err); }
  };

  const handleSearch = async (title = search, location = locationFilter, stipend = stipendFilter) => {
    try {
      const res = await API.get(`/internships/search?title=${title}&location=${location}&stipend=${stipend}`);
      setInternships(res.data);
    } catch (err) { console.error(err); }
  };

  const handleApply = async (internship_id) => {
    try {
      await API.post("/applications/apply", { internship_id });
      setAppliedIds([...appliedIds, internship_id]);
      setMessage({ text: "Application submitted!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to apply", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 style={{fontFamily: 'Fraunces, serif'}} className="text-xl font-bold text-indigo-950">InternNexus</h1>
          <div className="flex gap-3 items-center">
            {/* Student nav links */}
            {user?.role === "student" && (
              <button
                onClick={() => navigate("/my-applications")}
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition px-3 py-1.5 rounded-lg hover:bg-indigo-50"
              >
                My Applications
              </button>
            )}
            {/* Company nav links */}
            {user?.role === "company" && (
              <button
                onClick={() => navigate("/company-dashboard")}
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition px-3 py-1.5 rounded-lg hover:bg-indigo-50"
              >
                My Dashboard
              </button>
            )}
            {/* User avatar */}
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
            </div>
            <button
              onClick={() => { localStorage.clear(); navigate("/login"); }}
              className="text-sm text-gray-500 hover:text-red-600 font-medium transition px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="mb-8">
          <h2 style={{fontFamily: 'Fraunces, serif'}} className="text-3xl font-bold text-gray-900">Internships</h2>
          <p className="text-gray-500 mt-1 text-sm">{internships.length} opportunities available</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col gap-3">
          <input
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Search by job title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); handleSearch(e.target.value, locationFilter, stipendFilter); }}
          />
          <div className="flex gap-3">
            <input
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Location..."
              value={locationFilter}
              onChange={(e) => { setLocationFilter(e.target.value); handleSearch(search, e.target.value, stipendFilter); }}
            />
            <select
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={stipendFilter}
              onChange={(e) => { setStipendFilter(e.target.value); handleSearch(search, locationFilter, e.target.value); }}
            >
              <option value="">Any Stipend</option>
              <option value="unpaid">Unpaid only</option>
              <option value="1000">₹1,000+</option>
              <option value="3000">₹3,000+</option>
              <option value="5000">₹5,000+</option>
              <option value="10000">₹10,000+</option>
            </select>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-3.5 rounded-xl mb-5 text-sm font-medium text-center ${
            message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        {/* Cards */}
        <div className="grid gap-4">
          {internships.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">🔍</p>
              <p className="font-medium">No internships found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            internships.map((intern) => (
              <div key={intern.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-indigo-200 hover:shadow-sm transition">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4 items-start">
                    {/* Company avatar */}
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-700 font-bold text-lg">{intern.company_name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{intern.title}</h3>
                      <p className="text-indigo-600 text-sm font-medium">{intern.company_name}</p>
                      <p className="text-gray-500 text-sm mt-1.5">{intern.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          📍 {intern.location}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          parseInt(intern.stipend) === 0 ? "bg-orange-50 text-orange-700" : "bg-green-50 text-green-700"
                        }`}>
                          {parseInt(intern.stipend) === 0 ? "Unpaid" : `₹${parseInt(intern.stipend).toLocaleString()}/month`}
                        </span>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                          {new Date(intern.posted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Apply button — students only */}
                  {user?.role === "student" && (
                    <button
                      onClick={() => !appliedIds.includes(intern.id) && handleApply(intern.id)}
                      className={`flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition ${
                        appliedIds.includes(intern.id)
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {appliedIds.includes(intern.id) ? "Applied ✓" : "Apply"}
                    </button>
                  )}

                  {/* Companies just browse — no actions on public feed */}
                  {user?.role === "company" && (
                    <span className="flex-shrink-0 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                      Viewing as company
                    </span>
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