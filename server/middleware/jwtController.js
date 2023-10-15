require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Array that contains all refresh tokens.
 */
let refreshTokens = [];

function addRefreshToken(token) {
    this.refreshTokens.push(token);
    console.log("Token aggiunto : " + token);
}

function containsToken(token) {
    return this.refreshTokens.includes(token);
}

/**
 * Function that return the JWT Access Token for User.
 * @param {*} the user to returns the JWT.
 */
function getAccessTokenUser(user) {
    return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20m'});
}

/**
 * Function that returns the JWT Refresh Token for User.
 * @param {*} the user to returns the refresh JWT Token.
 */
function getRegfreshTokenUser(user) {
    return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2h' });
}


/**
/**
 * function that returns User by token if is possibile.
 * @param {String} token.
 */
function getUserByToken(token) {
    try {
        let user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return user;
    } catch (err) {
        return null;
    }
}

function getUserByRefreshToken(token) {
    try {
        let user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return user;
    } catch (err) {
        return null;
    }
}

/**
 * Middleware to verify the authorization for User.
 */
function authenticateTokenUser(req, res, next) {
    let authHeader = req.headers['authorization'];
    if (authHeader) {
        let token = authHeader.split(' ')[1];
        let user = getUserByToken(token);
        if (user) {
            req.user = user;
            console.log("User authenticated:", user);
            next();
        } else {
            console.log("Invalid token:", token);
            return res.status(403).send("Token is not valid!");
        }
    } else {
        console.log("Missing authorization header");
        return res.status(401).send("You are not authenticated!");
    }
}


module.exports =
    {
        refreshTokens,
        getRegfreshTokenUser,
        getAccessTokenUser,
        getUserByToken,
        getUserByRefreshToken,
        authenticateTokenUser,
        addRefreshToken,
        containsToken,
    };