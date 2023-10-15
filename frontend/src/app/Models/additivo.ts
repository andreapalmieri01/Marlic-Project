export class Additivo {
  nome: string;
  funzione: string;
  origine: string;
  compatibilita: string;
  biodegradabilita: string;
  fineVita: string;
  sds: string;
  compatibilitaPolimeri: any[];
  compatibilitaRinforzi: any[];

  constructor(
    nome: string,
    funzione: string,
    origine: string,
    compatibilita: string,
    biodegradabilita: string,
    fineVita: string,
    sds: string,
    compatibilitaPolimeri: any[] = [],
    compatibilitaRinforzi: any[] = []
  ) {
    this.nome = nome;
    this.funzione = funzione;
    this.origine = origine;
    this.compatibilita = compatibilita;
    this.biodegradabilita = biodegradabilita;
    this.fineVita = fineVita;
    this.sds = sds;
    this.compatibilitaPolimeri = compatibilitaPolimeri;
    this.compatibilitaRinforzi = compatibilitaRinforzi;
  }
}
