const mongoose = require("mongoose")
const { unlink } = require("fs/promises")

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

function getSauce(req, res) {
    const { id } = req.params
    return Product.findById(id)
}

function getSauceById(req, res) { 
    getSauce(req, res)
        .then(product => sendClientResponse(product, res))
        .catch((err) => res.status(500).send(err))
}

function deleteSauce(req, res) {
    const { id } = req.params
    Product.findByIdAndDelete(id)
        .then((product) => sendClientResponse(product, res))
        .then((item) => deleteImage(item))
        .then((res) => console.log("FILE DELETED", res))
        .catch((err) => res.status(500).send({ message: err }))
}
/*
function deleteImage(product) {
    const imageUrl = product.imageUrl
    const fileToDelete = imageUrl.split("/").at(-1)
    return unlink(`images/${fileToDelete}`).then(() => product)
}
*/

function modifySauce(req, res) {
    const { 
        params: { id }
    } = req

    console.log("req.file", req.file)
    const hasNewImage = req.file != null
    const payload = makePayload(hasNewImage, req)

    Product.findByIdAndUpdate(id, payload)
        .then((dbResponse) => sendClientResponse(dbResponse, res))
        .then((product) => deleteImage(product))
        .then((res) => console.log('FILE DELETED', res))
        .catch((err) => console.error("PROBLEM UPDATING", err))
}

function deleteImage(product) {
    if (product == null) return
    console.log("DELETE IMAGE", product)
    const imageToDelete = product.imageUrl.split("/").at(-1)
    return unlink("images/" + imageToDelete)
        .catch((err) => console.error("PROBLEM UPDATING", err))
}

function makePayload(hasNewImage, req) {
    console.log("hasNewImage:", hasNewImage)
    if (!hasNewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = makeImageUrl(req, req.file.filename)
    console.log("NOUVELLE IMAGE A GERER")
    console.log("voici le payload:", payload)
    return payload
}

function sendClientResponse(product, res) {
    if (product == null) {
        console.log("NOTHING TO UPDATE")
        return res.status(404).send({ message: "Object not found in database" })
    }
    console.log("ALL GOOD, UPDATING:", product)
    return Promise.resolve(res.status(200).send(product)).then(() => product)
}

function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName
}

function createSauces(req, res) {
    const { body, file } = req
    const { fileName } = file
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce

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
        .then((message) => res.status(201).send({ message }))
        .catch((err) => res.status(500).send(err))
}

function likeSauce(req, res) {
    const { like, userId } = req.body
    if (![0, -1, 1].includes(like)) return res.status(403).send({ message: "Invalid like value"})

    getSauce(req, res)
        .then((product) => updateVote(product, like, userId, res))
        .then(pr => pr.save())
        .then((prod) => sendClientResponse(prod, res))
        .catch((err) => res.status(500).send(err))
}

function updateVote(product, like, userId, res) {
    if (like === 1 || like === -1) return incrementVote(product, userId, like)
    if (like === 0) return resetVote(product, userId, res)
}

function resetVote(product, userId) {
    const { usersLiked, usersDisliked } = product
    if ([usersLiked, usersDisliked].every(arr => arr.includes(userId))) 
        return Promise.reject("Users seems to have voted both ways")

    if(![usersLiked, usersDisliked].some((arr) => arr.includes(userId))) 
        return Promise.reject("User seems to have not voted")
    
    const voteToUpdate = usersLiked.includes(userId) ? usersLiked : usersDisliked
    
    let arrayToUpdate = usersLiked.includes(userId) ? usersLiked : usersDisliked
    const arrayWithoutUser = arrayToUpdate.filter((id) => id != userId)
    arrayToUpdate = arrayWithoutUser
    return product
}

function incrementVote(product, userId, like) {
    const { usersLiked, usersDisliked } = product

    const votersArray = like === 1 ? usersLiked : usersDisliked
    if (votersArray.includes(userId)) return
    votersArray.push(userId)

    let voteToUpdate = like === 1 ?product.likes : product.dislikes
    voteToUpdate++
    return product
}

module.exports = { getSauces, createSauces, getSauceById, deleteSauce, modifySauce, likeSauce }