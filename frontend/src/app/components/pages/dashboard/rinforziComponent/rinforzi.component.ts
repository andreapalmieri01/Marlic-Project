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
  selector: 'app-rinforzi',
  templateUrl: './rinforzi.component.html',
  styleUrls: ['./rinforzi.component.scss']
})
export class RinforziComponent implements OnInit {
  form !: FormGroup;
  allRinforzi: Rinforzo[] = [];
  showAllRinforzi = true;
  data: any;
  userType: User | undefined;
  addNewRinforzo = false;
  searchNome: string = "";
  selectedPolimero: Polimero | null = null;
  selectedAdditivo: Additivo | null = null;
  selectedRinforzo: Rinforzo | null = null;
  isEditing = false;
  deleteForm!: FormGroup;
  showDeleteRinforzoForm = false;
  showAdditivoDetails = false;
  showPolimeroDetails = false;
  deleteSuccessMessage = '';
  additivi: string[] = [];
  polimeri: string[] = [];
  isUser: boolean | undefined;
  isFiltering: boolean = false;

  showMaxFields: { [key: string]: boolean } = {};

  showFilterRinforzoForm = false;
  valoreFiltro: number | null = null;  // Variabile per il valore di filtro
  condizioneFiltro: string = ''; // Variabile per la condizione di filtro
  campoFiltro: string = ''; // Variabile per il campo di filtro
  rinforziFiltrati: Rinforzo[] = []; // Array per i polimeri filtrati
  showRinforziFiltrati: boolean = false;
  criteriFiltraggio: any[] = [{ campo: '', operatore: '', valore: null }];

  // Inizializza campiNumerici con i nomi dei campi numerici del tuo oggetto Polimero
  campiNumerici: string[] = [
    'tensileStrength',
    'compressionalStrength',
    'flexuralStrength',
    'torsionalStrength',
    'impactStrength',
    'elongazioneRottura',
  ];

