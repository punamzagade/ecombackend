const { addToCart, removeProdFromCart, coupon, getCartProducts, removeCouponDiscount, placeOrder, editProductInCart } = require("../controllers/cart");
const authorization = require("../middleware/auth");
const router=require("express").Router();



router.post('/add/:userId/:productId',authorization,addToCart);
router.delete('/remove/:userId/:productId',authorization,removeProdFromCart);
router.get("/getcart/:id",getCartProducts);
router.patch('/checkout/apply-discount',authorization,coupon);
router.delete('/remove-discount/:userId',authorization,removeCouponDiscount);
router.patch('/edit/:userId/:productId',authorization,editProductInCart);

// router.post('/checkout/place-order', authorization, placeOrder);



module.exports = router;