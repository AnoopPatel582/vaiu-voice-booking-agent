const Booking = require("../models/booking.js");
const { v4: uuidv4 } = require("uuid");
const { getWeatherForDate } = require("../services/weatherService");

exports.createBooking = async (req, res) => {
  try {
    const {
      bookingDate,
      customerName,
      numberOfGuests,
      bookingTime,
      cuisinePreference,
      specialRequests,
    } = req.body;

    // Fetch weather & seating suggestion
    const weatherData = await getWeatherForDate(bookingDate);

    const booking = new Booking({
      bookingId: `BKG-${uuidv4().slice(0, 8)}`,
      customerName,
      numberOfGuests,
      bookingDate,
      bookingTime,
      cuisinePreference,
      specialRequests,
      weatherInfo: weatherData.weatherInfo,
      seatingPreference: weatherData.seatingPreference,
      status: "confirmed",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      bookingId: booking.bookingId,
      seatingPreference: booking.seatingPreference,
      suggestionText: weatherData.suggestionText,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all bookings
exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
};

// GET booking by ID
exports.getBookingById = async (req, res) => {
  const booking = await Booking.findOne({ bookingId: req.params.id });
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  res.json(booking);
};

// DELETE (cancel) booking
exports.deleteBooking = async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
    { bookingId: req.params.id },
    { status: "cancelled" },
    { new: true }
  );

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

res.json({
  success: true,
  message: "Booking cancelled successfully",
  bookingId: booking.bookingId,
  status: booking.status,
});

};