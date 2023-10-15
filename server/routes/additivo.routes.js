
module.exports = app => {

    const express = require('express');
    const router = express.Router();
    const authenticate = require("../middleware/jwtController");
    const additivo = require("../controller/additivoController");

    router.post("/createAdditivo", authenticate.authenticateTokenUser, additivo.createAdditivo);
    router.get("/find/:nome", additivo.find);
    router.get("/findAll", additivo.findAll);
    router.put('/update/:nome', authenticate.authenticateTokenUser, additivo.update);
    router.delete("/delete/:nome",authenticate.authenticateTokenUser, additivo.delete);
    router.post("/filtraAdditivi", additivo.filtraAdditivi);

    app.use('/api/additivo', router);
}