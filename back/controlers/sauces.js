const mongoose = require("mongoose")

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
    console.log("Le token a été validé, nous sommes dans getSauces")
    //console.log("Le token à l'air bon", decoded)
    Product.find({}).then((products) => res.send(products))
    //res.send({ message: [{ sauce: "sauce-1" }, { sauce: "sauce-2" }] })
}

function createSauces(req, res) {
    const { body, file } = req
    const saute = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce

    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        //imageUrl: imageUrl,
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    product
    .save()
    .then((res) => console.log("produit enregistré"))
    .catch(console.error)
}

module.exports = { getSauces, createSauces }