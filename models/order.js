const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: {
        street: String,
        city: String,
        state: String,
        zipCode: {
          type: String,
          validate: {
            validator: (value) => /^\d{6}$/.test(value), // Check if the zip code is in a valid format (e.g., 6 digits)
            message: "Invalid zip code format",
          },
        },
      },
      required: true,
    },
    products:[],
    amount: {
      type: Number,
      required: true,
    }, 
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
