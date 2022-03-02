const bodyParser = require("body-parser")
const express = require("express")
const { getSauces, createSauces, getSauceById, deleteSauce, modifySauce, likeSauce } = require("../controlers/sauces")
const { authentificateUser } = require("../middleware/auth")
const { upload } = require("../middleware/multer")
const saucesRouter = express.Router()

saucesRouter.use(bodyParser.json())
saucesRouter.use(authentificateUser)

saucesRouter.get("/", getSauces)
saucesRouter.post("/", upload.single("image"), createSauces)
saucesRouter.get("/:id", getSauceById)
saucesRouter.delete("/:id", deleteSauce)
saucesRouter.put("/:id", upload.single("image"), modifySauce)
saucesRouter.post("/:id/like", likeSauce)

module.exports = { saucesRouter }