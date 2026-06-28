import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null,
    },
    customer: {
      type: String,
      required: true,
    },
    movie: {
      type: String,
      required: true,
    },
    seats: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
    bookedAt: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Refunded', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
