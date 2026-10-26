
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    movieTitle: {
      type: String,
      required: true,
    },
    tickets: {
      type: Number,
      required: true,
      min: 1,
    },
    showDate: {
      type: Date,
      required: true,
    },
    showTime: {
      type: String,
      required: true,
      default: "06:00 PM",
    },
    seats: {
      type: [String],
      required: true,
      validate: {
        validator: function (seats) {
          return seats.length === this.tickets;
        },
        message: "Number of seats must match the number of tickets.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
