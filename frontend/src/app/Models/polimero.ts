export class Polimero {
  nome: string;
  origine: string;
  classe: string;
  pesoMolecolarePonderale: number;
  pesoMolecolarePonderaleMax: number;
  pesoMolecolareNumerico: number;
  pesoMolecolareNumericoMax: number;
  temperaturaFusione: number;
  temperaturaFusioneMax: number;
  temperaturaRammollimento: number;
  temperaturaRammollimentoMax: number;
  temperaturaTransizioneVetrosa: number;
  temperaturaTransizioneVetrosaMax: number;
  temperaturaCristallizzazione: number;
  temperaturaCristallizzazioneMax: number;
  gradoDiRamificazione: string;
  cristallinita: number;
  viscositaTaglio: number;
  viscositaTaglioMax: number;
  densita: number;
  densitaMax: number;
  durezza: number;
  tensileStrength: number;
  tensileStrengthMax: number;
  torsionalStrength: number;
  torsionalStrengthMax: number;
  impactStrength: number;
  impactStrengthMax: number;
  elongazioneRottura: number;
  elongazioneRotturaMax: number;
  moduloElastico: number;
  moduloElasticoMax: number;
  biodegradabilita: string;
  fineVita: string;
  sds: string;
  compatibilitaRinforzi: any[];
  compatibilitaAdditivi: any[];
  [key: string]: string | number | any[];

  constructor(
    nome: string,
    origine: string,
    classe: string,
    pesoMolecolarePonderale: number,
    pesoMolecolarePonderaleMax: number,
    pesoMolecolareNumerico: number,
    pesoMolecolareNumericoMax: number,
    temperaturaFusione: number,
    temperaturaFusioneMax: number,
    temperaturaRammollimento: number,
    temperaturaRammollimentoMax: number,
    temperaturaTransizioneVetrosa: number,
    temperaturaTransizioneVetrosaMax: number,
    temperaturaCristallizzazione: number,
    temperaturaCristallizzazioneMax: number,
    gradoDiRamificazione: string,
    cristallinita: number,
    viscositaTaglio: number,
    viscositaTaglioMax: number,
    densita: number,
    densitaMax: number,
    durezza: number,
    tensileStrength: number,
    tensileStrengthMax: number,
    torsionalStrength: number,
    torsionalStrengthMax: number,
    impactStrength: number,
    impactStrengthMax: number,
    elongazioneRottura: number,
    elongazioneRotturaMax: number,
    moduloElastico: number,
    moduloElasticoMax: number,
    biodegradabilita: string,
    fineVita: string,
    sds: string,
    compatibilitaRinforzi: any[] = [],
    compatibilitaAdditivi: any[] = []
  ) {
    this.nome = nome;
    this.origine = origine;
    this.classe = classe;
    this.pesoMolecolarePonderale = pesoMolecolarePonderale;
    this.pesoMolecolarePonderaleMax = pesoMolecolarePonderaleMax;
    this.pesoMolecolareNumerico = pesoMolecolareNumerico;
    this.pesoMolecolareNumericoMax = pesoMolecolareNumericoMax;
    this.temperaturaFusione = temperaturaFusione;
    this.temperaturaFusioneMax = temperaturaFusioneMax;
    this.temperaturaRammollimento = temperaturaRammollimento;
    this.temperaturaRammollimentoMax = temperaturaRammollimentoMax;
    this.temperaturaTransizioneVetrosa = temperaturaTransizioneVetrosa;
    this.temperaturaTransizioneVetrosaMax = temperaturaTransizioneVetrosaMax;
    this.temperaturaCristallizzazione = temperaturaCristallizzazione;
    this.temperaturaCristallizzazioneMax = temperaturaCristallizzazioneMax;
    this.gradoDiRamificazione = gradoDiRamificazione;
    this.cristallinita = cristallinita;
    this.viscositaTaglio = viscositaTaglio;
    this.viscositaTaglioMax = viscositaTaglioMax;
    this.densita = densita;
    this.densitaMax = densitaMax;
    this.durezza = durezza;
    this.tensileStrength = tensileStrength;
    this.tensileStrengthMax = tensileStrengthMax;
    this.torsionalStrength = torsionalStrength;
    this.torsionalStrengthMax = torsionalStrengthMax;
    this.impactStrength = impactStrength;
    this.impactStrengthMax = impactStrengthMax;
    this.elongazioneRottura = elongazioneRottura;
    this.elongazioneRotturaMax = elongazioneRotturaMax;
    this.moduloElastico = moduloElastico;
    this.moduloElasticoMax = moduloElasticoMax;
    this.biodegradabilita = biodegradabilita;
    this.fineVita = fineVita;
    this.sds = sds;
    this.compatibilitaRinforzi = compatibilitaRinforzi;
    this.compatibilitaAdditivi = compatibilitaAdditivi;
  }
}
