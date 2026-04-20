import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/internships");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
            Your next big<br/>opportunity<br/>starts here.
          </p>
          <p className="text-indigo-400 mt-4 text-sm leading-relaxed">
            Thousands of internships from top companies.<br/>Apply in seconds. Track everything.
          </p>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-white text-2xl font-semibold">500+</p>
            <p className="text-indigo-400 text-xs">Companies</p>
          </div>
          <div>
            <p className="text-white text-2xl font-semibold">2k+</p>
            <p className="text-indigo-400 text-xs">Internships</p>
          </div>
          <div>
            <p className="text-white text-2xl font-semibold">10k+</p>
            <p className="text-indigo-400 text-xs">Students placed</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 style={{fontFamily: 'Fraunces, serif'}} className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1 text-sm">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-semibold transition mt-2 disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} className="text-indigo-600 font-medium cursor-pointer hover:underline">
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}