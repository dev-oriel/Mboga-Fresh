// src/signup/Farmersignup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupWithFormData } from "../api/auth";

const FarmerSignUp = () => {
  const [formData, setFormData] = useState({
    farmName: "",
    contactPerson: "",
    email: "",
    phone: "",
    location: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { farmName, contactPerson, email, phone, location, password } =
      formData;
    if (
      !farmName ||
      !contactPerson ||
      !email ||
      !phone ||
      !location ||
      !password
    ) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // we will use FormData to keep parity with vendor (in case of docs later)
      const fd = new FormData();
      fd.append("role", "farmer");
      fd.append("name", contactPerson);
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("password", password);
      fd.append("farmName", farmName);
      fd.append("contactPerson", contactPerson);
      fd.append("location", location);

      await signupWithFormData(fd);
      navigate("/login", {
        state: { info: "Farmer account created (pending verification)" },
      });
    } catch (err) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // reuse styles you already had by keeping the styles object
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {/* simplified circular logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logoCircle}></div>
        </div>
        <h1 style={styles.title}>Mboga Fresh</h1>
        <p style={styles.subtitle}>Freshness You Can Trust.</p>
      </div>

      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Create a Bulk Supplier Account</h2>

        {error && <div className="text-red-600 mb-3">{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              type="text"
              placeholder="Farm Name"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              type="text"
              placeholder="Contact Person"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              placeholder="Phone Number"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              type="text"
              placeholder="Location (e.g., County, Town)"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <a href="/login" style={styles.loginLink}>
            Log in
          </a>
        </p>

        <div style={styles.languageSelector}>
          <span style={styles.language}>English</span>
          <span style={styles.languageSeparator}> | </span>
          <span style={styles.language}>Swahili</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  /* keep your existing styles object exactly as you provided earlier */
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  logoCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#2e7d32",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(46, 125, 50, 0.3)",
    position: "relative",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#2e7d32",
    margin: "10px 0 10px 0",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#666",
    margin: "0",
    fontStyle: "italic",
  },
  formContainer: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  formTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "30px",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
    outline: "none",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "10px",
  },
  loginText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#666",
  },
  loginLink: {
    color: "#2e7d32",
    textDecoration: "none",
    fontWeight: "bold",
  },
  languageSelector: {
    textAlign: "center",
    marginTop: "30px",
    color: "#666",
    fontSize: "14px",
  },
  language: {
    cursor: "pointer",
  },
  languageSeparator: {
    margin: "0 5px",
  },
};

export default FarmerSignUp;
