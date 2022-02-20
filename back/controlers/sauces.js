const jwt = require("jsonwebtoken")

function getSauces(req, res) {
    const header = req.header("Authorization")
    if (header == null) return res.status(403).send({ message: "Invalid" })

    const token = header.split(" ")[1]
    if (token == null) return res.status(403).send({ message: "Token cannot be null" })
    console.log("token:", token)

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => handleToken(err, decoded, res))
    
}

function handleToken(err, decoded) {
    if (err) res.status(403).send({ message: "Token invalid" + err })
    else {
        console.log("Le token à l'air bon", decoded)
        res.send({ message: [{sauces: "sauce-1"}, {sauces: "sauce-2"}] })
    }
}

module.exports = { getSauces }