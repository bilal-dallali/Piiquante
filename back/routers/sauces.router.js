const express = require("express")
const { 
    getSauces, 
    createSauces, 
    getSauceById, 
    deleteSauce, 
    modifySauce 
} = require("../controlers/sauces")
const { authentificateUser } = require("../middleware/auth")
const { upload } = require("../middleware/multer")
const saucesRouter = express.Router()

saucesRouter.get("/", authentificateUser, getSauces)
saucesRouter.post("/", authentificateUser, upload.single("image"), createSauces)
saucesRouter.get("/:id", authentificateUser, getSauceById)
saucesRouter.delete("/:id", authentificateUser, deleteSauce)
saucesRouter.put("/:id", authentificateUser, upload.single("image"), modifySauce)


module.exports = { saucesRouter }