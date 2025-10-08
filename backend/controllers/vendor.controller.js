// Vendor Dashboard Controller
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Order } from '../models/order.model.js';
import { Payment } from '../models/payment.model.js';
import { Notification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';

// @desc    Get vendor dashboard data
// @route   GET /api/vendor/:vendorId/dashboard
// @access  Private (Vendor only)
export const getVendorDashboard = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;
    
    try {
        // For demo purposes, if vendorId is "vendor_123", return sample data
        // In real app, you would validate the vendor exists in database
        if (vendorId === "vendor_123") {
            // Return sample data for demonstration
            const dashboardData = {
                ordersReceived: 8,
                pendingDeliveries: 3,
                salesInEscrow: 2400,
                earningsReleased: 1200,
                lastUpdated: new Date().toISOString()
            };
            
            return res.status(200).json(dashboardData);
        }

        // For real ObjectId vendors, verify vendor exists
        if (mongoose.isValidObjectId(vendorId)) {
            const vendor = await User.findById(vendorId);
            if (!vendor || vendor.role !== 'vendor') {
                return res.status(404).json({ message: 'Vendor not found' });
            }

            // Get real data from database
            const ordersReceived = await Order.countDocuments({ 
                vendorId: vendorId,
                status: { $nin: ['cancelled'] }
            });

            const pendingDeliveries = await Order.countDocuments({ 
                vendorId: vendorId,
                status: { $in: ['confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery'] }
            });

            const escrowPayments = await Payment.aggregate([
                { 
                    $match: { 
                        vendorId: new mongoose.Types.ObjectId(vendorId),
                        status: 'in_escrow'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]);
            const salesInEscrow = escrowPayments.length > 0 ? escrowPayments[0].total : 0;

            const releasedPayments = await Payment.aggregate([
                { 
                    $match: { 
                        vendorId: new mongoose.Types.ObjectId(vendorId),
                        status: 'released'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]);
            const earningsReleased = releasedPayments.length > 0 ? releasedPayments[0].total : 0;
            
            const dashboardData = {
                ordersReceived,
                pendingDeliveries,
                salesInEscrow,
                earningsReleased,
                lastUpdated: new Date().toISOString()
            };
            
            return res.status(200).json(dashboardData);
        }

        // Invalid vendor ID format
        return res.status(400).json({ message: 'Invalid vendor ID format' });
        
    } catch (error) {
        console.error('Error fetching vendor dashboard:', error);
        res.status(500).json({ 
            message: 'Failed to fetch dashboard data',
            error: error.message 
        });
    }
});

// @desc    Get vendor notifications
// @route   GET /api/vendor/:vendorId/notifications
// @access  Private (Vendor only)
export const getVendorNotifications = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;
    
    try {
        // For demo purposes, if vendorId is "vendor_123", return sample notifications
        if (vendorId === "vendor_123") {
            const sampleNotifications = [
                {
                    id: 1,
                    type: 'order',
                    title: 'New Order Received',
                    message: 'Order #ORD2024001 has been placed by John Doe',
                    icon: '📦',
                    bgColor: '#42cf17',
                    isRead: false,
                    timestamp: new Date().toISOString()
                },
                {
                    id: 2,
                    type: 'payment',
                    title: 'Payment Released',
                    message: 'Payment for order #ORD2024002 has been released to your account',
                    icon: '💰',
                    bgColor: '#42cf17',
                    isRead: false,
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: 3,
                    type: 'warning',
                    title: 'Low Stock Alert',
                    message: 'Your tomatoes inventory is running low. Consider restocking.',
                    icon: '⚠️',
                    bgColor: '#fbbf24',
                    isRead: false,
                    timestamp: new Date(Date.now() - 7200000).toISOString()
                }
            ];
            
            return res.status(200).json(sampleNotifications);
        }

        // For real ObjectId vendors, fetch from database
        if (mongoose.isValidObjectId(vendorId)) {
            const notifications = await Notification.find({ vendorId })
                .populate('relatedOrderId', 'orderId total')
                .sort({ createdAt: -1 })
                .limit(10);

            const formattedNotifications = notifications.map(notification => ({
                id: notification._id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                icon: notification.icon,
                bgColor: getNotificationColor(notification.type),
                isRead: notification.isRead,
                timestamp: notification.createdAt.toISOString()
            }));
            
            return res.status(200).json(formattedNotifications);
        }

        // Invalid vendor ID format
        return res.status(400).json({ message: 'Invalid vendor ID format' });
        
    } catch (error) {
        console.error('Error fetching vendor notifications:', error);
        res.status(500).json({ 
            message: 'Failed to fetch notifications',
            error: error.message 
        });
    }
});

// Helper function to get notification colors based on type
const getNotificationColor = (type) => {
    switch (type) {
        case 'order':
        case 'payment':
            return '#42cf17';
        case 'warning':
            return '#fbbf24';
        case 'info':
            return '#3b82f6';
        default:
            return '#42cf17';
    }
};

// @desc    Mark notification as read
// @route   PUT /api/vendor/:vendorId/notifications/:notificationId/read
// @access  Private (Vendor only)
export const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { vendorId, notificationId } = req.params;
    
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, vendorId },
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        res.status(200).json({ 
            message: 'Notification marked as read',
            notificationId 
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ 
            message: 'Failed to mark notification as read',
            error: error.message 
        });
    }
});

// @desc    Process vendor withdrawal
// @route   POST /api/vendor/:vendorId/withdraw
// @access  Private (Vendor only)
export const processWithdrawal = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;
    const { amount } = req.body;
    
    try {
        // Validate vendor exists
        const vendor = await User.findById(vendorId);
        if (!vendor || vendor.role !== 'vendor') {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Check available balance (released payments)
        const releasedPayments = await Payment.aggregate([
            { 
                $match: { 
                    vendorId: new mongoose.Types.ObjectId(vendorId),
                    status: 'released'
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        
        const availableBalance = releasedPayments.length > 0 ? releasedPayments[0].total : 0;
        
        if (availableBalance < amount) {
            return res.status(400).json({ 
                message: 'Insufficient funds',
                availableBalance,
                requestedAmount: amount
            });
        }

        // In real implementation, you would:
        // 1. Create withdrawal record
        // 2. Update payment statuses to 'withdrawn'
        // 3. Process actual payment to vendor's account
        
        // For now, we'll mark payments as withdrawn
        await Payment.updateMany(
            { vendorId, status: 'released' },
            { status: 'withdrawn', withdrawnAt: new Date() }
        );
        
        res.status(200).json({ 
            message: 'Withdrawal processed successfully',
            amount,
            status: 'completed'
        });
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        res.status(500).json({ 
            message: 'Failed to process withdrawal',
            error: error.message 
        });
    }
});

// @desc    Get vendor orders
// @route   GET /api/vendor/:vendorId/orders
// @access  Private (Vendor only)
export const getVendorOrders = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    try {
        const query = { vendorId };
        if (status) query.status = status;
        
        const orders = await Order.find(query)
            .populate('customerId', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const totalOrders = await Order.countDocuments(query);
        
        res.status(200).json({
            orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalOrders,
                pages: Math.ceil(totalOrders / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching vendor orders:', error);
        res.status(500).json({ 
            message: 'Failed to fetch orders',
            error: error.message 
        });
    }
});