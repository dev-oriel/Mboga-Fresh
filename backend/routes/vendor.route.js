import express from 'express';
import {
    getVendorDashboard,
    getVendorNotifications,
    markNotificationAsRead,
    processWithdrawal,
    getVendorOrders
} from '../controllers/vendor.controller.js';

const router = express.Router();

// Vendor Dashboard Routes
router.get('/:vendorId/dashboard', getVendorDashboard);
router.get('/:vendorId/notifications', getVendorNotifications);
router.put('/:vendorId/notifications/:notificationId/read', markNotificationAsRead);
router.post('/:vendorId/withdraw', processWithdrawal);
router.get('/:vendorId/orders', getVendorOrders);

export default router;