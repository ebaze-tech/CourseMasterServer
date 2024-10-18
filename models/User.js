const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  department: { type: String, required: true },
  faculty: { type: String, required: true },
  level: { type: Number, required: true },
  hostel: { type: String, required: true },
  matricNumber: { type: Number, required: true, unique: true },
  adminNumber: { type: String, default: "", unique: true },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  // Only hash the password if it's new or modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (error) {
    next(error); // Pass errors to the next middleware
  }
});

// Compare the given password with the hashed password
// userSchema.methods.matchPassword = async function (plainPassword) {
//   try {
//     return await bcrypt.compare(plainPassword, this.password); // Compare passwords
//   } catch (error) {
//     throw new Error("Error comparing passwords",error); // Handle errors
//   }
// };

module.exports = mongoose.model("User", userSchema);
