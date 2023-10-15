const Administrator = require("../model/administratorsModel");
const bcrypt = require("bcrypt");
const auth = require("../middleware/jwtController");
const passManager = require("../utils/passController.js");
const Additivo = require("../model/additivoModel");
const secret = "!Rj(98bC%9sVn&^c";


module.exports.createAdmin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password + secret;

  const usernameCheck = await Administrator.findOne({ username });
  if(usernameCheck){
    res.status(404).send({
      status: 404,
      message: `Username already exit`,
    });
  }


  if(!username || !password){
    res.status(400).send({
      status: 400,
      message: `Filend can't be empty`,
    });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("User : " + username + " " + "Salt : " + salt + " " + "Password : " + hashedPassword);

  const user = Administrator.create({
    username: username,
    salt: salt,
    password: hashedPassword
  });

  if(user) {
    res.status(201).send({
      status: 201,
      message: `Additivo created successfully`
    })
  }else {
    res.status(500).send({
      status: 500,
      message: `Error creating additivo`,
    });
  }

}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    const secret = "!Rj(98bC%9sVn&^c";
    const hashedPassword = password + secret;
    const user = await Administrator.findOne({ username });

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User with this email not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(hashedPassword, user.password);

    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect username or password", status: false });
    } else {
      const accessToken = auth.getAccessTokenUser(user);
      const refreshToken = auth.getRegfreshTokenUser(user);
      auth.addRefreshToken(refreshToken);
      console.log(user._id); // Stampa l'id dell'utente nella console
      var objectId = user._id.toString();
      var hexadecimal = objectId.substring(0, 8); // Prendi i primi 8 caratteri
      var number = parseInt(hexadecimal, 16); // Converti l'esadecimale in numero
      const jsonResponse = { id: number, username: username };
      console.log(jsonResponse);
      res.status(200).send({
        status: 200,
        jsonResponse,
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "Login Successfull.",
      });
    }
};
 /*
 module.exports.login = async (req, res) => {

  if (req.body.username == "" || req.body.username == undefined || req.body.password == "" || req.body.password == undefined) {
    res.status(400).send({
      message: "Content can't be empty!"
    });
    return;
  }

  let username = req.body.email;
  let password = req.body.password;

  password = password + secret
  Administrator.findOne({
    where: {
      username: username
    },
  }).then((user) => {
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User with this email not found.",
      });
    }

    return passManager.comparePass(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            console.log("Password not valid");
            return res.status(400).send({
              status: 400,
              message: "Password not correct.",
            });
          } else {
            const accessToken = auth.getAccessTokenUser(user);
            const refreshToken = auth.getRegfreshTokenUser(user);
            auth.addRefreshToken(refreshToken);
            const jsonResponse = { id: user.id, username: user.username };
            res.status(200).send({
              status: 200,
              jsonResponse,
              accessToken: accessToken,
              refreshToken: refreshToken,
              message: "Login Successfull.",
            });
          }
        });
  });
}
  */
module.exports.logout = async (req, res) => {
  let refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    res.status(400).send({
      status: 400,
      message: "Content can't be empty!"
    });
    return;
  }

  let index = auth.refreshTokens.indexOf(refreshToken);

  if (index == -1) {
    res.status(401).send({
      status: 401,
      message: "You are not authenticated.",
    });
  }

  auth.refreshTokens.splice(index, 1);
  console.log(auth.refreshTokens);

  res.status(200).send({
    status: 200,
    message: "Logout Successfull.",
  });
}

module.exports.refreshToken = async (req, res) => {
  let refreshToken = req.body.refreshToken;

  if (!refreshToken || !auth.containsToken(refreshToken)) {
    return res.status(401).send({
      status: 401,
      message: "You are not authenticated.",
    });
  }

  let user = auth.getUserByRefreshToken(refreshToken);

  auth.refreshTokens = auth.refreshTokens.filter(token => token !== refreshToken);

  let newAccessToken = auth.getAccessTokenUser(user);
  let newRefreshToken = auth.getRegfreshTokenUser(user);
  auth.refreshTokens.push(newRefreshToken);
  console.log("Nuovi Token : " + "\nAccessToken : " + newAccessToken + "\nRefreshToken : " + newRefreshToken);
  console.log(auth.refreshTokens);

  return res.status(200).send({
    status: 200,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
}
module.exports.delete = (req, res) => {
  const username = req.params.username; // Otteniamo il nome dall'URL dei parametri

  if (!username) {
    res.status(400).send({
      status: 400,
      message: "Name can't be empty!"
    });
    return;
  }

  Administrator.deleteOne({ username: username })
      .then(result => {
        if (result.deletedCount === 1) {
          res.status(201).send({
            status: 201,
            message: `User with name '${username}' was deleted successfully`
          });
        } else {
          res.status(404).send({
            status: 404,
            message: `Cannot delete User with name '${username}'. User not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          status: 500,
          message: `Could not delete User with name '${username}'.`
        });
      });
};

module.exports.findAll = async (req, res) => {
  try {
    const amministratori = await Administrator.find({}).sort({ username: 1 });

    res.status(201).json({
      status: 201,
      data: amministratori,
      message: "Tutti gli amministratori trovati."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Errore del server."
    });
  }
}