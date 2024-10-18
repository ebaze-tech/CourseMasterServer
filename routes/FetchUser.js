const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const { protect } = require("./Authentication");

router.get("/fetchuser/:id", protect, async (req, res) => {
  // const id = req.params.id;
  console.log("Fetched user id:", req.params.id);
  try {
    const user = await UserModel.findById(req.params.id);
    console.log("User found: ", user);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user: ", error);
    res.status(500).json({
      message: "Error fetching user:",
      error,
    });
  }
});
module.exports = router;
