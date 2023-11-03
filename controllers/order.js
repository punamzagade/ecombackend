const { default: mongoose } = require('mongoose');
const Cart = require('../models/cart');
const Order = require('../models/order');
const User = require('../models/user');


exports.placeOrder = async (req, res) => {
    try {
      const { userId, addressId } = req.params;
      const cart = await Cart.findOne({ user: userId });
  
      const address = await User.aggregate([
        {
          $match: {
            _id:new mongoose.Types.ObjectId(userId), // Use mongoose.Types.ObjectId here
          },
        },
        {
          $unwind: "$addresses",
        },
        {
          $match: {
            "addresses._id":new mongoose.Types.ObjectId(addressId), // Use mongoose.Types.ObjectId here
          },
        },
      ]);
  
      if (address.length === 0) {
        return res.status(404).json({ error: 'Address not found' });
      }
  if(cart?.products?.length===0 || !cart){
    return res.status(404).json({ error: 'Add products to place an order' });
  }
     
  const order = new Order({
    userId,
    address: address[0].addresses, // Use the found address
    amount: cart.finalSubtotal,
    products: cart.products,
  });
  const placedOrder = await order.save();

  // Update the status to "placed successfully"
  await Order.findByIdAndUpdate(placedOrder._id, { status: "placed successfully" });
  
 // Delete the cart to clear it completely
 await Cart.deleteOne({ _id: cart._id });


  res.status(201).json(placedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  


  exports.cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      const canceledOrder = await Order.findByIdAndUpdate(orderId, { status: 'canceled' }, { new: true });
  
      if (req.user._id.toString() !== canceledOrder?.userId.toString()) {
        return res.status(403).json({ error: 'You are not authorized to cancel this order' });
      }
  
      if (!canceledOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.status(200).json(canceledOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.getAllOrderDetails = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const orders = await Order.find({userId});
  
      if (!orders) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.reviewOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by orderId
    const order = await Order.findById(orderId);
    console.log(order);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // You can provide the order details to the user for review
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
