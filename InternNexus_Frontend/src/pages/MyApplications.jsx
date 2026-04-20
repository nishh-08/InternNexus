import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/student");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">InternNexus</h1>
        <button
          onClick={() => navigate("/internships")}
          className="bg-white text-indigo-600 px-4 py-1 rounded-lg font-semibold hover:bg-indigo-50 transition"
        >
          Back to Internships
        </button>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h2>

        <div className="grid gap-4">
          {applications.length === 0 ? (
            <p className="text-center text-gray-500">You haven't applied to any internships yet</p>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{app.title}</h3>
                    <p className="text-indigo-600 font-semibold">{app.company_name}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm text-gray-500">📍 {app.location}</span>
                      <span className="text-sm text-gray-500">💰 ₹{app.stipend}/month</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Applied on {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}