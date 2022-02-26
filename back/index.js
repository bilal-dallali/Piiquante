const { app, express } = require("./server")
const port = 3000
const path = require("path")

// Connection to database
require("./mongo")

// Controlers
const { createUser, logUser } = require("./controlers/users")
const { getSauces, createSauces, getSauceById } = require("./controlers/sauces")

// Middleware
const { upload } = require("./middleware/multer")
const { authentificateUser } = require("./middleware/auth")

// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", authentificateUser, getSauces)
app.post("/api/sauces", authentificateUser, upload.single("image"), createSauces)
app.get("/api/sauces/:id", authentificateUser, getSauceById)
app.get("/", (req, res) => res.send("Hello world !"))

// Listen
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("Listening on port " + port))
