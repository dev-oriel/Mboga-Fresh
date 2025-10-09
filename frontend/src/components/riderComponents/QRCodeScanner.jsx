// src/components/QRCodeScanner.jsx

import React from 'react';

const QRCodeScanner = ({ orderId }) => {
  const containerStyle = {
    maxWidth: '400px',
    margin: '80px auto 0',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const qrFrameStyle = {
    width: '300px',
    height: '300px',
    margin: '30px auto 10px',
    backgroundColor: '#ccc', // Placeholder for the actual camera view
    border: '4px dashed #00cc66',
  };

  const instructionStyle = {
    color: '#333',
    marginBottom: '20px',
    fontSize: '16px',
    lineHeight: '1.4',
  };

  const orderIdStyle = {
    fontWeight: 'bold',
    color: '#00cc66',
  };

  const smallTextStyle = {
    color: '#999',
    marginTop: '10px',
    fontSize: '14px',
  };

  const cancelButton = {
    marginTop: '40px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#00cc66',
    cursor: 'pointer',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>Scan Vendor QR Code</h2>
      <p style={instructionStyle}>
        Ask the vendor to show you their QR code to confirm pickup of order <span style={orderIdStyle}>#{orderId}</span>.
      </p>

      <div style={qrFrameStyle}>
        {/* Actual QR code scanning logic would integrate here (e.g., using a library like react-qr-reader) */}
        <div style={{
          width: '50px',
          height: '50px',
          backgroundColor: '#eee',
          margin: '125px auto',
        }}>
          {/* Placeholder for the small QR code icon shown in the frame */}
        </div>
      </div>

      <p style={smallTextStyle}>
        Place the QR code within the frame to scan.
      </p>

      <button style={cancelButton} onClick={() => console.log('Cancel clicked')}>
        Cancel
      </button>
    </div>
  );
};

export default QRCodeScanner;