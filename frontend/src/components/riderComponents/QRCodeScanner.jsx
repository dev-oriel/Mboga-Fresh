import React, { useState, useRef, useEffect } from 'react';
import { Package, MapPin, User, Phone, Clock, CheckCircle, Camera, XCircle, AlertCircle } from 'lucide-react';

const QRCodeScanner = ({ orderId = 'ORD123456', onScanComplete, onCancel }) => {
  const [scanning, setScanning] = useState(true);
  const [scannedData, setScannedData] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (scanning && !scannedData) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [scanning, scannedData]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setError(null);
        
        // Start scanning for QR codes if BarcodeDetector is available
        if ('BarcodeDetector' in window) {
          scanQRCode();
        }
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please grant camera permissions.');
      setCameraActive(false);
    }
  };

  const scanQRCode = async () => {
    if (!('BarcodeDetector' in window)) {
      return;
    }

    try {
      const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
      
      const detect = async () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes.length > 0) {
              console.log('QR Code detected:', barcodes[0].rawValue);
              handleQRCodeDetected(barcodes[0].rawValue);
              return;
            }
          } catch (err) {
            console.error('Detection error:', err);
          }
        }
        
        if (scanning && !scannedData) {
          requestAnimationFrame(detect);
        }
      };
      
      detect();
    } catch (err) {
      console.error('BarcodeDetector error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleQRCodeDetected = async (qrData) => {
    setScanning(false);
    stopCamera();
    setLoading(true);

    try {
      // Parse QR code data
      const parsedData = JSON.parse(qrData);
      setScannedData(parsedData);

      // In production, fetch order details from backend using the orderId
      // const response = await fetch(`/api/orders/${parsedData.orderId}`);
      // const orderData = await response.json();
      
      // Mock delivery data for demo
      const mockOrderDetails = {
        orderId: parsedData.orderId,
        buyer: parsedData.buyer,
        amount: parsedData.amount,
        vendorName: 'Green Valley Market',
        vendorPhone: '+1 (555) 123-4567',
        vendorAddress: '45 Market Street, Downtown',
        customerName: parsedData.buyer,
        customerPhone: '+1 (555) 987-6543',
        deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
        items: [
          { name: 'Fresh Vegetables Bundle', quantity: 2, price: 'KSh 500' },
          { name: 'Organic Fruits Pack', quantity: 1, price: 'KSh 800' },
          { name: 'Whole Grain Bread', quantity: 3, price: 'KSh 300' }
        ],
        orderTime: new Date(parsedData.timestamp).toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }),
        estimatedDelivery: '25-30 mins',
        deliveryFee: 'KSh 150',
        specialInstructions: 'Ring doorbell twice. Leave at door if no answer.',
        status: 'Pending Pickup'
      };

      setOrderDetails(mockOrderDetails);
      setLoading(false);
    } catch (err) {
      console.error('Error processing QR code:', err);
      setError('Invalid QR code. Please scan a valid vendor QR code.');
      setLoading(false);
      setScanning(true);
      startCamera();
    }
  };

  const handleManualScan = () => {
    // Simulate a successful scan for demo purposes
    const mockQRData = JSON.stringify({
      orderId: 'ORD-2024-001',
      buyer: 'John Doe',
      amount: 'KSh 1,750',
      timestamp: Date.now(),
    });
    handleQRCodeDetected(mockQRData);
  };

  const handleAcceptOrder = () => {
    console.log('Order accepted:', orderDetails);
    if (onScanComplete) {
      onScanComplete(orderDetails, 'accepted');
    }
    // In production, make API call to update order status
    // await fetch(`/api/orders/${orderDetails.orderId}/accept`, { method: 'POST' });
  };

  const handleRejectOrder = () => {
    console.log('Order rejected:', orderDetails);
    if (onScanComplete) {
      onScanComplete(orderDetails, 'rejected');
    }
    // In production, make API call to reject order
    // await fetch(`/api/orders/${orderDetails.orderId}/reject`, { method: 'POST' });
  };

  const handleCancel = () => {
    setScanning(false);
    setScannedData(null);
    setOrderDetails(null);
    stopCamera();
    if (onCancel) {
      onCancel();
    }
  };

  const handleRescan = () => {
    setScanning(true);
    setScannedData(null);
    setOrderDetails(null);
    setError(null);
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '20px auto 0',
    padding: '0 20px',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'center',
  };

  const contentStyle = {
    padding: '24px',
  };

  const videoWrapperStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '350px',
    height: '350px',
    margin: '0 auto 20px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '4px solid #00cc66',
    backgroundColor: '#000',
  };

  const videoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const overlayStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    border: '3px solid #00cc66',
    borderRadius: '12px',
    pointerEvents: 'none',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
  };

  const cornerStyle = {
    position: 'absolute',
    width: '30px',
    height: '30px',
    border: '4px solid #00cc66',
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '12px',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#00cc66',
    color: '#fff',
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc2626',
    color: '#fff',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#00cc66',
    border: '2px solid #00cc66',
  };

  const detailRowStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '12px',
  };

  const iconWrapperStyle = {
    minWidth: '24px',
    color: '#00cc66',
  };

  // Order confirmation page after successful scan
  if (orderDetails && !loading) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle size={32} color="#00cc66" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Order Scanned Successfully
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Review the order details below
            </p>
          </div>

          <div style={contentStyle}>
            {/* Order Summary */}
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              border: '2px solid #00cc66', 
              borderRadius: '8px', 
              padding: '16px', 
              marginBottom: '20px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Order ID</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>{orderDetails.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Amount</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#00cc66' }}>{orderDetails.amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Status</span>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#f59e0b',
                  backgroundColor: '#fef3c7',
                  padding: '4px 12px',
                  borderRadius: '12px'
                }}>
                  {orderDetails.status}
                </span>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
              Pickup & Delivery Information
            </h3>

            {/* Vendor Information */}
            <div style={detailRowStyle}>
              <div style={iconWrapperStyle}><Package size={24} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>Pickup From</p>
                <p style={{ margin: '2px 0', color: '#4b5563', fontSize: '14px' }}>{orderDetails.vendorName}</p>
                <p style={{ margin: '2px 0', color: '#6b7280', fontSize: '13px' }}>{orderDetails.vendorAddress}</p>
                <p style={{ margin: '2px 0', color: '#6b7280', fontSize: '13px' }}>{orderDetails.vendorPhone}</p>
              </div>
            </div>

            {/* Customer Information */}
            <div style={detailRowStyle}>
              <div style={iconWrapperStyle}><User size={24} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>Deliver To</p>
                <p style={{ margin: '2px 0', color: '#4b5563', fontSize: '14px' }}>{orderDetails.customerName}</p>
                <p style={{ margin: '2px 0', color: '#6b7280', fontSize: '13px' }}>{orderDetails.customerPhone}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div style={detailRowStyle}>
              <div style={iconWrapperStyle}><MapPin size={24} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>Delivery Address</p>
                <p style={{ margin: '2px 0', color: '#4b5563', fontSize: '14px' }}>{orderDetails.deliveryAddress}</p>
              </div>
            </div>

            {/* Order Items */}
            <div style={detailRowStyle}>
              <div style={iconWrapperStyle}><Package size={24} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>Order Items</p>
                {orderDetails.items.map((item, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '4px',
                    paddingBottom: '4px',
                    borderBottom: idx < orderDetails.items.length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}>
                    <span style={{ color: '#4b5563', fontSize: '14px' }}>
                      {item.name} (x{item.quantity})
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                      {item.price}
                    </span>
                  </div>
                ))}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '2px solid #e5e7eb'
                }}>
                  <span style={{ color: '#4b5563', fontSize: '14px' }}>Delivery Fee</span>
                  <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>{orderDetails.deliveryFee}</span>
                </div>
              </div>
            </div>

            {/* Time Details */}
            <div style={detailRowStyle}>
              <div style={iconWrapperStyle}><Clock size={24} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>Time Details</p>
                <p style={{ margin: '2px 0', color: '#4b5563', fontSize: '14px' }}>Ordered: {orderDetails.orderTime}</p>
                <p style={{ margin: '2px 0', color: '#4b5563', fontSize: '14px' }}>Est. Delivery: {orderDetails.estimatedDelivery}</p>
              </div>
            </div>

            {/* Special Instructions */}
            {orderDetails.specialInstructions && (
              <div style={{ 
                ...detailRowStyle, 
                backgroundColor: '#fef3c7', 
                borderLeft: '4px solid #f59e0b',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{ minWidth: '24px', color: '#f59e0b' }}>
                  <AlertCircle size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#92400e', fontSize: '14px' }}>Special Instructions</p>
                  <p style={{ margin: 0, color: '#78350f', fontSize: '14px' }}>{orderDetails.specialInstructions}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ marginTop: '24px' }}>
              <button 
                style={primaryButtonStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#00b359'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#00cc66'}
                onClick={handleAcceptOrder}
              >
                Accept & Start Delivery
              </button>

              <button 
                style={dangerButtonStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                onClick={handleRejectOrder}
              >
                Reject Order
              </button>

              <button 
                style={secondaryButtonStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0fdf4'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={handleRescan}
              >
                Scan Another Code
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ ...contentStyle, textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #e5e7eb',
              borderTopColor: '#00cc66',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Processing QR code...</p>
          </div>
        </div>
      </div>
    );
  }

  // Scanner view
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
            Scan Vendor QR Code
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Position the QR code within the frame to scan order details
          </p>
        </div>

        <div style={contentStyle}>
          {error ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <XCircle size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>{error}</p>
              <button style={primaryButtonStyle} onClick={handleRescan}>
                Retry Camera Access
              </button>
            </div>
          ) : scanning ? (
            <>
              <div style={videoWrapperStyle}>
                {cameraActive ? (
                  <>
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline 
                      muted
                      style={videoStyle}
                    />
                    <div style={overlayStyle}>
                      <div style={{ ...cornerStyle, top: '-4px', left: '-4px', borderRight: 'none', borderBottom: 'none' }}></div>
                      <div style={{ ...cornerStyle, top: '-4px', right: '-4px', borderLeft: 'none', borderBottom: 'none' }}></div>
                      <div style={{ ...cornerStyle, bottom: '-4px', left: '-4px', borderRight: 'none', borderTop: 'none' }}></div>
                      <div style={{ ...cornerStyle, bottom: '-4px', right: '-4px', borderLeft: 'none', borderTop: 'none' }}></div>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff' }}>
                    <Camera size={64} />
                  </div>
                )}
              </div>
              
              <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
                {cameraActive ? 'Align QR code within the green frame' : 'Starting camera...'}
              </p>

              {!('BarcodeDetector' in window) && cameraActive && (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <p style={{ color: '#f59e0b', fontSize: '13px', marginBottom: '12px' }}>
                    Auto-scan not supported on this browser
                  </p>
                  <button 
                    style={{ ...primaryButtonStyle, marginTop: 0 }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#00b359'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#00cc66'}
                    onClick={handleManualScan}
                  >
                    Tap to Scan (Demo)
                  </button>
                </div>
              )}
            </>
          ) : null}

          <button 
            style={secondaryButtonStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0fdf4'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;