require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: "images/",
    filename: function (req, file, cb) {
        cb(null, makeFilename(req, file))
    }
})

function makeFilename(req, file) {
    console.log("req, file:", req, file)
    const fileName = `${Date.now()}-${file.originalname}`
    file.fileName = fileName
    return fileName
}

const upload = multer({ storage: storage})

// Connection to database
require("./mongo")

// Controlers
const { createUser, logUser } = require("./controlers/users")
const { getSauces, createSauces } = require("./controlers/sauces")

// Middleware
app.use(cors())
app.use(express.json())

const { authentificateUser } = require("./middleware/auth")

// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", authentificateUser, getSauces)
app.post("/api/sauces", authentificateUser, upload.single("image"), createSauces)
app.get("/", (req, res) => res.send("Hello world !"))

// Listen
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("Listening on port " + port))
