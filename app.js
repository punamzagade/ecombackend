const bodyParser = require("body-parser");
const express=require("express");
const app=express();
const userRoute=require("./routes/user");
const forgotRoute = require("./routes/forgotPass");
const ProductRoute=require("./routes/product"); 
const cartRoute = require("./routes/cart");
const wishlistRoute=require("./routes/wishlist");
const orderRoute = require("./routes/order");

const cors=require("cors");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose"); 

// deployed on render
// https://ecomreused.onrender.com

dotenv.config();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({extended:false}));
 
app.use("/user",userRoute);
app.use("/password",forgotRoute);
app.use("/product",ProductRoute); 
app.use("/cart",cartRoute);  
app.use("/wishlist",wishlistRoute);  
app.use("/order",orderRoute);  


mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("connected");
}).catch(err=>console.log(err));


app.listen(process.env.PORT || 5000 ,()=>{
    console.log("listening");
});