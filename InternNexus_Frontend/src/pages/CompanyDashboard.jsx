import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [myInternships, setMyInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("internships");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMyInternships();
    fetchApplications();
  }, []);

  const fetchMyInternships = async () => {
    try {
      const res = await API.get("/internships/mine");
      setMyInternships(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/company");
      setApplications(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/internships/${id}`);
      setMyInternships(myInternships.filter((i) => i.id !== id));
      setMessage({ text: "Internship deleted", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) { console.error(err); }
  };

  const handleStatus = async (id, status) => {
    try {
      await API.patch(`/applications/${id}/status`, { status });
      setMessage({ text: `Application ${status}!`, type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      fetchApplications();
    } catch (err) { console.error(err); }
  };

  const statusConfig = {
    accepted: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Accepted" },
    rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Rejected" },
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Pending" },
  };

  const pendingCount = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 style={{fontFamily: 'Fraunces, serif'}} className="text-xl font-bold text-indigo-950">InternNexus</h1>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate("/internships")}
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition px-3 py-1.5 rounded-lg hover:bg-indigo-50"
            >
              Browse All
            </button>
            <button
              onClick={() => navigate("/post-internship")}
              className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              + Post Internship
            </button>
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
          <h2 style={{fontFamily: 'Fraunces, serif'}} className="text-3xl font-bold text-gray-900">Company Dashboard</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage your internships and applicants</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-2xl font-bold text-gray-900">{myInternships.length}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Active Posts</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Total Applications</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
            <p className="text-xs text-amber-600 mt-0.5 font-medium">Pending Review</p>
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

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
          <button
            onClick={() => setActiveTab("internships")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "internships" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            My Internships ({myInternships.length})
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "applicants" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Applicants ({applications.length})
            {pendingCount > 0 && (
              <span className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "internships" && (
          <div className="grid gap-4">
            {myInternships.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-3">📋</p>
                <p className="font-medium">No internships posted yet</p>
                <button
                  onClick={() => navigate("/post-internship")}
                  className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Post your first internship
                </button>
              </div>
            ) : (
              myInternships.map((intern) => (
                <div key={intern.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{intern.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{intern.description}</p>
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
                        {/* Show how many applied to this internship */}
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                          {applications.filter((a) => a.title === intern.title).length} applicants
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(intern.id)}
                      className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "applicants" && (
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
        )}
      </div>
    </div>
  );
}