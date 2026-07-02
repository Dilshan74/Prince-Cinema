import Show from "../models/show.js";
import Booking from "../models/booking.js";

// Check seat availability
const checkSeatAvailability = async (showId, selectedSeats) => {
  try {
    const show = await Show.findById(showId);

    if (!show) return false;

    const occupiedSeats = show.occupiedSeats || [];

    const seatTaken = selectedSeats.some((seat) =>
      occupiedSeats.includes(seat)
    );

    return !seatTaken;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Create booking
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      customer,
      movie,
      showId,
      showDate,
      showTime,
      selectedSeats,
      total,
    } = req.body;

    let available = true;

    // Only check seat availability if this booking is linked to a specific database Show
    if (showId) {
      available = await checkSeatAvailability(showId, selectedSeats);
    }

    if (!available) {
      return res.json({
        success: false,
        message: "Some seats are already booked.",
      });
    }

    const booking = await Booking.create({
      userId: userId || null,
      customer,
      movie,
      showDate: showDate || '',
      showTime: showTime || '',
      seats: selectedSeats.join(", "),
      total,
      bookedAt: new Date().toLocaleString(),
      status: "Confirmed",
    });

    // If it's a database show, update the occupied seats
    if (showId) {
      const show = await Show.findById(showId);
      if (show) {
        show.occupiedSeats.push(...selectedSeats);
        await show.save();
      }
    }

    res.json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get occupied seats
export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    const show = await Show.findById(showId);

    if (!show) {
      return res.json({
        success: false,
        message: "Show not found.",
      });
    }

    res.json({
      success: true,
      occupiedSeats: show.occupiedSeats,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      bookings,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      bookings,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get guest bookings
export const getGuestBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [
        { userId: null },
        { userId: "" },
      ],
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      bookings,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};