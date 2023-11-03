const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    // phone: {
    //   type: String,
    //   // unique: true,
    //   // validate: {
    //   //   validator: function(value) {
    //   //     // Check if the phone number is in a valid format (for example, 10-digit US phone number)
    //   //     return /^\d{10}$/.test(value);
    //   //   },
    //   //   message: "Invalid phone number format",
    //   // },
    // },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum length of the password
    },
    confirm_password: {
      type: String,
      required: true,
      validate: {
        validator: function(value) {
          return value === this.password;
        },
        message: "Passwords do not match",
      },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      // required: true,
    },
    addresses: [
      {
        street: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        state: {
          type: String,
          required: true,
          trim: true,
        },
        zipCode: {
          type: String,
          required: true,
          validate: {
            validator: function(value) {
              // Check if the zip code is in a valid format (for example, 6 digits)
              return /^\d{6}$/.test(value);
            },
            message: "Invalid zip code format",
          },
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
      isSelect: {
        type: Boolean,
        default: false,
      },
      },
    ],
    wishlist: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ]
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
