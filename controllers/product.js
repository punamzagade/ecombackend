
const  Product  = require('../models/product'); 
const User = require('../models/user');


// Function to calculate discounted price
  exports.calculateDiscountedPrice=(price, discount)=>{
    // Ensure the discount is within the valid range (0-100%)
    discount = Math.min(100, Math.max(0, discount));
    // Calculate the discounted price 
    return Math.round(price * (1 - discount / 100));
  }


// Function to calculate discounted price
// function calculateDiscountedPrice(originalPrice, discountPercentage) {
//   // Ensure discount percentage is within the valid range (0% to 100%)
//   if (discountPercentage < 0) {
//     discountPercentage = 0;
//   } else if (discountPercentage > 100) {
//     discountPercentage = 100;
//   }

//   // Calculate the discounted price
//   const discount = (originalPrice * discountPercentage) / 100;
//   const discountedPrice = originalPrice - discount;

//   return Math.round(discountedPrice);
// }


  // Create a new product
  exports.createProduct = async (req, res) => {
    try {
      // Get the user's ID from the request (You should have a way to verify user's credentials or token)
      // const { userId } = req.params;
      const user=req.user;
  console.log("wertyuiiijkswushuyygsysys",req.user);
      // Check if the user is an admin
      // const user = await User.findById({ _id: userId });
      
      //console.log(user);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Only admin users can create products' });
      }
  
      // If the user is an admin, they can create a new product
      const { name, price, category, description, size, color, subcategory, discount } = req.body;
  
      // Calculate the discounted price
      const discountedPrice = this.calculateDiscountedPrice(price, discount);
  
      // Create the new product with the calculated discounted price
      const newProduct = new Product({
        name,
        price: price, // Set the discounted price
        discountedPrice:discountedPrice,
        category,
        description,
        size,
        color,
        // user: userId,
        user: user._id,
        subcategory,
        discount, // Store the discount in the product document
      });
  
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  
  // Get all products
  exports.getAllProducts= async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get product by ID
  exports.getSingleProduct= async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Update product by ID
  exports.updatedProduct= async (req, res) => {
    try {
      const productId = req.params.productId;
  
      const product=await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      } 

      // Check if the user is an admin (you should have an authorization mechanism in place)     
      const user = await User.findById(product.user);
      
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Only admin users can update products' });
      } 
  
      

      
      if(req.body.discount){
        product.discountedPrice=this.calculateDiscountedPrice(product.price,req.body.discount);
      }
  
      // Update the product with all fields from req.body
      Object.assign(product, req.body);
  
      // Save the updated product
      const updatedProduct = await product.save();
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  // Delete product by ID
exports.deleteProduct= async (req, res) => {
    try {
      const productId = req.params.productId;
      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(deletedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



// Add a rating to a product

exports.addRating = async (req, res) => {
  try {
    const { productId, userId} = req.params;
    const { rating } = req.body;

    // Check if userId is provided and not undefined
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the user has already rated this product
    const existingRating = product.ratings.find((r) => r?.user?.equals(userId));

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
    } else {
      // Add a new rating
      product.ratings.push({ user: userId, rating });
    }

    // Calculate the average rating
    let totalRating = 0;
    for (const r of product.ratings) {
      totalRating += r.rating;
    }
    const averageRating = totalRating / product.ratings.length;

    // Only update the ratings field if there are ratings
    if (product.ratings.length > 0) {
      product.ratings = product.ratings.map((r) => ({
        user: r.user,
        rating: r.rating,
      }));
    } else {
      // If there are no ratings, remove the ratings field
      delete product.ratings;
    }
  product.avgRating=averageRating;
    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
