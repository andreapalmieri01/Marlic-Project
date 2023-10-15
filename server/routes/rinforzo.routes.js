module.exports = app => {

    const express = require('express');
    const router = express.Router();
    const authenticate = require("../middleware/jwtController");
    const rinforzo= require("../controller/rinforzoController");

    router.post("/createRinforzo", authenticate.authenticateTokenUser, rinforzo.createRinforzo);
    router.get("/find/:nome", rinforzo.find);
    router.get("/findAll", rinforzo.findAll);
    router.put('/update/:nome', authenticate.authenticateTokenUser, rinforzo.update);
    router.delete("/delete/:nome",authenticate.authenticateTokenUser, rinforzo.delete);
    router.post("/filtraRinforzi", rinforzo.filtraRinforzi);

    app.use('/api/rinforzo', router);
}