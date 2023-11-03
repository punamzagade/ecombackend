const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discountedPrice:{
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0, 
    min: 0,      
    max: 100,    
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Grooming', 'Other'],
  },
  description: {
    type: String,
    maxlength: 500,
  },
  ratings: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    // select: false,
  },
avgRating:{
  type:String,
},
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L','XL','XXL'],
  },
  color: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  subcategory: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
