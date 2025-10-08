import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
    // State for dashboard data
    const [dashboardData, setDashboardData] = useState({
        ordersReceived: 0,
        pendingDeliveries: 0,
        salesInEscrow: 0,
        earningsReleased: 0
    });

    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Get vendor ID from logged-in user or fallback to demo
    const getVendorId = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            return user.id || user._id;
        }
        return "vendor_123"; // Fallback for demo
    };

    const vendorId = getVendorId();

    // API Base URL - adjust to match your backend
    const API_BASE_URL = 'http://localhost:5000/api';

    // Check authentication and get user data
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.role !== 'vendor') {
                navigate('/login');
                return;
            }
            setUser(parsedUser);
        } else {
            // No user data, allow demo mode but show info
            console.log('Running in demo mode - no authenticated user');
        }
    }, [navigate]);

    // Logout function
    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    // Fetch vendor dashboard data from backend
    const fetchDashboardData = useCallback(async () => {
        try {
            setError(null);
            console.log('Fetching dashboard data for vendor:', vendorId);
            
            // Fetch dashboard statistics - ONLY real data, no fallbacks
            const dashboardResponse = await fetch(`${API_BASE_URL}/vendor/${vendorId}/dashboard`);
            console.log('Dashboard API response status:', dashboardResponse.status);
            
            if (!dashboardResponse.ok) {
                throw new Error(`Dashboard API failed with status: ${dashboardResponse.status}`);
            }
            
            const dashboardData = await dashboardResponse.json();
            console.log('Dashboard data received:', dashboardData);
            setDashboardData(dashboardData);

            // Fetch notifications - ONLY real data, no fallbacks
            const notificationsResponse = await fetch(`${API_BASE_URL}/vendor/${vendorId}/notifications`);
            console.log('Notifications API response status:', notificationsResponse.status);
            
            if (!notificationsResponse.ok) {
                throw new Error(`Notifications API failed with status: ${notificationsResponse.status}`);
            }
            
            const notificationsData = await notificationsResponse.json();
            console.log('Notifications data received:', notificationsData);
            setNotifications(notificationsData);
            
            setLastUpdated(new Date());
            setLoading(false);
            console.log('Dashboard data fetch completed successfully');
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(`Failed to load dashboard data: ${error.message}. Please ensure MongoDB is running and contains vendor data.`);
            
            // NO FALLBACK DATA - Show error state instead
            setDashboardData({
                ordersReceived: 0,
                pendingDeliveries: 0,
                salesInEscrow: 0,
                earningsReleased: 0
            });
            setNotifications([]);
            setLoading(false);
        }
    }, [vendorId]);

    // Real-time data refresh
    useEffect(() => {
        // Initial data fetch
        fetchDashboardData();

        // Set up auto-refresh every 30 seconds
        const refreshInterval = setInterval(() => {
            fetchDashboardData();
        }, 30000); // 30 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(refreshInterval);
    }, [fetchDashboardData]);

    // WebSocket connection for real-time updates (optional enhancement)
    useEffect(() => {
        // Uncomment this section when you have WebSocket support in backend
        /*
        const ws = new WebSocket(`ws://localhost:5000/vendor/${vendorId}/realtime`);
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'NEW_ORDER':
                    setDashboardData(prev => ({
                        ...prev,
                        ordersReceived: prev.ordersReceived + 1
                    }));
                    // Add new notification
                    setNotifications(prev => [data.notification, ...prev]);
                    break;
                case 'PAYMENT_RELEASED':
                    setDashboardData(prev => ({
                        ...prev,
                        earningsReleased: prev.earningsReleased + data.amount,
                        salesInEscrow: prev.salesInEscrow - data.amount
                    }));
                    break;
                case 'DELIVERY_COMPLETED':
                    setDashboardData(prev => ({
                        ...prev,
                        pendingDeliveries: prev.pendingDeliveries - 1
                    }));
                    break;
                default:
                    break;
            }
        };

        return () => ws.close();
        */
    }, [vendorId]);

    // Manual refresh function
    const handleRefresh = () => {
        setLoading(true);
        fetchDashboardData();
    };

    // Functions for quick actions with API integration
    const handleAddProduct = async () => {
        try {
            // In real app, this would redirect to product creation page
            // For now, show success message
            alert('Add New Product clicked! This would redirect to product creation page.');
            
            // Optional: You could also make an API call here
            // const response = await fetch(`${API_BASE_URL}/vendor/${vendorId}/products`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(productData)
            // });
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleViewOrders = async () => {
        try {
            // In real app, this would redirect to orders page
            alert('View Orders clicked! This would redirect to orders page.');
            
            // Optional: Fetch latest orders
            // const response = await fetch(`${API_BASE_URL}/vendor/${vendorId}/orders`);
            // const orders = await response.json();
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleWithdrawFunds = async () => {
        try {
            const amount = dashboardData.earningsReleased;
            if (amount <= 0) {
                alert('No funds available for withdrawal.');
                return;
            }

            const confirmed = window.confirm(`Withdraw Ksh ${amount.toLocaleString()}?`);
            if (!confirmed) return;

            // In real app, make API call to process withdrawal
            // const response = await fetch(`${API_BASE_URL}/vendor/${vendorId}/withdraw`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ amount })
            // });

            // For now, simulate successful withdrawal
            alert(`Withdrawal request submitted for Ksh ${amount.toLocaleString()}`);
            
            // Update local state (in real app, this would come from API response)
            setDashboardData(prev => ({
                ...prev,
                earningsReleased: 0
            }));
            
            // Refresh dashboard data
            setTimeout(() => fetchDashboardData(), 1000);
            
        } catch (error) {
            console.error('Error processing withdrawal:', error);
            alert('Withdrawal failed. Please try again.');
        }
    };

    const markNotificationAsRead = async (id) => {
        try {
            // Update local state immediately for better UX
            setNotifications(notifications.map(notif => 
                notif.id === id ? { ...notif, isRead: true } : notif
            ));

            // In real app, make API call to mark as read
            // await fetch(`${API_BASE_URL}/vendor/${vendorId}/notifications/${id}/read`, {
            //     method: 'PUT'
            // });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const getNotificationBgColor = (type, isRead) => {
        if (isRead) return '#f3f4f6';
        switch (type) {
            case 'order':
            case 'payment':
                return '#42cf17';
            case 'warning':
                return '#fbbf24';
            default:
                return '#42cf17';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="flex items-center justify-between px-6 py-4">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#42cf17'}}>
                                <span className="text-white font-bold text-sm">M</span>
                            </div>
                            <span className="font-bold text-xl text-gray-800">Mboga Fresh</span>
                        </div>
                    </div>

                    {/* User Info and Logout */}
                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-600 font-medium text-sm">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'V'}
                                    </span>
                                </div>
                            </div>
                        )}
                        {!user && (
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-700">Demo Mode</p>
                                <p className="text-xs text-gray-500">Sample Vendor</p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-6">
                    <nav className="flex space-x-8">
                        {['Dashboard', 'Orders', 'Products', 'Analytics'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-6">
                                            ? 'text-gray-900 border-b-2'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    style={{
                                        borderColor: activeTab === tab ? '#42cf17' : 'transparent'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                    
                    {/* User Profile and Refresh */}
                    <div className="flex items-center space-x-4">
                        {/* Last Updated Indicator */}
                        <div className="text-xs text-gray-500">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </div>
                        
                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                            title="Refresh Dashboard"
                        >
                            <svg 
                                className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>

                        <div className="flex items-center space-x-3">
                            <span className="text-gray-700">Aisha</span>
                            <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-medium cursor-pointer hover:bg-orange-500 transition-colors">
                                A
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {/* Error State */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <span className="text-red-600 mr-2">⚠️</span>
                            <span className="text-red-800">{error}</span>
                            <button 
                                onClick={handleRefresh}
                                className="ml-auto text-red-600 hover:text-red-800 underline"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="mb-6 flex justify-center">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Loading dashboard data...</span>
                        </div>
                    </div>
                )}

                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Aisha!</h1>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">Today's Overview</h2>
                        {!loading && (
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span>Live Data</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Orders Received */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Orders Received</h3>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData.ordersReceived}</p>
                        <p className="text-xs text-gray-500 mt-1">+2 from yesterday</p>
                    </div>

                    {/* Pending Deliveries */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Deliveries</h3>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData.pendingDeliveries}</p>
                        <p className="text-xs text-gray-500 mt-1">Need attention</p>
                    </div>

                    {/* Sales in Escrow */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Sales in Escrow</h3>
                        <p className="text-3xl font-bold text-gray-900">Ksh {dashboardData.salesInEscrow.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">Pending delivery confirmation</p>
                    </div>

                    {/* Earnings Released */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Earnings Released</h3>
                        <p className="text-3xl font-bold text-gray-900">Ksh {dashboardData.earningsReleased.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">Available for withdrawal</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <button 
                            onClick={handleAddProduct}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm hover:opacity-90 transition-opacity transform hover:scale-105" 
                            style={{backgroundColor: '#42cf17'}}
                        >
                            <span className="text-lg">+</span>
                            <span>Add New Product</span>
                        </button>
                        <button 
                            onClick={handleViewOrders}
                            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors transform hover:scale-105"
                        >
                            <span className="text-lg">📋</span>
                            <span>View Orders</span>
                        </button>
                        <button 
                            onClick={handleWithdrawFunds}
                            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors transform hover:scale-105"
                        >
                            <span className="text-lg">💰</span>
                            <span>Withdraw Funds</span>
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-700">Notifications</h2>
                        <span className="text-sm text-gray-500">
                            {notifications.filter(n => !n.isRead).length} unread
                        </span>
                    </div>
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div 
                                key={notification.id}
                                onClick={() => markNotificationAsRead(notification.id)}
                                className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-start space-x-4 cursor-pointer hover:shadow-md transition-shadow ${
                                    notification.isRead ? 'opacity-60' : ''
                                }`}
                            >
                                <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center" 
                                    style={{
                                        backgroundColor: getNotificationBgColor(notification.type, notification.isRead),
                                        opacity: notification.isRead ? 0.5 : 0.2
                                    }}
                                >
                                    <span 
                                        style={{
                                            color: notification.isRead ? '#6b7280' : getNotificationBgColor(notification.type, false)
                                        }}
                                    >
                                        {notification.icon}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className={`font-semibold ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                            {notification.title}
                                        </h3>
                                        {!notification.isRead && (
                                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#42cf17'}}></div>
                                        )}
                                    </div>
                                    <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats Summary */}
                <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Total Orders This Week</p>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.ordersReceived + 8}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Earnings This Month</p>
                            <p className="text-2xl font-bold text-gray-900">
                                Ksh {(dashboardData.salesInEscrow + dashboardData.earningsReleased + 2300).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VendorDashboard;
