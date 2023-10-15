import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { Polimero } from 'src/app/Models/polimero';
import {Additivo} from "../../../../Models/additivo";
import {Rinforzo} from "../../../../Models/rinforzo";
import {User} from "../../../../Models/user";
import {UserService} from "../../../../service/user.service";
import {UnitàMisuraService} from "../../../../service/unitaMisura.service";




@Component({
  selector: 'app-polimeri',
  templateUrl: './polimeri.component.html',
  styleUrls: ['./polimeri.component.scss']
})
export class PolimeriComponent implements OnInit {
  form !: FormGroup;
  allPolimeri: Polimero[] = [];
  showAllPolimeri = true;
  data: any;
  userType: User | undefined;
  addNewPolimero = false;
  searchNome: string = "";
  selectedPolimero: Polimero | null = null;
  selectedAdditivo: Additivo | null = null;
  selectedRinforzo: Rinforzo | null = null;
  isEditing = false;
  showAdditivoDetails = false;
  showRinforzoDetails = false;
  showDeletePolimeroForm = false;

  showMaxFields: { [key: string]: boolean } = {};

  deleteForm!: FormGroup;
  deleteSuccessMessage = '';
  additivi: string[] = [];
  isUser: boolean | undefined;
  isFiltering: boolean = false;
  showFilterPolimeroForm = false;
  valoreFiltro: number | null = null;  // Variabile per il valore di filtro
  condizioneFiltro: string = ''; // Variabile per la condizione di filtro
  campoFiltro: string = ''; // Variabile per il campo di filtro
  polimeriFiltrati: Polimero[] = []; // Array per i polimeri filtrati
  showPolimeriFiltrati: boolean = false;
  criteriFiltraggio: any[] = [{ campo: '', operatore: '', valore: null }];
  campiNumerici: string[] = [
    'pesoMolecolarePonderale',
    'pesoMolecolareNumerico',
    'temperaturaFusione',
    'temperaturaRammollimento',
    'temperaturaTransizioneVetrosa',
    'temperaturaCristallizzazione',
    'cristallinita',
    'durezza',
    'viscositaTaglio',
    'densita',
    'tensileStrength',
    'torsionalStrength',
    'impactStrength',
    'elongazioneRottura',
    'moduloElastico',
  ];

  unitaDiMisuraPerCampi: { [campo: string]: string[] } = {
    temperatura: ['°C', 'K'],
    peso: ['g/mol'],
    forza: ['MPa', 'GPa', 'N/mm²', 'N/m²', 'kJ/m²', 'mJ/mm²'],
    densita: ['g/cm³', 'kg/l'],
    elongazione: ['MPa', 'Pa', '%'],
    viscosita: ['Pa·s', 'mPa·s'],
    cristallinita: ['%'],
    durezza: ['AShore', 'Shore D', 'HR', 'HV', 'HB']
  };


  constructor(
    private http: HttpClient,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private unitaMisuraService: UnitàMisuraService,
  ) {}

  ngOnInit() {
    this.userType = this.userService.getUser();
        if (this.userType instanceof User){
          console.log("User is authenticated.");
          this.isUser = true;
        this.initForm();
        this.getAllPolimeri();
        this.deleteForm = this.formBuilder.group({
          nome: ['', Validators.required],
        });
        }else{
          this.getAllPolimeri();
        }
  }

