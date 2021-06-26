const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Register Here
router.post("/register", async (req, res) => {
  try {
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //console.log(hashedPassword);
    // Create New User
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    //Save User And Send Responce
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Login Here

router.post("/login", async (req, res) => {
  try {
    // Find Users
    const user = await User.findOne({
      username: req.body.username,
    });
    !user && res.status(400).json("User Not Found!");

    // Validate Password using Encrypt
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("User Not Found!");

    //Send Login resource
    res.status(200).json({ _id: user._id, username: user.username });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
