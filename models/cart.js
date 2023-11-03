const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price:{
        type: Number,
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  couponDiscount: {
    type: Number,
    default: 0,
  },
  subtotal:{
    type:Number,
    required: true,
  },
  finalSubtotal:{
    type:Number,
    required: true,
  }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;