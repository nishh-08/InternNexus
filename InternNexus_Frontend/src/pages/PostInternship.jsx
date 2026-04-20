import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function PostInternship() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([
    { title: "", description: "", location: "", stipend: "" }
  ]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (index, e) => {
    const updated = [...internships];
    updated[index][e.target.name] = e.target.value;
    setInternships(updated);
  };

  const addMore = () => {
    setInternships([...internships, { title: "", description: "", location: "", stipend: "" }]);
  };

  const removeOne = (index) => {
    if (internships.length === 1) return;
    setInternships(internships.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const intern of internships) {
      try {
        await API.post("/internships/create", intern);
        successCount++;
      } catch (err) {
        failCount++;
      }
    }

    setLoading(false);
    if (failCount === 0) {
      setMessage({ text: `${successCount} internship(s) posted successfully!`, type: "success" });
      setTimeout(() => navigate("/internships"), 2000);
    } else {
      setMessage({ text: `${successCount} posted, ${failCount} failed.`, type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 style={{fontFamily: 'Fraunces, serif'}} className="text-xl font-bold text-indigo-950">InternNexus</h1>
          <button
            onClick={() => navigate("/internships")}
            className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition px-3 py-1.5 rounded-lg hover:bg-indigo-50"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h2 style={{fontFamily: 'Fraunces, serif'}} className="text-3xl font-bold text-gray-900">Post Internships</h2>
          <p className="text-gray-500 mt-1 text-sm">Fill in the details below. Add multiple at once.</p>
        </div>

        {message.text && (
          <div className={`p-3.5 rounded-xl mb-6 text-sm font-medium text-center ${
            message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {internships.map((intern, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700 text-sm">Internship {index + 1}</h3>
                {internships.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOne(index)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Job Title</label>
                  <input
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    name="title"
                    placeholder="e.g. Frontend Developer Intern"
                    value={intern.title}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Description</label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                    name="description"
                    placeholder="What will the intern be doing?"
                    rows={3}
                    value={intern.description}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Location</label>
                  <input
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    name="location"
                    placeholder="e.g. Remote / Mumbai"
                    value={intern.location}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Stipend (₹/month)</label>
                  <input
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    name="stipend"
                    type="number"
                    placeholder="0 for unpaid"
                    min="0"
                    value={intern.stipend}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <button
            type="button"
            onClick={addMore}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-sm text-gray-500 font-medium hover:border-indigo-400 hover:text-indigo-600 transition"
          >
            + Add another internship
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold text-sm transition disabled:opacity-60"
          >
            {loading ? "Posting..." : `Post ${internships.length} Internship${internships.length > 1 ? "s" : ""}`}
          </button>
        </form>
      </div>
    </div>
  );
}