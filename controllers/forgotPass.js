const Sib = require("sib-api-v3-sdk");
const mongoose = require("mongoose");
const User = require("../models/user");
const uuid = require("uuid");
const ForgotPass = require("../models/forgotPass");
const bcrypt = require("bcryptjs");

exports.ForgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    // //console.log(email)
    const user = await User.findOne({ email: email });
    if (user) {
      const id = uuid.v4();
      await ForgotPass.create(
        [
          {
            uid:id,
            isActive: true,
            userId: user._id,
          },
        ],
      );

      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.SENDING_BLUE_API;
      const transEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: process.env.MAIL,
      };

      const recievers = [
        {
          email: email,
        },
      ];
// //console.log(id)
      await transEmailApi.sendTransacEmail({
        sender,
        to: recievers,
        subject: "reset password",
        textContent: "click here",
        htmlContent: `<a href="https://ecomreused.onrender.com/password/reset/${id}">Reset</a>`,
      });
      res.status(200).json("sent");
    } else {
      return res.status(404).json("User does not exist");
    }
  } catch (err) {
    //console.log(err);
    return res.status(500).json("Internal server error");
  }
};

exports.resetPassword = async (req, res) => {
  const id = req.params.id;
  // //console.log("000000",id);
  const resetpassword = await ForgotPass.findOne({uid:id});
// //console.log("iiiiii",resetpassword);
  if (resetpassword) { 
    if (resetpassword.isActive === true) {
      await resetpassword.updateOne({ isActive: false });
      res.status(200).send(`<html>
                                    <form action="/password/update/${id}" method="get">
                                        <label for="resetpassword">Enter New password</label>
                                        <input name="resetpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
      res.end();
    } else {
      return res.send("Link expired");
    }
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { resetpassword } = req.query;
    const id = req.params.resetId;
//console.log("uuuuuu",id);
    const resetReq = await ForgotPass.findOne({uid:id});
    if (!resetReq) {
      return res
        .status(404)
        .json({ error: "Reset request not found", success: false });
    }

    const user = await User.findOne({ _id: resetReq.userId });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User does not exist", success: false });
    }

    const hashedpass = await bcrypt.hash(resetpassword, 10);
    await User.findByIdAndUpdate(resetReq.userId, { password: hashedpass });

    return res
      .status(200)
      .json({ message: "Password successfully updated", success: true });
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};
