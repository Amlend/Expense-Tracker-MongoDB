const Razorpay = require("razorpay");
const Order = require("../Models/order");
const User = require("../Models/user");
require("dotenv").config();

exports.purchasepremium = (req, res, next) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });
    var options = {
      amount: 10000,
      currency: "INR",
      receipt: "xyz",
    };

    instance.orders.create(options, (err, order) => {
      if (err) {
        throw new Error(err);
      }
      res.status(201).json({ order, key_id: instance.key_id });
      // console.log(order)

      // req.user.createOrder({oderId: order.id, status: 'PENDING'}).then(()=>{
      //     res.json({order, key_id: instance.key_id});
      // }).catch(err=>{
      //     throw new Error(err);
      // })
    });
  } catch (err) {
    res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  console.log("sujay", req.body);
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    await Order.create({
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      status: "successful",
      userId: req.user._id,
    });

    // User.findById(req.user._id)
    // .then((order) => {
    //     // if(order[0].status == "successful") {
    //         order.ispremiumuser = true ;
    //          order.save();

    //         res.status(200).json({message: "Successfully Saved"});
    //     // }
    // })
    // .catch(err => {
    //     console.log(err)
    //     throw new Error(err)});

    let user = await User.findById(req.user._id);
    console.log(user);
    user.ispremiumuser = true;
    await user.save();
    res.status(200).json({ message: "Successfully Saved" });
  } catch (error) {
    res.status(403).json({ error: error, message: "Sometghing went wrong" });
  }
};
