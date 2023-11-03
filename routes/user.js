const { getUser, register, login, UpdateUser, address, makeDefault} = require("../controllers/user");
const authorization = require("../middleware/auth");

const router = require("express").Router();

router.post("/register",register);
router.post("/login",login);
router.get("/userdata",getUser);
router.put("/userdata/:userId",UpdateUser);
router.post("/:userId/add-address", authorization ,address);
router.put("/set-default-address/:userId/:addressId", authorization,makeDefault);
  
module.exports=router;