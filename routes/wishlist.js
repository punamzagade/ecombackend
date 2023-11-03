const { addToWishlist, getWishlist, removeFromWishlist } = require("../controllers/wishlist");
const authorization = require("../middleware/auth");

const router = require("express").Router();

router.post("/add/:userId/:productId",authorization,addToWishlist);
router.get("/:userId/getwishlist", authorization,getWishlist);
router.delete("/:userId/remove/:productId", authorization,removeFromWishlist);

  
module.exports=router;