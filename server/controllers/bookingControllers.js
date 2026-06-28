import Booking from '../models/booking.js';

export const createBooking = async (req, res) => {
  try {
    const { userId, customer, movie, seats, total, bookedAt, status } = req.body;

    if (!customer || !movie || !seats || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newBooking = new Booking({
      userId: userId || null,
      customer,
      movie,
      seats,
      total,
      bookedAt,
      status: status || 'Confirmed',
    });

    await newBooking.save();
    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
};

export const getGuestBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: null }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching guest bookings:', error);
    res.status(500).json({ error: 'Failed to fetch guest bookings' });
  }
};
