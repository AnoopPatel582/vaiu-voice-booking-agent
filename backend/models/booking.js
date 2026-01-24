const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  bookingTime: {
    type: String,
    required: true,
  },
  cuisinePreference: {
    type: String,
    required: true,
  },
  specialRequests: {
    type: String,
    default: "",
  },
  weatherInfo: {
    type: Object,
    default: {},
  },
  seatingPreference: {
    type: String,
    enum: ["indoor", "outdoor"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
