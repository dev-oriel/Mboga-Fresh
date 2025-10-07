import React, { useState } from 'react';

const FarmerSignUp = () => {
  const [formData, setFormData] = useState({
    farmName: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  // Circular Logo with Vegetable Icon
  const CircularLogo = () => (
    <div style={styles.logoContainer}>
      <div style={styles.logoCircle}>
        <div style={styles.vegetableIcon}>
          <div style={styles.leaf}></div>
          <div style={styles.vegetable}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <CircularLogo />
        <h1 style={styles.title}>Mboga Fresh</h1>
        <p style={styles.subtitle}>Freshness You Can Trust.</p>
      </div>

      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Create a Bulk Supplier Account</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              name="farmName"
              placeholder="Farm Name"
              value={formData.farmName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person"
              value={formData.contactPerson}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="text"
              name="location"
              placeholder="Location (e.g., County, Town)"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Sign Up
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account? <a href="/login" style={styles.loginLink}>Log in</a>
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
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  logoCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#2e7d32',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(46, 125, 50, 0.3)',
    position: 'relative'
  },
  vegetableIcon: {
    position: 'relative',
    width: '40px',
    height: '40px'
  },
  leaf: {
    position: 'absolute',
    top: '5px',
    left: '15px',
    width: '10px',
    height: '15px',
    backgroundColor: '#4caf50',
    borderRadius: '50% 50% 50% 0',
    transform: 'rotate(-45deg)'
  },
  vegetable: {
    position: 'absolute',
    top: '15px',
    left: '10px',
    width: '20px',
    height: '25px',
    backgroundColor: '#ff9800',
    borderRadius: '50% 50% 40% 40%'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2e7d32',
    margin: '10px 0 10px 0'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    margin: '0',
    fontStyle: 'italic'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center'
  },
  form: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
    outline: 'none'
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px'
  },
  loginText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666'
  },
  loginLink: {
    color: '#2e7d32',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  languageSelector: {
    textAlign: 'center',
    marginTop: '30px',
    color: '#666',
    fontSize: '14px'
  },
  language: {
    cursor: 'pointer'
  },
  languageSeparator: {
    margin: '0 5px'
  }
};

export default FarmerSignUp;



