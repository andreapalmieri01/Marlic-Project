const express = require('express')
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const Administrator = require("./model/administratorsModel");
require("dotenv").config();
const secret = "!Rj(98bC%9sVn&^c";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes/user.routes')(app);
require ('./routes/polimero.routes')(app);
require ('./routes/additivo.routes')(app);
require ('./routes/rinforzo.routes')(app);
const createAdministrator = async (username, password) => {
    const passwordCrypt = password + secret;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(passwordCrypt, salt);

    const administrator = new Administrator({
        username: username,
        salt: salt,
        password: hashedPassword
    });
    try {
        const createdAdministrator = await administrator.save();
        console.log("Administrator created successfully:", createdAdministrator);
    } catch (error) {
        console.error("Error creating administrator:", error);
    }
};



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("DB Connection Successfull");
}).catch((err) =>{
    console.log(err.message);
});

app.listen(process.env.PORT, async()=>{
   // await createAdministrator("admin", "HPComposite2023");
        console.log(`Server Started on Port ${process.env.PORT}`);
});