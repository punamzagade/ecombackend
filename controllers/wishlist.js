const User = require("../models/user");

// Route for adding a product to the wishlist
exports.addToWishlist= async (req, res) => {
    try { 
      const { userId, productId  }= req.params;
  
      // Find the user by ID
      const user = await User.findById(userId);
  //console.log(user)
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if the product is already in the wishlist
      const existingWishlistItem = user.wishlist.find((item) =>
        item.product.equals(productId)
      );
  
      if (!existingWishlistItem) {
        // If the product is not in the wishlist, add it
        user.wishlist.push({ product: productId });
        //console.log(user)
        await user.save();
        return res.status(200).json({ message: "Product added to wishlist." });
      }
  
      return res.status(400).json({ error: "Product is already in the wishlist." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // Route for viewing the user's wishlist
 exports.getWishlist=async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find the user by ID and populate the wishlist with product details
      const user = await User.findById(userId).populate("wishlist.product");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.status(200).json(user.wishlist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  // Route for removing a product from the wishlist
exports.removeFromWishlist=async (req, res) => {
    try {
      const userId = req.params.userId;
      const productId = req.params.productId;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Find the index of the product in the wishlist
      const productIndex = user.wishlist.findIndex((item) =>
        item.product.equals(productId)
      );
  
      if (productIndex !== -1) {
        // Remove the product from the wishlist
        user.wishlist.splice(productIndex, 1);
        await user.save();
        return res.status(200).json({ message: "Product removed from wishlist." });
      }
  
      return res.status(404).json({ error: "Product not found in the wishlist." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  