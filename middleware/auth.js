const jwt = require("jsonwebtoken");
const userService = require("../service/userService");

const encodeJwt = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET);
};

const decodeToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodeData = jwt.decode(token, process.env.JWT_SECRET);
        console.log(decodeData);

        if (decodeData) {
            const getUser = await userService.getUserByEmail(decodeData.email)
            if (getUser) {
                req.user = getUser;
                next();
            } else {
                res.status(400).json({
                    success: false,
                    data: null,
                    message: "Invalid token"
                })
            }


        } else {
            res.status(400).json({
                success: false,
                data: null,
                message: "Invalid token"
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error.message
        })

    }

}

module.exports = {
    encodeJwt,
    decodeToken

}