const mongoose = require("mongoose");
const { Schema } = mongoose;

const polimeroSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  origine: {
    type: String,
    enum: ["Fossile", "Biomassa"],
  },
  classe: {
    type: String,
    required: true,
  },
  pesoMolecolarePonderale: {
    type: Number,
  },
  pesoMolecolarePonderaleMax: {
    type: Number,
  },
  pesoMolecolareNumerico: {
    type: Number,
  },
  pesoMolecolareNumericoMax: {
    type: Number,
  },
  temperaturaFusione: {
    type: Number,
  },
  temperaturaFusioneMax: {
    type: Number,
  },
  temperaturaRammollimento: {
      type: Number,
  },
  temperaturaRammollimentoMax: {
    type: Number,
  },
  temperaturaTransizioneVetrosa: {
    type : Number,
  },
  temperaturaTransizioneVetrosaMax: {
    type : Number,
  },
  temperaturaCristallizzazione: {
      type: Number,
  },
  temperaturaCristallizzazioneMax: {
    type: Number,
  },
  gradoDiRamificazione : {
      type:  String,
  },
  cristallinita: {
    type: Number,
    min: 0,
    max: 100,
  },
  viscositaTaglio: {
      type: Number,
  },
  viscositaTaglioMax: {
    type: Number,
  },
  densita: {
    type : Number,
    min: 0,
  },
  densitaMax: {
    type : Number,
    min: 0,
  },
  durezza: {
    type : Number,
    min: 0,
  },
  tensileStrength: {
      type: Number,
  },
  tensileStrengthMax: {
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
  moduloElastico: {
      type: Number,
  },
  moduloElasticoMax: {
    type: Number,
  },
  fineVita: {
    type: String,
    enum: ["Riciclabile", "Non riciclabile"],
  },
  sds: {
    type: String,
  },
  compatibilitaRinforzi: [{
    type: String,
  }],
  compatibilitaAdditivi: [{
    type: String,
  }],
});

module.exports = mongoose.model("Polimero/Resina", polimeroSchema);