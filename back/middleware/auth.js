const jwt = require("jsonwebtoken")

function authentificateUser(req, res, next) {
    console.log("authentificate User")
    const header = req.header("Authorization")
    if (header == null) return res.status(403).send({ message: "Invalid" })

    const token = header.split(" ")[1]
    if (token == null) return res.status(403).send({ message: "Token cannot be null" })

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
        if (err) return res.status(403).send({ message: "Token invalid " + err })
        console.log("Le token est bien valide, on continue")
        next()
    })
}

module.exports = { authentificateUser }