import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-indigo-950 flex-col justify-between p-12">
        <div>
          <h1 style={{fontFamily: 'Fraunces, serif'}} className="text-white text-3xl font-bold">InternNexus</h1>
          <p className="text-indigo-300 mt-2 text-sm">Connecting talent with opportunity</p>
        </div>
        <div>
          <p style={{fontFamily: 'Fraunces, serif'}} className="text-white text-4xl leading-tight font-semibold">
            Join thousands<br/>of students &<br/>companies.
          </p>
          <p className="text-indigo-400 mt-4 text-sm leading-relaxed">
            Create your free account today.<br/>It only takes 30 seconds.
          </p>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-white text-2xl font-semibold">Free</p>
            <p className="text-indigo-400 text-xs">Always</p>
          </div>
          <div>
            <p className="text-white text-2xl font-semibold">30s</p>
            <p className="text-indigo-400 text-xs">To sign up</p>
          </div>
          <div>
            <p className="text-white text-2xl font-semibold">100%</p>
            <p className="text-indigo-400 text-xs">Verified companies</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 style={{fontFamily: 'Fraunces, serif'}} className="text-3xl font-bold text-gray-900">Create account</h2>
            <p className="text-gray-500 mt-1 text-sm">Get started for free today</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Full name</label>
              <input
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                name="name"
                placeholder="John Doe"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address</label>
              <input
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
              <input
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Selector */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "student" })}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition ${
                    form.role === "student"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "company" })}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition ${
                    form.role === "company"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  🏢 Company
                </button>
              </div>
            </div>

            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="text-indigo-600 font-medium cursor-pointer hover:underline">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}