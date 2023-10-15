const bcrypt = require('bcrypt');
const secret = "!Rj(98bC%9sVn&^c";

/**
 * This function generate Password hashed from a
 * Password and a Salt passed as parameters.
 * @param {*} the password to be hashed.
 * @param {*} the salt or the numbers of hops for the hash.
 * @returns
 */
function generatePassword(password, salt){
    const cryptPassword = password + secret;
    return bcrypt.hash(cryptPassword, salt);

}

/**
 * Function that returns salt generated.
 * @returns salt generated unique.
 */
function generateSalt(){
    return bcrypt.genSalt();
}


/**
 * This function compare two hashed password with brcypt library
 * @param {String} password the first password
 * @param {String} generated the password hashed.
 * @returns {Boolean} true if the encrypted password is comparable to real password, else false;
 */
function comparePass(plainPassword, hashPassword){
    return bcrypt.compare(plainPassword, hashPassword)
}

module.exports = {generatePassword, generateSalt, comparePass};