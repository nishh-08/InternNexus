import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/company");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await API.patch(`/applications/${id}/status`, { status });
      setMessage(`Application ${status} successfully!`);
      setTimeout(() => setMessage(""), 3000);
      fetchApplications();
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
          View Internships
        </button>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Applicants Dashboard</h2>

        {message && (
          <div className="p-3 rounded-lg mb-4 text-center font-semibold bg-green-100 text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-4">
          {applications.length === 0 ? (
            <p className="text-center text-gray-500">No applications yet</p>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{app.student_name}</h3>
                    <p className="text-gray-500">{app.student_email}</p>
                    <p className="text-indigo-600 font-semibold mt-1">Applied for: {app.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Applied on {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatus(app.id, "accepted")}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatus(app.id, "rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}