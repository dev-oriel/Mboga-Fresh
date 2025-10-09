// src/pages/RiderDeliveryDetail.jsx

import React from 'react';
// Import the existing RiderHeader component
import Header from '../components/riderComponents/RiderHeader';
// Import the new QRCodeScanner component
import QRCodeScanner from '../components/riderComponents/QRCodeScanner';

const RiderDeliveryDetail = () => {
  // Define a variable for the active order ID
  const activeOrderId = '12345'; 

  const pageContainerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5', // Light background for the overall page
  };

  const titleBarStyle = {
    padding: '10px 40px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    fontSize: '18px',
    color: '#333',
    fontWeight: 'normal',
  };

  return (
    <div style={pageContainerStyle}>
      {/* 1. Page Title Bar */}
      <div style={titleBarStyle}>
        Rider Delivery Detail
      </div>

      {/* 2. Navigation Header (Mboga Fresh, Dashboard, Orders, etc.) */}
      <Header />

      {/* 3. Main Content Area */}
      <main>
        {/* Pass the active order ID to the scanner component */}
        <QRCodeScanner orderId={activeOrderId} />
      </main>
    </div>
  );
};

export default RiderDeliveryDetail;