import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/company");
      setApplications(res.data);
    } catch (err) { console.error(err); }
  };

  const handleStatus = async (id, status) => {
    try {
      await API.patch(`/applications/${id}/status`, { status });
      setMessage(`Application ${status}!`);
      setTimeout(() => setMessage(""), 3000);
      fetchApplications();
    } catch (err) { console.error(err); }
  };

  const statusConfig = {
    accepted: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Accepted" },
    rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Rejected" },
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Pending" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 style={{fontFamily: 'Fraunces, serif'}} className="text-xl font-bold text-indigo-950">InternNexus</h1>
          <button
            onClick={() => navigate("/internships")}
            className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition px-3 py-1.5 rounded-lg hover:bg-indigo-50"
          >
            ← View Internships
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h2 style={{fontFamily: 'Fraunces, serif'}} className="text-3xl font-bold text-gray-900">Applicants Dashboard</h2>
          <p className="text-gray-500 mt-1 text-sm">{applications.length} total applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {["pending", "accepted", "rejected"].map((status) => {
            const count = applications.filter((a) => a.status === status).length;
            const cfg = statusConfig[status];
            return (
              <div key={status} className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4`}>
                <p className={`text-2xl font-bold ${cfg.text}`}>{count}</p>
                <p className={`text-xs font-medium mt-0.5 ${cfg.text} opacity-80`}>{cfg.label}</p>
              </div>
            );
          })}
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium text-center">
            {message}
          </div>
        )}

        <div className="grid gap-4">
          {applications.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">👥</p>
              <p className="font-medium">No applications yet</p>
              <p className="text-sm mt-1">Applications will appear here when students apply</p>
            </div>
          ) : (
            applications.map((app) => {
              const cfg = statusConfig[app.status] || statusConfig.pending;
              return (
                <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-700 font-bold">{app.student_name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.student_name}</h3>
                        <p className="text-gray-500 text-sm">{app.student_email}</p>
                        <p className="text-indigo-600 text-sm font-medium mt-1">Applied for: {app.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`${cfg.bg} ${cfg.text} border ${cfg.border} px-3 py-1 rounded-full text-xs font-semibold`}>
                        {cfg.label}
                      </span>
                      {app.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatus(app.id, "accepted")}
                            className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition text-xs font-semibold"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatus(app.id, "rejected")}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}