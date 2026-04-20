import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col">
      {/* Navbar */}
      <nav className="px-8 py-5 flex justify-between items-center">
        <h1 style={{fontFamily: 'Fraunces, serif'}} className="text-white text-2xl font-bold">
          InternNexus
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-300 hover:text-white text-sm font-medium px-4 py-2 rounded-xl transition"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-indigo-950 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-100 transition"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        {/* Badge */}
        <div className="bg-indigo-900 border border-indigo-700 text-indigo-300 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
          🚀 Now live — 500+ internships posted
        </div>

        {/* Headline */}
        <h2 style={{fontFamily: 'Fraunces, serif'}} className="text-white text-5xl lg:text-7xl font-bold leading-tight max-w-4xl">
          Find your dream<br/>
          <span className="text-indigo-400">internship</span> today.
        </h2>

        <p className="text-indigo-300 mt-6 text-lg max-w-xl leading-relaxed">
          InternNexus connects ambitious students with top companies.
          Apply in seconds, track your applications, land your first role.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 mt-10 flex-wrap justify-center">
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-indigo-950 px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-indigo-100 transition"
          >
            Find internships →
          </button>
          <button
            onClick={() => navigate("/register")}
            className="border border-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-indigo-900 transition"
          >
            Post an internship
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-12 mt-16 flex-wrap justify-center">
          {[
            { number: "500+", label: "Companies" },
            { number: "2,000+", label: "Internships" },
            { number: "10,000+", label: "Students placed" },
            { number: "Free", label: "Always" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p style={{fontFamily: 'Fraunces, serif'}} className="text-white text-3xl font-bold">{stat.number}</p>
              <p className="text-indigo-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-5xl mx-auto px-6 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            {
              icon: "🎓",
              title: "For Students",
              desc: "Browse thousands of internships, apply with one click, and track all your applications in one place.",
              color: "bg-indigo-900 border-indigo-800"
            },
            {
              icon: "🏢",
              title: "For Companies",
              desc: "Post internships in minutes, review applicants, and find the best talent for your team.",
              color: "bg-indigo-900 border-indigo-800"
            },
            {
              icon: "⚡",
              title: "Instant Matching",
              desc: "Smart filters help students find the right opportunities and companies find the right candidates.",
              color: "bg-indigo-900 border-indigo-800"
            },
          ].map((feature) => (
            <div key={feature.title} className={`${feature.color} border rounded-2xl p-6`}>
              <p className="text-3xl mb-3">{feature.icon}</p>
              <h3 style={{fontFamily: 'Fraunces, serif'}} className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-indigo-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-indigo-900 px-8 py-5 flex justify-between items-center">
        <p style={{fontFamily: 'Fraunces, serif'}} className="text-indigo-400 text-sm font-medium">InternNexus</p>
        <p className="text-indigo-600 text-xs">© 2026 InternNexus. All rights reserved.</p>
      </div>
    </div>
  );
}