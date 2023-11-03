const { ForgotPassword, resetPassword, updatePassword } = require("../controllers/forgotPass");
const router=require("express").Router();

router.post("/forgot",ForgotPassword);
router.get("/reset/:id",resetPassword);
router.get('/update/:resetId', updatePassword)


module.exports=router;