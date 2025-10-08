import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';
import { Order } from './models/order.model.js';
import { Payment } from './models/payment.model.js';
import { Notification } from './models/notification.model.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error.message);
        process.exit(1);
    }
};

// Sample data to seed
const sampleData = async () => {
    try {
        // Clear existing data
        await Order.deleteMany({});
        await Payment.deleteMany({});
        await Notification.deleteMany({});
        
        console.log('Cleared existing data');

        // Create sample vendor (you might already have this)
        let vendor = await User.findOne({ email: 'vendor@mbogafresh.com' });
        if (!vendor) {
            vendor = await User.create({
                name: 'Aisha Vendor',
                email: 'vendor@mbogafresh.com',
                password: 'hashedpassword', // This should be properly hashed
                role: 'vendor',
                isVerified: true
            });
        }

        // Create sample customer
        let customer = await User.findOne({ email: 'customer@test.com' });
        if (!customer) {
            customer = await User.create({
                name: 'John Customer',
                email: 'customer@test.com',
                password: 'hashedpassword',
                role: 'customer',
                isVerified: true
            });
        }

        // Create sample orders
        const orders = await Order.create([
            {
                orderId: 'ORD001',
                vendorId: vendor._id,
                customerId: customer._id,
                customerName: 'John Customer',
                items: [
                    { productId: new mongoose.Types.ObjectId(), name: 'Tomatoes', quantity: 5, price: 200 },
                    { productId: new mongoose.Types.ObjectId(), name: 'Onions', quantity: 3, price: 150 }
                ],
                total: 1450,
                status: 'confirmed',
                paymentStatus: 'in_escrow',
                deliveryAddress: '123 Main St, Nairobi',
                phoneNumber: '+254700123456'
            },
            {
                orderId: 'ORD002',
                vendorId: vendor._id,
                customerId: customer._id,
                customerName: 'John Customer',
                items: [
                    { productId: new mongoose.Types.ObjectId(), name: 'Carrots', quantity: 2, price: 100 }
                ],
                total: 200,
                status: 'delivered',
                paymentStatus: 'released',
                deliveryAddress: '456 Oak Ave, Nairobi',
                phoneNumber: '+254700123456'
            },
            {
                orderId: 'ORD003',
                vendorId: vendor._id,
                customerId: customer._id,
                customerName: 'John Customer',
                items: [
                    { productId: new mongoose.Types.ObjectId(), name: 'Potatoes', quantity: 10, price: 50 }
                ],
                total: 500,
                status: 'preparing',
                paymentStatus: 'in_escrow',
                deliveryAddress: '789 Pine St, Nairobi',
                phoneNumber: '+254700123456'
            }
        ]);

        // Create sample payments
        await Payment.create([
            {
                orderId: orders[0]._id,
                vendorId: vendor._id,
                customerId: customer._id,
                amount: 1450,
                status: 'in_escrow',
                escrowDate: new Date(),
                paymentMethod: 'mpesa',
                transactionId: 'TXN001'
            },
            {
                orderId: orders[1]._id,
                vendorId: vendor._id,
                customerId: customer._id,
                amount: 200,
                status: 'released',
                escrowDate: new Date(Date.now() - 86400000), // 1 day ago
                releaseDate: new Date(),
                paymentMethod: 'mpesa',
                transactionId: 'TXN002'
            },
            {
                orderId: orders[2]._id,
                vendorId: vendor._id,
                customerId: customer._id,
                amount: 500,
                status: 'in_escrow',
                escrowDate: new Date(),
                paymentMethod: 'mpesa',
                transactionId: 'TXN003'
            }
        ]);

        // Create sample notifications
        await Notification.create([
            {
                vendorId: vendor._id,
                type: 'order',
                title: 'New Order Received',
                message: `Order ${orders[0].orderId} has been placed by ${customer.name}`,
                icon: '📦',
                relatedOrderId: orders[0]._id
            },
            {
                vendorId: vendor._id,
                type: 'payment',
                title: 'Payment Released',
                message: `Payment for order ${orders[1].orderId} has been released to your account`,
                icon: '💰',
                relatedOrderId: orders[1]._id
            },
            {
                vendorId: vendor._id,
                type: 'warning',
                title: 'Low Stock Alert',
                message: 'Your tomatoes inventory is running low. Consider restocking.',
                icon: '⚠️'
            }
        ]);

        console.log('Sample data created successfully!');
        console.log(`Vendor ID: ${vendor._id}`);
        console.log('Use this vendor ID in your frontend dashboard URL');
        process.exit(0);
    } catch (error) {
        console.error('Error creating sample data:', error);
        process.exit(1);
    }
};

// Run the seeder
connectDB().then(() => {
    sampleData();
});