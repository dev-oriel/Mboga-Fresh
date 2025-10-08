import React from "react";
import { Route, Routes } from "react-router-dom";

// Simple components for testing
const SimpleHome = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1 style={{ color: '#42cf17' }}>🌱 Mboga Fresh</h1>
    <p>Welcome to Mboga Fresh - Your Local Kenyan Marketplace</p>
    <div style={{ marginTop: '20px' }}>
      <a href="/login" style={{ 
        backgroundColor: '#42cf17', 
        color: 'white', 
        padding: '10px 20px', 
        textDecoration: 'none', 
        borderRadius: '5px' 
      }}>
        Login
      </a>
    </div>
  </div>
);

const SimpleLogin = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    role: 'vendor'
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role.toLowerCase()
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        switch (data.user.role) {
          case 'vendor':
            window.location.href = '/vendor/dashboard';
            break;
          default:
            window.location.href = '/';
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ color: '#42cf17', textAlign: 'center', marginBottom: '30px' }}>
          🌱 Mboga Fresh Login
        </h1>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fee', 
            border: '1px solid #fcc', 
            color: '#c66', 
            padding: '10px', 
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Role:
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            >
              <option value="vendor">Vendor</option>
              <option value="buyer">Buyer</option>
              <option value="farmer">Farmer</option>
              <option value="rider">Rider</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading ? '#ccc' : '#42cf17',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          <p>Test Credentials:</p>
          <p>Vendor: vendor@test.com / password123</p>
          <p>Buyer: buyer@test.com / password123</p>
        </div>
      </div>
    </div>
  );
};

// Temporary simple vendor dashboard for testing
const TempVendorDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '10px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '30px'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#42cf17', marginBottom: '20px' }}>
            🎉 Vendor Dashboard
          </h1>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            ✅ Authentication Successful!
          </p>
          
          {user.name && (
            <div style={{ 
              backgroundColor: '#e8f5e8', 
              border: '1px solid #42cf17', 
              borderRadius: '5px',
              padding: '20px', 
              marginBottom: '20px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
                Welcome, {user.name}!
              </h2>
              <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {user.email}</p>
              <p style={{ marginBottom: '5px' }}><strong>Role:</strong> {user.role}</p>
              <p style={{ marginBottom: '5px' }}><strong>ID:</strong> {user.id}</p>
              <p><strong>Status:</strong> {user.status}</p>
            </div>
          )}
          
          <div style={{ marginTop: '30px' }}>
            <button 
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SimpleHome />} />
        <Route path="/login" element={<SimpleLogin />} />
        <Route path="/vendor/dashboard" element={<TempVendorDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
