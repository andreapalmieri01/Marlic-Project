const mongoose = require("mongoose");
const { Schema } = mongoose;

const rinforzoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ["Inorganica", "Organica"],
    required: true,
  },
  geometria: {
    type: String,
    enum: ["Particella", "Fibra Corta", "Fibra Lunga", "Tessuto"],
    required: true,
  },
  origine: {
    type: String,
    enum: ["Fossile", "Biomassa"],
    required: true,
  },
  trattamentiChimici: {
    type: String,
  },
  tensileStrength: {
    type: Number,
  },
  tensileStrengthMax: {
    type: Number,
  },
  compressionalStrength: {
    type: Number,
  },
  compressionalStrengthMax: {
    type: Number,
  },
  flexuralStrength: {
    type: Number,
  },
  flexuralStrengthMax: {
    type: Number,
  },
  torsionalStrength: {
    type: Number,
  },
  torsionalStrengthMax: {
    type: Number,
  },
  impactStrength: {
    type: Number,
  },
  impactStrengthMax: {
    type: Number,
  },
  elongazioneRottura: {
    type: Number,
  },
  elongazioneRotturaMax: {
    type: Number,
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
  compatibilitaAdditivi: [{
    type: String,
  }],
});

module.exports = mongoose.model("Rinforzo", rinforzoSchema);