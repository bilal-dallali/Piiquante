const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000

// Database
const mongoose = require('mongoose');
const password = "rgFKTzrxvHYQUZlJ"
const uri =
  `mongodb+srv://Bilal:${password}@cluster0.nmwlz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose
  .connect(uri)
  .then(()=> console.log("Connected to Mongo!"))
  .catch((err) => console.error("Error connecting to Mongo: ", err))

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.post("/api/auth/signup", (req, res) => {
  console.log("Signup request:", req.body)
  res.send({ message: "utilisateur enregistré !" })
})
app.get("/", (req, res) => res.send("Hello world !"))
app.listen(port, () => console.log("Listening on port " + port))
