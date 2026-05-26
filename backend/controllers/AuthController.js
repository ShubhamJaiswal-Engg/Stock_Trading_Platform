const User = require("../model/userModel.js");

const {OrdersModel} = require("../model/OrdersModel");
const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositonsModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

const isHttpsDeployment = [process.env.FRONTEND_URL, process.env.DASHBOARD_URL]
  .filter(Boolean)
  .some((url) => String(url).startsWith("https://"));

const cookieOptions = {
  httpOnly: true,
  // Use Secure + SameSite=None only when actually on HTTPS.
  // (If Secure cookies are set on http://localhost, the browser will drop them.)
  secure: isHttpsDeployment,
  sameSite: isHttpsDeployment ? "none" : "lax",
  path: "/",
};

module.exports.Logout = async (req, res) => {
  try {
    // Must match the cookie attributes used when setting the cookie.
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      ...cookieOptions,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true});
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if(!email || !password ){
        return res.json({message:'All fields are required'})
      }
      const user = await User.findOne({ email });
      if(!user){
        return res.json({message:'Incorrect password or email' }) 
      }
      const auth = await bcrypt.compare(password,user.password)
      if (!auth) {
        return res.json({message:'Incorrect password or email' }) 
      }
       const token = createSecretToken(user._id);
       res.cookie("token", token, {
         ...cookieOptions,
         expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiry
       });
       res.status(201).json({ message: "User logged in successfully", success: true, token: token });// Add userId here
       next()
    } catch (error) {
      console.error(error);
    }
  }

module.exports.Me = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.json({ success: false, user: null });
    }

    const user = await User.findById(req.user.id).select("email username");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

  module.exports.Holdings = async(req,res)=>{
    const uid = req.user.id; // Securely fetch using authenticated token
    let allholding = await HoldingsModel.find({ uid: uid });
    res.send(allholding);
}

module.exports.Positions = async(req,res)=>{
    const uid = req.user.id;
    let allpositions = await PositionsModel.find({ uid: uid });
    res.send(allpositions);
}


module.exports.Orders = async(req,res)=>{
    const uid = req.user.id;
    let allorders = await OrdersModel.find({ uid: uid });
    res.send(allorders);
}

module.exports.NewOrder = async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    if (!name || !mode) {
      return res.status(400).json({ success: false, message: "Missing name/mode" });
    }

    const parsedQty = Number(qty);
    const parsedPrice = Number(price);

    if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
      return res.status(400).json({ success: false, message: "Invalid qty" });
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ success: false, message: "Invalid price" });
    }

    const newOrder = new OrdersModel({
      name,
      qty: parsedQty,
      price: parsedPrice,
      mode,
      uid: req.user.id,
      time: new Date(),
    });

    await newOrder.save();
    return res.json({ success: true, message: "Order saved!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
module.exports.UserData = async (req,res) => {
  if (req.user?.id !== req.params.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const user = await User.findById(req.params.id).select("email username");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

