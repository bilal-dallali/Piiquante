const mongoose = require("mongoose")
const unlink = require("fs").promises.unlink

const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})
const Product = mongoose.model("Product", productSchema)

function getSauces(req, res) {
    Product.find({})
        .then((product) => res.send(product))
        .catch((error) => res.status(500).send(error))
}

function getSauceById(req, res) {
    const { id } = req.params
    Product.findById(id)
        .then((product) => res.send(product))
        .catch(console.error)
}

function deleteSauce(req, res) {
    const { id } = req.params

    //Ordre de suppression du produit envoyé à Mongo
    Product.findByIdAndDelete(id)
        //Supprimer l'image localement
        .then(deleteImage)
        //Envoyer un message de succès côté client
        .then((product) => res.send({ message: product }))
        .catch((err) => res.status(500).send({ message: err }))
}

function deleteImage(product) {
    const imageUrl = product.imageUrl
    const fileToDelete = imageUrl.split("/").at(-1)
    return unlink(`images/${fileToDelete}`).then(() => product)
}


function modifySauce(req, res) {
    const { params: {id}} = req

    const { body } = req
    console.log("body and params:", body, id)
    Product.findByIdAndUpdate(id, body)
        .then(res => console.log("ALL GOOD UPDATING: ", res))
        .catch(err => console.error("PROBLEM UPDATING", err))
}


function createSauces(req, res) {
    const { body, file } = req
    const { fileName } = file
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce
    
    function makeImageUrl(req, fileName) {
        return req.protocol + "://" + req.get("host") + "/images/" + fileName
    }

    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: makeImageUrl(req, fileName),
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    product
        .save()
        .then((message) => {
            res.status(201).send({ message: message })
            return console.log("produit enregistré", res)
        })
        .catch(console.error)
}

module.exports = { getSauces, createSauces, getSauceById, deleteSauce, modifySauce }