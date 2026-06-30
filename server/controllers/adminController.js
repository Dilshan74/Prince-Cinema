import jwt from "jsonwebtoken";
import Booking from "../models/booking.js";
import Show from "../models/show.js";
import User from "../models/user.js";

// Admin Login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email !== process.env.ADMIN_EMAIL ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        const token = jwt.sign(
            {
                email: process.env.ADMIN_EMAIL,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.json({
            success: true,
            token
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Check if token belongs to admin
export const isAdmin = (req, res) => {
    return res.json({ success: true, message: "Admin verified" });
};

// API to get dashboard data for admin
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({});
        const activeShows = await Show.find({ showDateTime: { $gte: new Date() } });
        const totalUsers = await User.countDocuments();

        const totalRevenue = bookings.reduce((acc, b) => {
            const amount = parseFloat(b.total) || 0;
            return acc + amount;
        }, 0);

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue,
            activeShows: activeShows.length,
            totalUsers
        };

        res.json({ success: true, dashboardData });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Error fetching dashboard data" });
    }
};

// API to get all shows for admin
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).sort({ showDateTime: 1 });
        res.json({ success: true, shows });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Error fetching shows" });
    }
};

// API to get all bookings for admin
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Error fetching bookings" });
    }
};
