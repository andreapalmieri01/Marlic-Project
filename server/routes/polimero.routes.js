
module.exports = app => {

    const express = require('express');
    const router = express.Router();
    const authenticate = require("../middleware/jwtController");
    const polimero= require("../controller/polimeroController");

    router.post("/createPolimero", authenticate.authenticateTokenUser, polimero.createPolimero);
    router.get("/find/:nome", polimero.find);
    router.get("/findAll", polimero.findAll);
    router.put('/update/:nome', authenticate.authenticateTokenUser, polimero.update);
    router.delete("/delete/:nome",authenticate.authenticateTokenUser, polimero.delete);
    router.post("/filtraPolimeri", polimero.filtraPolimeri);

    app.use('/api/polimero', router);
}