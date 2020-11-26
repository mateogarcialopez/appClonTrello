const jwt = require('jsonwebtoken');

const verifiToken = async (req, res, next) => {

    let { authorization } = req.headers;
    console.log(authorization);    

    try {
        var decoded = await jwt.verify(authorization, 'clavesecreta');


        if (decoded) {
            req.user = decoded.data
            next();
        }
    } catch (err) {
        return res.status(400).json({
            status: false,
            err
        });
    }

}

module.exports = { verifiToken };