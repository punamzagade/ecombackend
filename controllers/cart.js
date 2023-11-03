
const Cart = require('../models/cart');
const  Product  = require('../models/product'); 
const User = require('../models/user');
const { calculateDiscountedPrice } = require('./product');


// Add product to the cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user:userId });

    if (!cart) {
      cart = new Cart({
        user:userId,
        products: [],
      });
    }

    // Check if the product is already in the cart
    const existingProduct = cart.products.find((item) => item.product.equals(productId));
// //console.log(existingProduct);
    if (existingProduct) {
      // If the product is already in the cart, update the quantity
      existingProduct.quantity += 1;
      existingProduct.totalPrice = existingProduct.quantity * existingProduct.price;
    } else {
      // If the product is not in the cart, add it
      const product=await Product.findOne({_id:productId}); 
      // //console.log(product);
      cart.products.push({
        product:product._id,
        quantity: product.quantity,
        price: product.price,
        totalPrice: product.price,
      });
    }
// //console.log(cart)

const subtotal = cart.products.reduce((acc, product) => acc + product.totalPrice, 0);
cart.subtotal = subtotal;
const discountedPrice = calculateDiscountedPrice(cart.subtotal, cart.couponDiscount);
console.log(discountedPrice);
cart.finalSubtotal=discountedPrice;
console.log("jjjjokdokodkdfj",cart);
    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Remove product from the cart
exports.removeProdFromCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartProduct = cart.products.find((item) => item.product.equals(productId));
    if (!cartProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
 
      const product = await Product.findOne({ _id: productId });

      if (cartProduct.quantity > 1) {
        cartProduct.quantity -= 1;
        cartProduct.totalPrice -= product.price; // Subtract the product price
      } else {
        // Remove the product from the cart if the quantity is 1
        cart.products = cart.products.filter((item) => !item.product.equals(productId));
      }
    

     const subtotal = cart.products.reduce((acc, product) => acc + product.totalPrice, 0);
     cart.subtotal = subtotal;
     const discountedPrice = calculateDiscountedPrice(cart.subtotal, cart.couponDiscount);
     console.log(discountedPrice);
     cart.finalSubtotal=discountedPrice;

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCartProducts=async(req,res)=>{
  const { id }=req.params;

  try{
const cartProducts=await Cart.findOne({user:id});

// res.status(200).json(cartProducts.products);
res.status(200).json(cartProducts);

  }catch(err){
    // //console.log(err)
    res.status(200).json("internal server error");
  }
}


exports.editProductInCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the product in the cart
    const cartProduct = cart.products.find((item) => item.product.equals(productId));

    if (!cartProduct) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }

    // Update the quantity of the product
    if (quantity === 0) {
      // If quantity is set to 0, remove the product from the cart
      cart.products = cart.products.filter((item) => !item.product.equals(productId));
    } else {
      // Update the quantity and recalculate the totalPrice of the product
      cartProduct.quantity = quantity;
      cartProduct.totalPrice = cartProduct.price * quantity;
    }

    // Recalculate the subtotal and finalSubtotal for the entire cart
    const subtotal = cart.products.reduce((acc, product) => acc + product.totalPrice, 0);
    cart.subtotal = subtotal;

    const discountedPrice = calculateDiscountedPrice(subtotal, cart.couponDiscount);
    cart.finalSubtotal = discountedPrice;

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Apply discount to a product in the cart
exports.coupon= async (req, res) => {
  try {
    const userId = req.params.userId;
    const { couponDiscount } = req.body;
console.log("ghjkikejdjekdjnikjdiii",couponDiscount);
    // Find the user's cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
console.log("00kijhgffctyghbnughgh",req.user._id,cart.user)
    if(req.user._id.toString()!==cart.user.toString()){
      return res.status(404).json({ error: 'your not authorized please login' });
      
    }
    // Apply the discount
    const discountedPrice = calculateDiscountedPrice(cart.subtotal, couponDiscount);
console.log(discountedPrice);
cart.finalSubtotal=discountedPrice;
cart.couponDiscount=couponDiscount;
console.log(cart);

    // Save the updated cart
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Remove the coupon discount from the cart
exports.removeCouponDiscount = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Remove the coupon discount
    cart.finalSubtotal = cart.subtotal;
    cart.couponDiscount = 0;

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 