  unitaDiMisuraPerCampi: { [campo: string]: string[] } = {
    forza: ['MPa', 'GPa', 'N/mm²', 'N/m²', 'kJ/m²', 'Msi', 'ksi'],
    elongazione: ['MPa', 'Pa', '%'],
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
      this.getAllRinforzi();
      this.deleteForm = this.formBuilder.group({
        nome: ['', Validators.required],
      });
    }else{
      this.getAllRinforzi();
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      geometria: ['', Validators.required],
      origine: ['', Validators.required],
      trattamentiChimici: [''],
      tensileStrength: [null],
      tensileStrengthMax: [null],
      compressionalStrength : [null],
      compressionalStrengthMax : [null],
      flexuralStrength: [null],
      flexuralStrengthMax: [null],
      torsionalStrength: [null],
      torsionalStrengthMax: [null],
      impactStrength: [null],
      impactStrengthMax: [null],
      elongazioneRottura: [null],
      elongazioneRotturaMax: [null],
      biodegradabilita: [''],
      fineVita: [''],
      sds: [''],
      compatibilitaPolimeri: this.formBuilder.array([]),
      compatibilitaAdditivi: this.formBuilder.array([])
    });
  }

  toggleMaxField(fieldName: string) {
    this.showMaxFields[fieldName] = !this.showMaxFields[fieldName];
  }

  filtrareRinforzi() {
    this.showAllRinforzi = false;

    const criteriFiltraggio = this.criteriFiltraggio.filter((criterio) => {
      return criterio.campo && criterio.operatore && criterio.valore;
    });

    this.http.post('http://localhost:4200/api/rinforzo/filtraRinforzi', { criteri: criteriFiltraggio })
      .subscribe((response) => {
        this.data = response;
        if (this.data.status == 201) {
          this.rinforziFiltrati = this.data.data;
          this.rinforziFiltrati.sort((a, b) => a.nome.localeCompare(b.nome));
          this.showAllRinforzi = false;
          this.showRinforziFiltrati = true;
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
    this.showFilterRinforzoForm = false;
    this.rinforziFiltrati = [];
    // Puoi anche reimpostare i valori dei campi di filtro se necessario
    this.campoFiltro = '';
    this.condizioneFiltro = '';
    this.valoreFiltro = 0;
    this.showAllRinforzi = true;
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
  aggiungiPolimero() {
    this.compatibilitaPolimeriControls.push(this.formBuilder.control('')); // Aggiungi un nuovo FormControl al FormArray
  }
  rimuoviPolimero(index: number) {
    this.compatibilitaPolimeriControls.removeAt(index); // Rimuovi l'elemento dal FormArray
  }
  get compatibilitaPolimeriControls() {
    return this.form.get('compatibilitaPolimeri') as FormArray;
  }

  visualizzaSchedaPolimero(polimero: string) {
    // Esegui la richiesta HTTP per ottenere la scheda tecnica dell'additivo
    this.http.get(`http://localhost:4200/api/polimero/find/${polimero}`).subscribe(
      (response: any) => {
        if (response.status === 201) {
          // Gestisci la risposta qui, ad esempio assegnando i dati alla variabile selezionata
          this.selectedPolimero = response.data;
          this.showPolimeroDetails = true;
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
  closePolimeroDetails() {
    this.selectedPolimero = null;
  }

  resetForm() {
    this.form.reset();
  }

  //This is the method for reset the Data from backend.
  resetData() {
    this.data = null;
  }

  createRinforzi() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const nome = this.form.value.nome;
    const tipo = this.form.value.tipo;
    const geometria = this.form.value.geometria;
    const origine = this.form.value.origine;
    const trattamentiChimici = this.form.value.trattamentiChimici;
    const tensileStrength = this.form.value.tensileStrength;
    const tensileStrengthMax = this.form.value.tensileStrengthMax;
    const compressionalStrength = this.form.value.compressionalStrength;
    const compressionalStrengthMax = this.form.value.compressionalStrengthMax
    const flexuralStrength = this.form.value.flexuralStrength;
    const flexuralStrengthMax = this.form.value.flexuralStrengthMax
    const torsionalStrength = this.form.value.torsionalStrength;
    const torsionalStrengthMax = this.form.value.torsionalStrengthMax;
    const impactStrength = this.form.value.impactStrength;
    const impactStrengthMax = this.form.value.impactStrengthMax;
    const elongazioneRottura = this.form.value.elongazioneRottura;
    const elongazioneRotturaMax = this.form.value.elongazioneRotturaMax;
    const biodegradabilita = this.form.value.biodegradabilita;
    const fineVita = this.form.value.fineVita;
    const sds = this.form.value.sds;
    const compatibilitaPolimeri = this.form.value.compatibilitaPolimeri;
    const compatibilitaAdditivi = this.form.value.compatibilitaAdditivi;

    this.http.post('http://localhost:4200/api/rinforzo/createRinforzo', {
      nome: nome,
      tipo: tipo,
      geometria : geometria,
      origine: origine,
      trattamentiChimici: trattamentiChimici,
      tensileStrength: tensileStrength,
      tensileStrengthMax: tensileStrengthMax,
      compressionalStrength: compressionalStrength,
      compressionalStrengthMax: compressionalStrengthMax,
      flexuralStrength: flexuralStrength,
      flexuralStrengthMax: flexuralStrengthMax,
      torsionalStrength: torsionalStrength,
      torsionalStrengthMax: torsionalStrengthMax,
      impactStrength: impactStrength,
      impactStrengthMax: impactStrengthMax,
      elongazioneRottura: elongazioneRottura,
      elongazioneRotturaMax: elongazioneRotturaMax,
      biodegradabilita: biodegradabilita,
      fineVita: fineVita,
      sds: sds,
      compatibilitaPolimeri: compatibilitaPolimeri,
      compatibilitaAdditivi: compatibilitaAdditivi
    }, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          alert("Rinforzo created successfully");
          this.closeCreationRinforzi();
          this.getAllRinforzi();
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

  closeRinforzoDetails() {
    if(this.isFiltering){
      this.selectedRinforzo = null;
      this.showRinforziFiltrati = true;
      this.showAllRinforzi = false;
      this.isEditing = false;
    }else {
      this.selectedRinforzo = null;
      this.showAllRinforzi = true; // Riporta la lista degli additivi
      this.isEditing = false;
      this.showRinforziFiltrati = false;
    }
  }


  closeCreationRinforzi() {
    this.resetData();
    this.resetForm();
    this.addNewRinforzo = false;
    this.showAllRinforzi = true;
  }

  undoCreation() {
    this.resetForm();
    this.addNewRinforzo = false;
    this.showAllRinforzi = true;
  }

  getAllRinforzi() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.http.get<any>(`http://localhost:4200/api/rinforzo/findAll`, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          this.allRinforzi = this.data.data;
          // Ordina la lista in modo alfabetico
          this.allRinforzi.sort((a, b) => a.nome.localeCompare(b.nome));
        }
      }, err => {
        this.data = err;
        if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
        }
      });
  }

  searchRinforzo() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };

    this.http.get(`http://localhost:4200/api/rinforzo/find/${this.searchNome}`, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          this.selectedRinforzo = this.data.data;
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

  showRinforzoDetails(rinforzo: Rinforzo) {
    if (this.selectedRinforzo && this.selectedRinforzo.nome === rinforzo.nome) {
      this.showAllRinforzi = false;
    } else {
      const token = localStorage.getItem('accessToken');
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + token
        })
      };

      this.http.get(`http://localhost:4200/api/rinforzo/find/${rinforzo.nome}`, httpOptions).subscribe(
        response => {
          this.data = response;
          if (this.data.status == 201) {
            this.selectedRinforzo = this.data.data;
            this.showAllRinforzi = false;
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
    if (this.selectedRinforzo) {
      // Ripristina i campi del modulo ai valori originali dell'additivo selezionato
      this.form.patchValue({
        nome: this.selectedRinforzo.nome,
        tipo: this.selectedRinforzo.tipo,
        geometria: this.selectedRinforzo.geometria,
        origine: this.selectedRinforzo.origine,
        tensileStrength: this.selectedRinforzo.tensileStrength,
        tensileStrengthMax: this.selectedRinforzo.tensileStrengthMax,
        compressionalStrength: this.selectedRinforzo.compressionalStrength,
        compressionalStrengthMax: this.selectedRinforzo.compressionalStrengthMax,
        flexuralStrength: this.selectedRinforzo.flexuralStrength,
        flexuralStrengthMax: this.selectedRinforzo.flexuralStrengthMax,
        torsionalStrength: this.selectedRinforzo.torsionalStrength,
        torsionalStrengthMax: this.selectedRinforzo.torsionalStrengthMax,
        impactStrength: this.selectedRinforzo.impactStrength,
        impactStrengthMax: this.selectedRinforzo.impactStrengthMax,
        elongazioneRottura: this.selectedRinforzo.elongazioneRottura,
        elongazioneRotturaMax: this.selectedRinforzo.elongazioneRotturaMax,
        biodegradabilita: this.selectedRinforzo.biodegradabilita,
        fineVita: this.selectedRinforzo.fineVita,
        sds: this.selectedRinforzo.sds,
      });
      const compatibilitaAdditiviArray = this.form.get('compatibilitaAdditivi') as FormArray;
      while (compatibilitaAdditiviArray.length > 0) {
        compatibilitaAdditiviArray.removeAt(0);
      }

      // Aggiungi i controlli per ciascun elemento nell'array compatibilitaAdditivi
      for (const additivo of this.selectedRinforzo.compatibilitaAdditivi) {
        compatibilitaAdditiviArray.push(new FormControl(additivo));
      }

      // Rimuovi i controlli esistenti da compatibilitaRinforzi per evitare duplicati
      const compatibilitaPolimeriArray = this.form.get('compatibilitaPolimeri') as FormArray;
      while (compatibilitaPolimeriArray.length > 0) {
        compatibilitaPolimeriArray.removeAt(0);
      }

      // Aggiungi i controlli per ciascun elemento nell'array compatibilitaRinforzi
      for (const polimero of this.selectedRinforzo.compatibilitaPolimeri) {
        compatibilitaPolimeriArray.push(new FormControl(polimero));
      }
    }
  }
  cancelEditing() {
    this.isEditing = false
    // Ripristina i dati originali del Polimero
    if (this.selectedRinforzo) {
      // Ripristina i campi del modulo ai valori originali del Polimero selezionato
      this.form.patchValue({
        nome: this.selectedRinforzo.nome,
        tipo: this.selectedRinforzo.tipo,
        geometria: this.selectedRinforzo.geometria,
        origine: this.selectedRinforzo.origine,
        tensileStrength: this.selectedRinforzo.tensileStrength,
        tensileStrengthMax: this.selectedRinforzo.tensileStrengthMax,
        compressionalStrength: this.selectedRinforzo.compressionalStrength,
        compressionalStrengthMax: this.selectedRinforzo.compressionalStrengthMax,
        flexuralStrength: this.selectedRinforzo.flexuralStrength,
        flexuralStrengthMax: this.selectedRinforzo.flexuralStrengthMax,
        torsionalStrength: this.selectedRinforzo.torsionalStrength,
        torsionalStrengthMax: this.selectedRinforzo.torsionalStrengthMax,
        impactStrength: this.selectedRinforzo.impactStrength,
        impactStrengthMax: this.selectedRinforzo.impactStrengthMax,
        elongazioneRottura: this.selectedRinforzo.elongazioneRottura,
        elongazioneRotturaMax: this.selectedRinforzo.elongazioneRotturaMax,
        biodegradabilita: this.selectedRinforzo.biodegradabilita,
        fineVita: this.selectedRinforzo.fineVita,
        sds: this.selectedRinforzo.sds,
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
    if (this.selectedRinforzo) {
      const nome = this.form.value.nome;
      const tipo = this.form.value.tipo;
      const geometria = this.form.value.geometria;
      const origine = this.form.value.origine;
      const trattamentiChimici = this.form.value.trattamentiChimici;
      const tensileStrength = this.form.value.tensileStrength;
      const tensileStrengthMax = this.form.value.tensileStrengthMax;
      const compressionalStrength = this.form.value.compressionalStrength;
      const compressionalStrengthMax = this.form.value.compressionalStrengthMax
      const flexuralStrength = this.form.value.flexuralStrength;
      const flexuralStrengthMax = this.form.value.flexuralStrengthMax
      const torsionalStrength = this.form.value.torsionalStrength;
      const torsionalStrengthMax = this.form.value.torsionalStrengthMax;
      const impactStrength = this.form.value.impactStrength;
      const impactStrengthMax = this.form.value.impactStrengthMax;
      const elongazioneRottura = this.form.value.elongazioneRottura;
      const elongazioneRotturaMax = this.form.value.elongazioneRotturaMax;
      const biodegradabilita = this.form.value.biodegradabilita;
      const fineVita = this.form.value.fineVita;
      const sds = this.form.value.sds;
      const compatibilitaPolimeri = this.form.value.compatibilitaPolimeri;
      const compatibilitaAdditivi = this.form.value.compatibilitaAdditivi;

      this.http.put(`http://localhost:4200/api/rinforzo/update/${nome}`,{
        nome: nome,
        tipo: tipo,
        geometria : geometria,
        origine: origine,
        trattamentiChimici: trattamentiChimici,
        tensileStrength: tensileStrength,
        tensileStrengthMax: tensileStrengthMax,
        compressionalStrength: compressionalStrength,
        compressionalStrengthMax: compressionalStrengthMax,
        flexuralStrength: flexuralStrength,
        flexuralStrengthMax: flexuralStrengthMax,
        torsionalStrength: torsionalStrength,
        torsionalStrengthMax: torsionalStrengthMax,
        impactStrength: impactStrength,
        impactStrengthMax: impactStrengthMax,
        elongazioneRottura: elongazioneRottura,
        elongazioneRotturaMax: elongazioneRotturaMax,
        biodegradabilita: biodegradabilita,
        fineVita: fineVita,
        sds: sds,
        compatibilitaPolimeri: compatibilitaPolimeri,
        compatibilitaAdditivi: compatibilitaAdditivi
      }, httpOptions).subscribe(
        response => {
          this.data = response;
          if (this.data.status === 201) {
            alert("Rinforzo updated successfully");
            this.closeRinforzoDetails();
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

  deleteRinforzo(){
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const nome = this.deleteForm.value.nome;

    this.http.delete(`http://localhost:4200/api/rinforzo/delete/${nome}`, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          alert("Rinforzo deleted successfully");
          this.getAllRinforzi();
        }
      },
      err => {
        this.data = err;
        if (this.data.status == 404) {
          alert("Rinforzo not found");
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
        } else {
          alert("An error occurred");
        }
      }
    );
  }

  toggleDeleteRinforzoForm() {
    this.showDeleteRinforzoForm = !this.showDeleteRinforzoForm;
    this.deleteSuccessMessage = ''; // Pulisci il messaggio di conferma
    this.addNewRinforzo = false;
    this.showFilterRinforzoForm = false;
  }

  toggleCreateRinforzoForm(){
    this.addNewRinforzo = !this.addNewRinforzo;
    this.showDeleteRinforzoForm = false;
    this.showFilterRinforzoForm = false;
    this.showAllRinforzi = false;
  }

  cancelDelete() {
    this.toggleDeleteRinforzoForm(); // Chiudi il modulo di eliminazione
    this.deleteForm.reset(); // Resetta il form
  }

  toggleFilterRinforzoForm(){
    this.showAllRinforzi = false;
    this.showFilterRinforzoForm = !this.showFilterRinforzoForm;
    this.showDeleteRinforzoForm = false;
    this.addNewRinforzo = false;
  }

  selezionaUnitaMisuraRinforzo(campoNumerico: string, unitaMisura: string) {
    let nomeRinforzo = this.form.get('nome')?.value;
    this.unitaMisuraService.setUnitaMisuraRinforzo(nomeRinforzo,campoNumerico, unitaMisura);
  }

  visualizzaUnitaMisuraRinforzo(nomeRinforzo: string, campoNumerico: string): string {
    return this.unitaMisuraService.getUnitaMisuraRinforzo(nomeRinforzo,campoNumerico);
  }

  visualizzaUnitaMisuraPolimero(nomeRinforzo: string, campoNumerico: string): string {
    return this.unitaMisuraService.getUnitaMisuraPolimero(nomeRinforzo,campoNumerico);
  }

}
