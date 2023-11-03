const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const user = require("../models/user");

exports.register = async (req, res) => {
  const { email, password, confirm_password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      confirm_password: hashedPassword,
    });

    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (passwordMatch) {
      const token = jwt.sign({ userId: existingUser.id }, process.env.JWT);

      // Set the token as a cookie if needed
      // res.cookie("token", token);

      return res.status(200).json({ token, user: existingUser });
    } else {
      return res.status(401).json({ error: "User not authorized" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

 exports.getUser=async(req,res)=>{

  try{
const userProfile=await user.find();
// //console.log(userProfile);
return res.status(200).json(userProfile);
  }catch(error){
    //console.log(error);
res.status(500).json("internal server error");
  }
}

exports.UpdateUser=async(req,res)=>{
  const {userId}=req.params;
  // //console.log(email);
  try{
const updatedUser=await user.findOneAndUpdate({_id:userId},req.body,{
  new:true,
  runValidators: true,
});
//console.log(updatedUser);

res.status(200).json("user successfully updated")
  }catch(err){
    //console.log(err);
    res.status(500).json("internal server error");
  }
}

exports.address=async (req, res) => {
  try {
    // Get the authenticated user from the request
   const { userId }=req.params;
const getUser=await User.findOne({_id:userId});
// //console.log(getUser);
    // Extract the address details from the request body
    const { street, city, state, zipCode } = req.body;
// //console.log(req.body);
    // Update the user's address details
    getUser.addresses.push({
      street,
      city,
      state,
      zipCode,
    });

    // Save the updated user document with the new address
    await getUser.save();

    return res.status(200).json({addresses:getUser.addresses, message: "Address added successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

//  setting an address as the default
exports.makeDefault= async (req, res) => {
  try {
    const{ userId,addressId }= req.params;
  

    // Find the user by ID
    const user = await User.findById(userId);
//console.log("usermmmmmmmmmmm",user,userId,addressId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
const address=user.addresses.find((itm)=>itm._id.toString()===addressId.toString());

//console.log(".......",address)
if(!address){
  return res.status(404).json({ error: "Address not found" });
}
 // Loop through the user's addresses and set the selected address as the default

 user.addresses.forEach((address) => {
  if (address._id.toString() === addressId) {
    address.isDefault = true;
  } else {
    address.isDefault = false; 
  }
});

   
    // Save the updated user document
    await user.save();

    return res.status(200).json({ message: "Default address set successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
