// Database
const mongoose = require('mongoose');
const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
const db = process.env.DB_NAME
const uri =
  `mongodb+srv://${username}:${password}@cluster0.nmwlz.mongodb.net/${db}?retryWrites=true&w=majority`

/*
let uri
if (process.env.NODE_ENV === "production") {
    uri = "http://la_vraie_url_de_mongo"
} else {
    uri = "http://la_mongo_de_dev"
}
*/


//console.log("mot de passe de Mongo: ", process.env.MOTDEPASSE)

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
