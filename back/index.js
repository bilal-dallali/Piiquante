require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000
const bodyParser = require("body-parser")
const path = require("path")

// Connection to database
require("./mongo")

// Controlers
const { createUser, logUser } = require("./controlers/users")
const { getSauces, createSauces } = require("./controlers/sauces")

// Middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static("public/images"))


const { authentificateUser } = require("./middleware/auth")
const multer = require("multer")
const storage = multer.diskStorage({destination: "images/", filename: makeFilename })
const upload = multer({ storage: storage})

function makeFilename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
}

// Routes

app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", authentificateUser, getSauces)
app.post("/api/sauces", authentificateUser, upload.single("image"), createSauces)
app.get("/", (req, res) => res.send("Hello world !"))

// Listen
app.listen(port, () => console.log("Listening on port " + port))
