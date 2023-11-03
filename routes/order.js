const { placeOrder, cancelOrder, getOrderDetails, getAllOrderDetails, reviewOrder } = require("../controllers/order");
const authorization = require("../middleware/auth");

const router=require("express").Router();


router.post("/place-order/:userId/:addressId",authorization,placeOrder);
router.put("/cancel-order/:orderId",authorization,cancelOrder);
router.get("/order-details/:orderId",authorization,getOrderDetails);
router.get("/all-order-details/:userId",authorization,getAllOrderDetails);
router.get("/review-order/:orderId", authorization,reviewOrder );

module.exports=router; 