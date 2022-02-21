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
    console.log("Le token a été validé, nous dommes dans getSauces")
    //authentificateUser(req, res)
    //console.log("Le token à l'air bon", decoded)
    Product.find({}).then(products => res.send(products))
    //res.send({ message: [{ sauce: "sauce-1" }, { sauce: "sauce-2" }] })
}

function createSauces(req, res) {
    const name = req.body.name
    const manufacturer = req.body.manufacturer
    console.log({ body: req.body })

    const product = new Product({
        userId: "hello",
        name: "hello",
        manufacturer: "hello",
        description: "hello",
        mainPepper: "hello",
        imageUrl: "hello",
        heat: 2,
        likes: 2,
        dislikes: 2,
        usersLiked: ["hello"],
        usersDisliked: ["hello"]
    })
    product.save().then((res) => console.log("produit enregistré")).catch(console.error)
}

module.exports = { getSauces, createSauces }