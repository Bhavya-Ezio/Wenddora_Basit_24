const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Register (unchanged)
const registerUser = async (req, res) => {
  // console.log("Received request body:", req.body); // Debug: Log full request body

  let { userName, email, password, role } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) return res.status(400).json({ success: false, message: "User already exists!" });

    const hashPassword = await bcrypt.hash(password, 12);

    role = role || "user"; // Ensure role is set (fallback to "user")

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      role, // Now should store "seller" correctly
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "Registration successful" });

  } catch (e) {
    console.error("Error during registration:", e);
    res.status(500).json({ success: false, message: "Some error occurred", error: e.message });
  }
};



// Login (updated to validate role)
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first",
      });

    // Validate role if provided
    if (role && checkUser.role !== role) {
      return res.json({
        success: false,
        message: `This account is registered as a ${checkUser.role}, not a ${role}. Please use the correct login route.`,
      });
    }

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Logout (unchanged)
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

// Middleware (unchanged)
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

// 🔹 Middleware: Authenticate User
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized user!" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token!" });
  }
};

// 🔹 Middleware: Check if User is Admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied!" });
  }
  next();
};



module.exports = { registerUser, loginUser, logoutUser, authMiddleware ,authenticateUser, isAdmin  };
