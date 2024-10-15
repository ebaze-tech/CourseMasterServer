const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");

router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id; //Get user ID from request params
    const user = await UserModel.findById(userId);

    if (user) {
      res.json(user); //Return user details
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
