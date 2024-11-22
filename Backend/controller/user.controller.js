import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import CreateTokenAndSaveCookie from "../jwt/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullname, email, password, confirmpassword } = req.body;

    // Validate the data
    if (!fullname || !email || !password || !confirmpassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document and save it to the database
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword, // Don't save the `confirmpassword` field
    });

    await newUser.save(); // Save user to the database

    // Now create the token and send response
    CreateTokenAndSaveCookie(newUser._id, res);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error); // Use console.error for better error logging
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the data
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Create token and set cookie
    CreateTokenAndSaveCookie(user._id, res);

    return res.json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error); // Use console.error for better error logging
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error); // Use console.error for better error logging
    res.status(500).json({ message: "Server error" });
  }
};

//Rotes define
export const getUserProfile = async (req, res) => {
  try {
    const loggedInUser = req.User._id; //we can filter the user
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    res.status(200).json({ filteredUsers });
  } catch (error) {
    console.error("Error in allUsers Controller: " + error);
    res.status(500).json({ message: "Server error" });
  }
};
