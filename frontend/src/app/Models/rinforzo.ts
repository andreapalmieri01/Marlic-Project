export class Rinforzo {
  nome: string;
  tipo: string;
  geometria: string;
  origine: string;
  trattamentiChimici: string;
  tensileStrength: number;
  tensileStrengthMax: number;
  compressionalStrength: number;
  compressionalStrengthMax: number;
  flexuralStrength: number;
  flexuralStrengthMax: number;
  torsionalStrength: number;
  torsionalStrengthMax: number;
  impactStrength: number;
  impactStrengthMax: number;
  elongazioneRottura: number;
  elongazioneRotturaMax: number;
  compatibilita: string;
  biodegradabilita: string;
  fineVita: string;
  sds: string;
  compatibilitaPolimeri: any[];
  compatibilitaAdditivi: any[];
  [key: string]: string | number | any[];

  constructor(
    nome: string,
    tipo: string,
    geometria: string,
    origine: string,
    trattamentiChimici: string,
    tensileStrength: number,
    tensileStrengthMax: number,
    compressionalStrength: number,
    compressionalStrengthMax: number,
    flexuralStrength: number,
    flexuralStrengthMax: number,
    torsionalStrength: number,
    torsionalStrengthMax: number,
    impactStrength: number,
    impactStrengthMax: number,
    elongazioneRottura: number,
    elongazioneRotturaMax: number,
    compatibilita: string,
    biodegradabilita: string,
    fineVita: string,
    sds: string,
    compatibilitaPolimeri: any[] = [],
    compatibilitaAdditivi: any[] = []
  ) {
    this.nome = nome;
    this.tipo = tipo;
    this.geometria = geometria;
    this.origine = origine;
    this.trattamentiChimici = trattamentiChimici;
    this.tensileStrength = tensileStrength;
    this.tensileStrengthMax = tensileStrengthMax;
    this.compressionalStrength = compressionalStrength;
    this.compressionalStrengthMax = compressionalStrengthMax;
    this.flexuralStrength = flexuralStrength;
    this.flexuralStrengthMax = flexuralStrengthMax;
    this.torsionalStrength = torsionalStrength;
    this.torsionalStrengthMax = torsionalStrengthMax;
    this.impactStrength = impactStrength;
    this.impactStrengthMax = impactStrengthMax;
    this.elongazioneRottura = elongazioneRottura;
    this.elongazioneRotturaMax = elongazioneRotturaMax;
    this.compatibilita = compatibilita;
    this.biodegradabilita = biodegradabilita;
    this.fineVita = fineVita;
    this.sds = sds;
    this.compatibilitaPolimeri = compatibilitaPolimeri;
    this.compatibilitaAdditivi = compatibilitaAdditivi;
  }
}
