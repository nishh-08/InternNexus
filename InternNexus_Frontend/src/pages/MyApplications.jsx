import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/student");
      setApplications(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/applications/${id}`);
      setApplications(applications.filter((app) => app.id !== id));
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
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 style={{fontFamily: 'Fraunces, serif'}} className="text-xl font-bold text-indigo-950">InternNexus</h1>
          <button
            onClick={() => navigate("/internships")}
            className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition px-3 py-1.5 rounded-lg hover:bg-indigo-50"
          >
            ← Browse Internships
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h2 style={{fontFamily: 'Fraunces, serif'}} className="text-3xl font-bold text-gray-900">My Applications</h2>
          <p className="text-gray-500 mt-1 text-sm">{applications.length} applications total</p>
        </div>

        {/* Stats Row */}
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

        <div className="grid gap-4">
          {applications.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">📋</p>
              <p className="font-medium">No applications yet</p>
              <p className="text-sm mt-1">Start applying to internships!</p>
              <button onClick={() => navigate("/internships")} className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                Browse Internships
              </button>
            </div>
          ) : (
            applications.map((app) => {
              const cfg = statusConfig[app.status] || statusConfig.pending;
              return (
                <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-700 font-bold">{app.company_name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.title}</h3>
                        <p className="text-indigo-600 text-sm font-medium">{app.company_name}</p>
                        <div className="flex gap-3 mt-2">
                          <span className="text-xs text-gray-500">📍 {app.location}</span>
                          <span className="text-xs text-gray-500">
                              {parseInt(app.stipend) === 0 ? "Unpaid" : `₹${parseInt(app.stipend).toLocaleString()}/month`}
                          </span>
                          
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Applied {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`${cfg.bg} ${cfg.text} border ${cfg.border} px-3 py-1 rounded-full text-xs font-semibold`}>
                        {cfg.label}
                      </span>
                      {app.status === "pending" && (
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium transition"
                        >
                          Withdraw
                        </button>
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