  initForm() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      origine: ['', Validators.required],
      classe: ['', Validators.required],
      pesoMolecolarePonderale: [null, [Validators.min(0)]],
      pesoMolecolarePonderaleMax: [null, [Validators.min(0)]],
      pesoMolecolareNumerico: [null, [Validators.min(0)]],
      pesoMolecolareNumericoMax: [null, [Validators.min(0)]],
      temperaturaFusione: [null],
      temperaturaFusioneMax: [null],
      temperaturaRammollimento: [null],
      temperaturaRammollimentoMax: [null],
      temperaturaTransizioneVetrosa: [null],
      temperaturaTransizioneVetrosaMax: [null],
      temperaturaCristallizzazione: [null],
      temperaturaCristallizzazioneMax: [null],
      gradoDiRamificazione: [''],
      cristallinita: [null, [Validators.min(0), Validators.max(100)]],
      viscositaTaglio: [null],
      viscositaTaglioMax: [null],
      densita: [null, [Validators.min(0)]],
      densitaMax: [null],
      durezza: [null],
      tensileStrength: [null],
      tensileStrengthMax: [null],
      torsionalStrength: [null],
      torsionalStrengthMax: [null],
      impactStrength: [null],
      impactStrengthMax: [null],
      elongazioneRottura: [null],
      elongazioneRotturaMax: [null],
      moduloElastico: [null],
      moduloElasticoMax: [null],
      biodegradabilita: [''],
      fineVita: [''],
      sds: [''],
      compatibilitaRinforzi: this.formBuilder.array([]),
      compatibilitaAdditivi: this.formBuilder.array([]),
    });
  }
  toggleMaxField(fieldName: string) {
    this.showMaxFields[fieldName] = !this.showMaxFields[fieldName];
  }

  filtrarePolimeri() {
    this.showAllPolimeri = false;

    // Costruisci l'array dei criteri di filtraggio
    const criteriFiltraggio = this.criteriFiltraggio.filter((criterio) => {
      return criterio.campo && criterio.operatore && criterio.valore;
    });

    // Invia la richiesta al server per il filtraggio
    this.http.post('http://localhost:4200/api/polimero/filtraPolimeri', { criteri: criteriFiltraggio })
      .subscribe((response) => {
        this.data = response;
        if (this.data.status == 201) {
          this.polimeriFiltrati = this.data.data;
          this.polimeriFiltrati.sort((a, b) => a.nome.localeCompare(b.nome));
          this.showAllPolimeri = false;
          this.showPolimeriFiltrati = true;
          this.isFiltering = true;
        }
      }, err => {
        this.data = err;
        if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
        }
      });
  }

  annullaFiltro() {
    // Ripristina la visualizzazione dei polimeri non filtrati
    this.showFilterPolimeroForm = false;
    this.polimeriFiltrati = [];
    // Puoi anche reimpostare i valori dei campi di filtro se necessario
    this.campoFiltro = '';
    this.condizioneFiltro = '';
    this.valoreFiltro = 0;
    this.showAllPolimeri = true;
    this.isFiltering = false;
  }
  aggiungiCriterio() {
    this.criteriFiltraggio.push({ campo: '', operatore: '', valore: null });
  }

  rimuoviCriterio(index: number) {
    this.criteriFiltraggio.splice(index, 1);
  }

  aggiungiAdditivo() {
    this.compatibilitaAdditiviControls.push(this.formBuilder.control('')); // Aggiungi un nuovo FormControl al FormArray
  }
  rimuoviAdditivo(index: number) {
    this.compatibilitaAdditiviControls.removeAt(index); // Rimuovi l'elemento dal FormArray
  }
  get compatibilitaAdditiviControls() {
    return this.form.get('compatibilitaAdditivi') as FormArray;
  }

  visualizzaSchedaAdditivo(additivo: string) {
    // Esegui la richiesta HTTP per ottenere la scheda tecnica dell'additivo
    this.http.get(`http://localhost:4200/api/additivo/find/${additivo}`).subscribe(
      (response: any) => {
          if (response.status === 201) {
            // Gestisci la risposta qui, ad esempio assegnando i dati alla variabile selezionata
            this.selectedAdditivo = response.data;
            this.showAdditivoDetails = true;
          }
          // Esegui le azioni necessarie per mostrare la scheda tecnica dell'additivo
        }, err => {
          this.data = err;
          if (this.data.status == 400) {
            alert("Campi vuoti. Operazione non valida. Riprova.");
            return;
          } else if (this.data.status == 500) {
            alert("Something went wrong. Please try again");
            return;
          }
        });
      }
  closeAdditivoDetails() {
    this.selectedAdditivo = null;
  }
  aggiungiRinforzo() {
    this.compatibilitaRinforziControls.push(this.formBuilder.control('')); // Aggiungi un nuovo FormControl al FormArray
  }
  rimuoviRinforzo(index: number) {
    this.compatibilitaRinforziControls.removeAt(index); // Rimuovi l'elemento dal FormArray
  }
  get compatibilitaRinforziControls() {
    return this.form.get('compatibilitaRinforzi') as FormArray;
  }
  closeRinforzoDetails() {
    this.selectedRinforzo = null;
  }

  visualizzaSchedaRinforzo(rinforzo: string) {
    // Esegui la richiesta HTTP per ottenere la scheda tecnica dell'additivo
    this.http.get(`http://localhost:4200/api/rinforzo/find/${rinforzo}`).subscribe(
      (response: any) => {
        if (response.status === 201) {
          // Gestisci la risposta qui, ad esempio assegnando i dati alla variabile selezionata
          this.selectedRinforzo = response.data;
          this.showRinforzoDetails = true;
        }
        // Esegui le azioni necessarie per mostrare la scheda tecnica dell'additivo
      }, err => {
        this.data = err;
        if (this.data.status == 400) {
          alert("Campi vuoti. Operazione non valida. Riprova.");
          return;
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
          return;
        }
      });
  }
  resetForm() {
    this.form.reset();
  }

  //This is the method for reset the Data from backend.
  resetData() {
    this.data = null;
  }

  createPolimeri() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const nome = this.form.value.nome;
    const origine = this.form.value.origine;
    const classe = this.form.value.classe;
    const pesoMolecolarePonderale = this.form.value.pesoMolecolarePonderale;
    const pesoMolecolarePonderaleMax = this.form.value.pesoMolecolarePonderaleMax;
    const pesoMolecolareNumerico = this.form.value.pesoMolecolareNumerico;
    const pesoMolecolareNumericoMax = this.form.value.pesoMolecolareNumericoMax;
    const temperaturaFusione = this.form.value.temperaturaFusione;
    const temperaturaFusioneMax = this.form.value.temperaturaFusioneMax;
    const temperaturaRammollimento = this.form.value.temperaturaRammollimento;
    const temperaturaRammollimentoMax = this.form.value.temperaturaRammollimentoMax;
    const temperaturaTransizioneVetrosa = this.form.value.temperaturaTransizioneVetrosa;
    const temperaturaTransizioneVetrosaMax = this.form.value.temperaturaTransizioneVetrosaMax;
    const temperaturaCristallizzazione = this.form.value.temperaturaCristallizzazione;
    const temperaturaCristallizzazioneMax = this.form.value.temperaturaCristallizzazioneMax;
    const gradoDiRamificazione = this.form.value.gradoDiRamificazione;
    const cristallinita = this.form.value.cristallinita;
    const viscositaTaglio = this.form.value.viscositaTaglio;
    const viscositaTaglioMax = this.form.value.viscositaTaglioMax;
    const densita = this.form.value.densita;
    const densitaMax = this.form.value.densitaMax;
    const durezza = this.form.value.durezza;
    const tensileStrength = this.form.value.tensileStrength;
    const tensileStrengthMax = this.form.value.tensileStrengthMax;
    const torsionalStrength = this.form.value.torsionalStrength;
    const torsionalStrengthMax = this.form.value.torsionalStrengthMax;
    const impactStrength = this.form.value.impactStrength;
    const impactStrengthMax = this.form.value.impactStrengthMax;
    const elongazioneRottura = this.form.value.elongazioneRottura;
    const elongazioneRotturaMax = this.form.value.elongazioneRotturaMax;
    const moduloElastico = this.form.value.moduloElastico;
    const moduloElasticoMax = this.form.value.moduloElasticoMax;
    const biodegradabilita = this.form.value.biodegradabilita;
    const fineVita = this.form.value.fineVita;
    const sds = this.form.value.sds;
    const compatibilitaRinforzi = this.form.value.compatibilitaRinforzi;
    const compatibilitaAdditivi = this.form.value.compatibilitaAdditivi;

    this.http.post('http://localhost:4200/api/polimero/createPolimero', {
      nome: nome,
      origine: origine,
      classe: classe,
      pesoMolecolarePonderale: pesoMolecolarePonderale,
      pesoMolecolarePonderaleMax: pesoMolecolarePonderaleMax,
      pesoMolecolareNumerico: pesoMolecolareNumerico,
      pesoMolecolareNumericoMax: pesoMolecolareNumericoMax,
      temperaturaFusione: temperaturaFusione,
      temperaturaFusioneMax: temperaturaFusioneMax,
      temperaturaRammollimento: temperaturaRammollimento,
      temperaturaRammollimentoMax: temperaturaRammollimentoMax,
      temperaturaTransizioneVetrosa: temperaturaTransizioneVetrosa,
      temperaturaTransizioneVetrosaMax: temperaturaTransizioneVetrosaMax,
      temperaturaCristallizzazione: temperaturaCristallizzazione,
      temperaturaCristallizzazioneMax: temperaturaCristallizzazioneMax,
      gradoDiRamificazione: gradoDiRamificazione,
      cristallinita: cristallinita,
      viscositaTaglio: viscositaTaglio,
      viscositaTaglioMax: viscositaTaglioMax,
      densita: densita,
      densitaMax: densitaMax,
      durezza: durezza,
      tensileStrength: tensileStrength,
      tensileStrengthMax: tensileStrengthMax,
      torsionalStrength: torsionalStrength,
      torsionalStrengthMax: torsionalStrengthMax,
      impactStrength: impactStrength,
      impactStrengthMax: impactStrengthMax,
      elongazioneRottura: elongazioneRottura,
      elongazioneRotturaMax: elongazioneRotturaMax,
      moduloElastico: moduloElastico,
      moduloElasticoMax: moduloElasticoMax,
      biodegradabilita: biodegradabilita,
      fineVita: fineVita,
      sds: sds,
      compatibilitaRinforzi: compatibilitaRinforzi,
      compatibilitaAdditivi: compatibilitaAdditivi
    }, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          alert("Polimero created successfully");
          this.closeCreationPolimeri();
          this.getAllPolimeri();
        }
      }, err => {
        this.data = err;
        if (this.data.status == 404) {
          alert("Campi vuoti. Operazione non valida. Riprova.");
          return;
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
          return;
        }
      });
  }
  closePolimeroDetails() {
    if(this.isFiltering){
      this.selectedPolimero = null;
      this.showPolimeriFiltrati = true;
      this.showAllPolimeri = false;
      this.isEditing = false;
    }else {
      this.selectedPolimero = null;
      this.showAllPolimeri = true;
      this.isEditing = false;
      this.showPolimeriFiltrati = false;
    }
  }


  closeCreationPolimeri() {
    this.resetData();
    this.resetForm();
    this.addNewPolimero = false;
    this.showAllPolimeri = true;
  }

  undoCreation() {
    this.resetForm();
    this.addNewPolimero = false;
    this.showAllPolimeri = true;
  }

  getAllPolimeri() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.http.get<any>(`http://localhost:4200/api/polimero/findAll`, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          this.allPolimeri = this.data.data;
          // Ordina la lista in modo alfabetico
          this.allPolimeri.sort((a, b) => a.nome.localeCompare(b.nome));
        }
      }, err => {
        this.data = err;
        if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
        }
      });
  }

  searchPolimero() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };

    this.http.get(`http://localhost:4200/api/polimero/find/${this.searchNome}`, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          this.selectedPolimero = this.data.data;
        }
      }, err => {
        this.data = err;
        if (this.data.status == 400) {
          alert("Campi vuoti. Operazione non valida. Riprova.");
          return;
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
          return;
        }
      });
  }

  showPolimeroDetails(polimero: Polimero) {
    if (this.selectedPolimero && this.selectedPolimero.nome === polimero.nome) {
      this.showAllPolimeri = false;
    } else {
      const token = localStorage.getItem('accessToken');
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + token
        })
      };

      this.http.get(`http://localhost:4200/api/polimero/find/${polimero.nome}`, httpOptions).subscribe(
        response => {
          this.data = response;
          if (this.data.status == 201) {
            this.selectedPolimero = this.data.data;
            this.showAllPolimeri = false;
          }
        }, err => {
          this.data = err;
          if (this.data.status == 400) {
            alert("Campi vuoti. Operazione non valida. Riprova.");
            return;
          } else if (this.data.status == 500) {
            alert("Something went wrong. Please try again");
            return;
          }
        });
    }
  }

  startEditing() {
    this.isEditing = true;
    if (this.selectedPolimero) {
      // Ripristina i campi del modulo ai valori originali dell'additivo selezionato
      this.form.patchValue({
        nome: this.selectedPolimero.nome,
        origine: this.selectedPolimero.origine,
        classe: this.selectedPolimero.classe,
        pesoMolecolarePonderale: this.selectedPolimero.pesoMolecolarePonderale,
        pesoMolecolarePonderaleMax: this.selectedPolimero.pesoMolecolarePonderaleMax,
        pesoMolecolareNumerico: this.selectedPolimero.pesoMolecolareNumerico,
        pesoMolecolareNumericoMax: this.selectedPolimero.pesoMolecolareNumericoMax,
        temperaturaFusione: this.selectedPolimero.temperaturaFusione,
        temperaturaFusioneMax: this.selectedPolimero.temperaturaFusioneMax,
        temperaturaRammollimento: this.selectedPolimero.temperaturaRammollimento,
        temperaturaRammollimentoMax: this.selectedPolimero.temperaturaRammollimentoMax,
        temperaturaTransizioneVetrosa: this.selectedPolimero.temperaturaTransizioneVetrosa,
        temperaturaTransizioneVetrosaMax: this.selectedPolimero.temperaturaTransizioneVetrosaMax,
        temperaturaCristallizzazione: this.selectedPolimero.temperaturaCristallizzazione,
        temperaturaCristallizzazioneMax: this.selectedPolimero.temperaturaCristallizzazioneMax,
        gradoDiRamificazione: this.selectedPolimero.gradoDiRamificazione,
        cristallinita: this.selectedPolimero.cristallinita,
        viscositaTaglio: this.selectedPolimero.viscositaTaglio,
        viscositaTaglioMax: this.selectedPolimero.viscositaTaglioMax,
        densita: this.selectedPolimero.densita,
        densitaMax: this.selectedPolimero.densitaMax,
        durezza: this.selectedPolimero.durezza,
        tensileStrength: this.selectedPolimero.tensileStrength,
        tensileStrengthMax: this.selectedPolimero.tensileStrengthMax,
        torsionalStrength: this.selectedPolimero.torsionalStrength,
        torsionalStrengthMax: this.selectedPolimero.torsionalStrengthMax,
        impactStrength: this.selectedPolimero.impactStrength,
        impactStrengthMax: this.selectedPolimero.impactStrengthMax,
        elongazioneRottura: this.selectedPolimero.elongazioneRottura,
        elongazioneRotturaMax: this.selectedPolimero.elongazioneRotturaMax,
        moduloElastico: this.selectedPolimero.moduloElastico,
        moduloElasticoMax: this.selectedPolimero.moduloElasticoMax,
        biodegradabilita: this.selectedPolimero.biodegradabilita,
        fineVita: this.selectedPolimero.fineVita,
        sds: this.selectedPolimero.sds,
      });
      const compatibilitaAdditiviArray = this.form.get('compatibilitaAdditivi') as FormArray;
      while (compatibilitaAdditiviArray.length > 0) {
        compatibilitaAdditiviArray.removeAt(0);
      }

      // Aggiungi i controlli per ciascun elemento nell'array compatibilitaAdditivi
      for (const additivo of this.selectedPolimero.compatibilitaAdditivi) {
        compatibilitaAdditiviArray.push(new FormControl(additivo));
      }

      // Rimuovi i controlli esistenti da compatibilitaRinforzi per evitare duplicati
      const compatibilitaRinforziArray = this.form.get('compatibilitaRinforzi') as FormArray;
      while (compatibilitaRinforziArray.length > 0) {
        compatibilitaRinforziArray.removeAt(0);
      }

      // Aggiungi i controlli per ciascun elemento nell'array compatibilitaRinforzi
      for (const rinforzo of this.selectedPolimero.compatibilitaRinforzi) {
        compatibilitaRinforziArray.push(new FormControl(rinforzo));
      }
    }
  }
  cancelEditing() {
    this.isEditing = false
    // Ripristina i dati originali del Polimero
    if (this.selectedPolimero) {
      // Ripristina i campi del modulo ai valori originali del Polimero selezionato
      this.form.patchValue({
        nome: this.selectedPolimero.nome,
        origine: this.selectedPolimero.origine,
        classe: this.selectedPolimero.classe,
        pesoMolecolarePonderale: this.selectedPolimero.pesoMolecolarePonderale,
        pesoMolecolarePonderaleMax: this.selectedPolimero.pesoMolecolarePonderaleMax,
        pesoMolecolareNumerico: this.selectedPolimero.pesoMolecolareNumerico,
        pesoMolecolareNumericoMax: this.selectedPolimero.pesoMolecolareNumericoMax,
        temperaturaFusione: this.selectedPolimero.temperaturaFusione,
        temperaturaFusioneMax: this.selectedPolimero.temperaturaFusioneMax,
        temperaturaRammollimento: this.selectedPolimero.temperaturaRammollimento,
        temperaturaRammollimentoMax: this.selectedPolimero.temperaturaRammollimentoMax,
        temperaturaTransizioneVetrosa: this.selectedPolimero.temperaturaTransizioneVetrosa,
        temperaturaTransizioneVetrosaMax: this.selectedPolimero.temperaturaTransizioneVetrosaMax,
        temperaturaCristallizzazione: this.selectedPolimero.temperaturaCristallizzazione,
        temperaturaCristallizzazioneMax: this.selectedPolimero.temperaturaCristallizzazioneMax,
        gradoDiRamificazione: this.selectedPolimero.gradoDiRamificazione,
        cristallinita: this.selectedPolimero.cristallinita,
        viscositaTaglio: this.selectedPolimero.viscositaTaglio,
        viscositaTaglioMax: this.selectedPolimero.viscositaTaglioMax,
        densita: this.selectedPolimero.densita,
        densitaMax: this.selectedPolimero.densitaMax,
        durezza: this.selectedPolimero.durezza,
        tensileStrength: this.selectedPolimero.tensileStrength,
        tensileStrengthMax: this.selectedPolimero.tensileStrengthMax,
        torsionalStrength: this.selectedPolimero.torsionalStrength,
        torsionalStrengthMax: this.selectedPolimero.torsionalStrengthMax,
        impactStrength: this.selectedPolimero.impactStrength,
        impactStrengthMax: this.selectedPolimero.impactStrengthMax,
        elongazioneRottura: this.selectedPolimero.elongazioneRottura,
        elongazioneRotturaMax: this.selectedPolimero.elongazioneRotturaMax,
        moduloElastico: this.selectedPolimero.moduloElastico,
        moduloElasticoMax: this.selectedPolimero.moduloElasticoMax,
        biodegradabilita: this.selectedPolimero.biodegradabilita,
        fineVita: this.selectedPolimero.fineVita,
        sds: this.selectedPolimero.sds,
      });
    }
    this.resetForm();
  }

  saveEdit() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    if (this.selectedPolimero) {
      const nome = this.form.value.nome;
      const origine = this.form.value.origine;
      const classe = this.form.value.classe;
      const pesoMolecolarePonderale = this.form.value.pesoMolecolarePonderale;
      const pesoMolecolarePonderaleMax = this.form.value.pesoMolecolarePonderaleMax;
      const pesoMolecolareNumerico = this.form.value.pesoMolecolareNumerico;
      const pesoMolecolareNumericoMax = this.form.value.pesoMolecolareNumericoMax;
      const temperaturaFusione = this.form.value.temperaturaFusione;
      const temperaturaFusioneMax = this.form.value.temperaturaFusioneMax;
      const temperaturaRammollimento = this.form.value.temperaturaRammollimento;
      const temperaturaRammollimentoMax = this.form.value.temperaturaRammollimentoMax;
      const temperaturaTransizioneVetrosa = this.form.value.temperaturaTransizioneVetrosa;
      const temperaturaTransizioneVetrosaMax = this.form.value.temperaturaTransizioneVetrosaMax;
      const temperaturaCristallizzazione = this.form.value.temperaturaCristallizzazione;
      const temperaturaCristallizzazioneMax = this.form.value.temperaturaCristallizzazioneMax;
      const gradoDiRamificazione = this.form.value.gradoDiRamificazione;
      const cristallinita = this.form.value.cristallinita;
      const viscositaTaglio = this.form.value.viscositaTaglio;
      const viscositaTaglioMax = this.form.value.viscositaTaglioMax;
      const densita = this.form.value.densita;
      const densitaMax = this.form.value.densitaMax;
      const durezza = this.form.value.durezza;
      const tensileStrength = this.form.value.tensileStrength;
      const tensileStrengthMax = this.form.value.tensileStrengthMax;
      const torsionalStrength = this.form.value.torsionalStrength;
      const torsionalStrengthMax = this.form.value.torsionalStrengthMax;
      const impactStrength = this.form.value.impactStrength;
      const impactStrengthMax = this.form.value.impactStrengthMax;
      const elongazioneRottura = this.form.value.elongazioneRottura;
      const elongazioneRotturaMax = this.form.value.elongazioneRotturaMax;
      const moduloElastico = this.form.value.moduloElastico;
      const moduloElasticoMax = this.form.value.moduloElasticoMax;
      const biodegradabilita = this.form.value.biodegradabilita;
      const fineVita = this.form.value.fineVita;
      const sds = this.form.value.sds;
      const compatibilitaRinforzi = this.form.value.compatibilitaRinforzi;
      const compatibilitaAdditivi = this.form.value.compatibilitaAdditivi;

      this.http.put(`http://localhost:4200/api/polimero/update/${nome}`,{
        nome: nome,
        origine: origine,
        classe: classe,
        pesoMolecolarePonderale: pesoMolecolarePonderale,
        pesoMolecolarePonderaleMax: pesoMolecolarePonderaleMax,
        pesoMolecolareNumerico: pesoMolecolareNumerico,
        pesoMolecolareNumericoMax: pesoMolecolareNumericoMax,
        temperaturaFusione: temperaturaFusione,
        temperaturaFusioneMax: temperaturaFusioneMax,
        temperaturaRammollimento: temperaturaRammollimento,
        temperaturaRammollimentoMax: temperaturaRammollimentoMax,
        temperaturaTransizioneVetrosa: temperaturaTransizioneVetrosa,
        temperaturaTransizioneVetrosaMax: temperaturaTransizioneVetrosaMax,
        temperaturaCristallizzazione: temperaturaCristallizzazione,
        temperaturaCristallizzazioneMax: temperaturaCristallizzazioneMax,
        gradoDiRamificazione: gradoDiRamificazione,
        cristallinita: cristallinita,
        viscositaTaglio: viscositaTaglio,
        viscositaTaglioMax: viscositaTaglioMax,
        densita: densita,
        densitaMax: densitaMax,
        durezza: durezza,
        tensileStrength: tensileStrength,
        tensileStrengthMax: tensileStrengthMax,
        torsionalStrength: torsionalStrength,
        torsionalStrengthMax: torsionalStrengthMax,
        impactStrength: impactStrength,
        impactStrengthMax: impactStrengthMax,
        elongazioneRottura: elongazioneRottura,
        elongazioneRotturaMax: elongazioneRotturaMax,
        moduloElastico: moduloElastico,
        moduloElasticoMax: moduloElasticoMax,
        biodegradabilita: biodegradabilita,
        fineVita: fineVita,
        sds: sds,
        compatibilitaRinforzi: compatibilitaRinforzi,
        compatibilitaAdditivi: compatibilitaAdditivi
      }, httpOptions).subscribe(
        response => {
          this.data = response;
          if (this.data.status === 201) {
            alert("Polimero updated successfully");
            this.closePolimeroDetails();
          }
        },
        err => {
          this.data = err;
          if (this.data.status === 400) {
            alert("Invalid operation. Please try again.");
          } else if (this.data.status === 500) {
            alert("Something went wrong. Please try again.");
          }
        }
      );
    }
    this.isEditing = false;
  }

  deletePolimero(){
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const nome = this.deleteForm.value.nome;

    this.http.delete(`http://localhost:4200/api/polimero/delete/${nome}`, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          alert("Polimero deleted successfully");
          this.getAllPolimeri();
        }
      },
      err => {
        this.data = err;
        if (this.data.status == 404) {
          alert("Polimero not found");
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
        } else {
          alert("An error occurred");
        }
      }
    );
  }

  toggleDeletePolimeroForm() {
    this.showDeletePolimeroForm = !this.showDeletePolimeroForm;
    this.deleteSuccessMessage = ''; // Pulisci il messaggio di conferma
    this.addNewPolimero = false;
    this.showFilterPolimeroForm = false;
  }

  toggleCreatePolimeroForm(){
    this.addNewPolimero = !this.addNewPolimero;
    this.showAllPolimeri = false;
    this.showDeletePolimeroForm = false;
    this.showFilterPolimeroForm = false;
  }

  cancelDelete() {
    this.toggleDeletePolimeroForm(); // Chiudi il modulo di eliminazione
    this.deleteForm.reset(); // Resetta il form
  }

  toggleFilterPolimeroForm(){
    this.addNewPolimero = false;
    this.showDeletePolimeroForm = false;
    this.showAllPolimeri = false;
    this.showFilterPolimeroForm = !this.showFilterPolimeroForm;
  }

  selezionaUnitaMisuraPolimero(campoNumerico: string, unitaMisura: string) {
    let nomePolimero = this.form.get('nome')?.value;
    this.unitaMisuraService.setUnitaMisuraPolimero(nomePolimero, campoNumerico, unitaMisura);
  }

  visualizzaUnitaMisuraPolimero(nomePolimero: string, campoNumerico: string): string {
    return this.unitaMisuraService.getUnitaMisuraPolimero(nomePolimero , campoNumerico);
  }

  visualizzaUnitaMisuraRinforzo(nomeRinforzo: string, campoNumerico: string): string {
    return this.unitaMisuraService.getUnitaMisuraRinforzo(nomeRinforzo, campoNumerico);
  }

}
