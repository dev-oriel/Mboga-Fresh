// Simple test script to create a vendor user
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import { User } from "./models/user.model.js";
import { connectDB } from "./db/connectDB.js";

// Load environment variables
dotenv.config({ path: '../.env' });

const createTestVendor = async () => {
    try {
        await connectDB();
        
        // Check if vendor already exists
        const existingVendor = await User.findOne({ email: "vendor@test.com" });
        if (existingVendor) {
            console.log("Test vendor already exists:", existingVendor.email);
            return;
        }

        // Create test vendor
        const hashedPassword = await bcryptjs.hash("password123", 10);
        const vendor = new User({
            email: "vendor@test.com",
            password: hashedPassword,
            name: "Test Vendor",
            phone: "+254700000000",
            role: "vendor",
            status: "active",
            isVerified: true
        });

        await vendor.save();
        console.log("Test vendor created successfully!");
        console.log("Email: vendor@test.com");
        console.log("Password: password123");
        console.log("Vendor ID:", vendor._id);
        
    } catch (error) {
        console.error("Error creating test vendor:", error);
    }
};

createTestVendor();