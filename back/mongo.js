// Database
const mongoose = require('mongoose');
const password = "rgFKTzrxvHYQUZlJ"
const uri =
  `mongodb+srv://Bilal:${password}@cluster0.nmwlz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose
  .connect(uri)
  .then(()=> console.log("Connected to Mongo!"))
  .catch((err) => console.error("Error connecting to Mongo: ", err))

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
})

const User = mongoose.model("User", userSchema)

module.exports = {mongoose, User}