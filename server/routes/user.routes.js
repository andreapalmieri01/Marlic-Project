const authenticate = require("../middleware/jwtController");

module.exports = app => {

    const express = require('express');
    const router = express.Router();
    const admin = require("../controller/administratorController");
    const authenticate = require("../middleware/jwtController");

    router.post("/login", admin.login);
    router.post("/refreshToken", admin.refreshToken);
    router.post("/logout", admin.logout);
    router.delete("/delete/:username",authenticate.authenticateTokenUser, admin.delete);
    router.get("/findAll", authenticate.authenticateTokenUser, admin.findAll);
    router.post("/createAdmin", authenticate.authenticateTokenUser, admin.createAdmin);

    app.use('/api/user', router);
}