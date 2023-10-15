const mongoose = require("mongoose");
const { Schema } = mongoose;

const additivoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  funzione: {
    type: String,
    required: true,
  },
  origine: {
    type: String,
    required: true,
    enum: ["Fossile", "Biomassa"],
  },
  biodegradabilita: {
    type: String,
  },
  fineVita: {
    type: String,
    enum: ["Riciclabile", "Non riciclabile"],
  },
  sds: {
    type: String,
  },
  compatibilitaPolimeri: [{
    type: String,
  }],
  compatibilitaRinforzi: [{
    type: String,
  }],
});

module.exports = mongoose.model("Additivo", additivoSchema);