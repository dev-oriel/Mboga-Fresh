import React from 'react';
import { useParams } from 'react-router-dom'; // Add this import
import Header from '../components/riderComponents/RiderHeader';
import QRCodeScanner from '../components/riderComponents/QRCodeScanner';

const RiderDeliveryDetail = () => {
  // Get the order ID from URL parameters instead of hardcoding
  const { orderId } = useParams(); 

  const pageContainerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
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
      {/* 1. Page Title Bar - Show dynamic order ID */}
      <div style={titleBarStyle}>
        Delivery Details - Order #{orderId}
      </div>

      {/* 2. Navigation Header */}
      <Header />

      {/* 3. Main Content Area - Pass dynamic orderId */}
      <main>
        <QRCodeScanner orderId={orderId} />
      </main>
    </div>
  );
};

export default RiderDeliveryDetail;