import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="name" placeholder="Full Name" onChange={handleChange} required />
          <input style={styles.input} name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input style={styles.input} name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <select style={styles.input} name="role" onChange={handleChange}>
            <option value="student">Student</option>
            <option value="company">Company</option>
          </select>
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p style={styles.link}>Already have an account? <span onClick={() => navigate("/login")} style={styles.span}>Login</span></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" },
  card: { background: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" },
  title: { textAlign: "center", marginBottom: "1.5rem", color: "#333" },
  input: { width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "4px", border: "1px solid #ddd", fontSize: "1rem", boxSizing: "border-box" },
  button: { width: "100%", padding: "0.75rem", background: "#4f46e5", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" },
  error: { color: "red", textAlign: "center", marginBottom: "1rem" },
  link: { textAlign: "center", marginTop: "1rem", color: "#666" },
  span: { color: "#4f46e5", cursor: "pointer" }
};