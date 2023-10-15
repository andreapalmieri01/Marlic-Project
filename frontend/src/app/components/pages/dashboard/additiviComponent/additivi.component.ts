import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../authentication/services/auth.service';
import { Additivo } from 'src/app/Models/additivo';
import {User} from "../../../../Models/user";
import {UserService} from "../../../../service/user.service";
import {Polimero} from "../../../../Models/polimero";
import {Rinforzo} from "../../../../Models/rinforzo";
import {UnitàMisuraService} from "../../../../service/unitaMisura.service";

@Component({
  selector: 'app-additivi',
  templateUrl: './additivi.component.html',
  styleUrls: ['./additivi.component.scss']
})
export class AdditiviComponent implements OnInit {
  form !: FormGroup; // Form per l'aggiunta del polimero
  data: any;
  userType: User | undefined;
  isUser: boolean | undefined;

  addNewAdditivo = false;
  allAdditivi : Additivo[] = [];
  showAllAdditivi = true;
  searchNome: string = ""; // Nuova variabile per la ricerca
  selectedAdditivo: Additivo | null = null; // Variabile per mantenere l'additivo selezionato
  selectedPolimero: Polimero | null = null;
  selectedRinforzo: Rinforzo | null = null;
  showRinforzoDetails= false;
  showPolimeroDetails = false;
  isEditing = false;
  isFiltering: boolean = false;

  deleteForm!: FormGroup;
  showDeleteAdditivoForm = false;
  deleteSuccessMessage = '';

  showFilterAdditivoForm = false;
  valoreFiltro: string = '';  // Variabile per il valore di filtro
  condizioneFiltro: string = ''; // Variabile per la condizione di filtro
  campoFiltro: string = ''; // Variabile per il campo di filtro
  additiviFiltrati: Additivo[] = []; // Array per i polimeri filtrati
  showAdditiviFiltrati: boolean = false;
  criteriFiltraggio: any[] = [{ campo: '', operatore: '', valore: '' }];

  // Inizializza campiNumerici con i nomi dei campi numerici del tuo oggetto Polimero
  campiString: string[] = [
    'funzione',
    'origine',
    'biodegradabilita',
    'fineVita',
    'sds'
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private unitaMisuraService: UnitàMisuraService,
  ) {}
  ngOnInit(): void {
    this.userType = this.userService.getUser();
    if (this.userType instanceof User){
      console.log("User is authenticated.");
      this.isUser = true;
      this.initForms();
      this.getAllAdditivi();
      this.deleteForm = this.formBuilder.group({
        nome: ['', Validators.required],
      });
    }else{
      console.log("User is not authenticated.");
      this.getAllAdditivi();
    }
  }

  initForms() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      funzione: ['', Validators.required],
      origine: ['', Validators.required],
      biodegradabilita: [''],
      fineVita: [''],
      sds: [''],
      compatibilitaPolimeri: this.formBuilder.array([]),
      compatibilitaRinforzi: this.formBuilder.array([])
    });
  }


  filtrareAdditivi() {
    this.showAllAdditivi = false;
    // Costruisci l'array dei criteri di filtraggio
    const criteriFiltraggio = this.criteriFiltraggio.filter((criterio) => {
      return criterio.campo && criterio.operatore && criterio.valore;
    });

    // Invia la richiesta al server per il filtraggio
    this.http.post('http://localhost:4200/api/additivo/filtraAdditivi', { criteri: criteriFiltraggio })
      .subscribe((response) => {
        this.data = response;
        if (this.data.status == 201) {
          this.additiviFiltrati = this.data.data;
          this.additiviFiltrati.sort((a, b) => a.nome.localeCompare(b.nome));
          this.showAllAdditivi = false;
          this.showAdditiviFiltrati = true;
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
    // Ripristina la visualizzazione dei additivi non filtrati
    this.showFilterAdditivoForm = false;
    this.additiviFiltrati = [];

    // Reimposta i dati del form dei criteri
    this.campoFiltro = '';
    this.condizioneFiltro = '';
    this.valoreFiltro = '';

    // Reimposta i dati dei criteri
    this.showAllAdditivi = true;
    this.isFiltering = false;
  }
  aggiungiCriterio() {
    const nuovoCriterio = { campo: '', operatore: '', valore: '' };
    this.criteriFiltraggio.push(nuovoCriterio);
  }

  rimuoviCriterio(index: number) {
    this.criteriFiltraggio.splice(index, 1);
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

  createAdditivi(){
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const nomeAdditivo = this.form.value.nome;
    const funzioneAdditivo = this.form.value.funzione;
    const origineAdditivo = this.form.value.origine;
    const biodegradabilitaAdditivo = this.form.value.biodegradabilita;
    const fineVitaAdditivo = this.form.value.fineVita;
    const sdsAdditivo = this.form.value.sds;
    const compatibilitaRinforzi = this.form.value.compatibilitaRinforzi;
    const compatibilitaPolimeri = this.form.value.compatibilitaPolimeri;

    this.http.post('http://localhost:4200/api/additivo/createAdditivo',{nome : nomeAdditivo, funzione : funzioneAdditivo, origine : origineAdditivo , biodegradabilita : biodegradabilitaAdditivo, fineVita : fineVitaAdditivo, sds : sdsAdditivo, compatibilitaRinforzi : compatibilitaRinforzi, compatibilitaPolimeri : compatibilitaPolimeri}, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          alert("Additivo created successfully");
          this.closeCreationAdditivi();
          this.getAllAdditivi();
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

  searchAdditivo() {
      this.http.get(`http://localhost:4200/api/additivo/find/${this.searchNome}`).subscribe(
        response => {
          this.data = response;
          if (this.data.status == 201) {
            this.selectedAdditivo = this.data.data;
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
  // Questa funzione mostra i dettagli dell'additivo selezionato
  showAdditivoDetails(additivo: Additivo) {
    if (this.selectedAdditivo && this.selectedAdditivo.nome === additivo.nome) {
      // L'additivo è già stato selezionato, quindi non è necessario effettuare una nuova chiamata
      this.showAllAdditivi = false; // Nascondi la lista degli additivi quando mostri i dettagli
    }
      this.http.get(`http://localhost:4200/api/additivo/find/${additivo.nome}`).subscribe(
        response => {
          this.data = response;
          if (this.data.status == 201) {
            this.selectedAdditivo = this.data.data;
            this.showAllAdditivi = false; // Nascondi la lista degli additivi quando mostri i dettagli
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

  getAllAdditivi() {
      this.http.get<any>(`http://localhost:4200/api/additivo/findAll`).subscribe(
        response => {
          this.data = response;
          if (this.data.status == 201) {
            this.allAdditivi = this.data.data;
            // Ordina la lista in modo alfabetico
            this.allAdditivi.sort((a, b) => a.nome.localeCompare(b.nome));
          }
        }, err => {
          this.data = err;
          if (this.data.status == 500) {
            alert("Something went wrong. Please try again");
          }
        });
  }

  closeAdditivoDetails() {
    if(this.isFiltering){
      this.selectedAdditivo = null;
      this.showAdditiviFiltrati = true;
      this.showAllAdditivi = false;
      this.isEditing = false;
    }else {
      this.selectedAdditivo = null;
      this.showAllAdditivi = true; // Riporta la lista degli additivi
      this.isEditing = false;
      this.showAdditiviFiltrati = false;
    }
  }


  closeCreationAdditivi() {
    this.resetData();
    this.resetForm();
    this.addNewAdditivo = false;
    this.showAllAdditivi = true;
  }

  undoCreation() {
    this.resetForm();
    this.addNewAdditivo = false;
    this.showAllAdditivi = true;
  }

  startEditing() {
    this.isEditing = true;
    if (this.selectedAdditivo) {
      // Ripristina i campi del modulo ai valori originali dell'additivo selezionato
      this.form.patchValue({
        nome: this.selectedAdditivo.nome,
        funzione: this.selectedAdditivo.funzione,
        origine: this.selectedAdditivo.origine,
        biodegradabilita: this.selectedAdditivo.biodegradabilita,
        fineVita: this.selectedAdditivo.fineVita,
        sds: this.selectedAdditivo.sds,
      });
      const compatibilitaPolimeriArray = this.form.get('compatibilitaPolimeri') as FormArray;
      while (compatibilitaPolimeriArray.length > 0) {
        compatibilitaPolimeriArray.removeAt(0);
      }

      // Aggiungi i controlli per ciascun elemento nell'array compatibilitaPolimeri
      for (const polimero of this.selectedAdditivo.compatibilitaPolimeri) {
        compatibilitaPolimeriArray.push(new FormControl(polimero));
      }

      // Rimuovi i controlli esistenti da compatibilitaRinforzi per evitare duplicati
      const compatibilitaRinforziArray = this.form.get('compatibilitaRinforzi') as FormArray;
      while (compatibilitaRinforziArray.length > 0) {
        compatibilitaRinforziArray.removeAt(0);
      }

      // Aggiungi i controlli per ciascun elemento nell'array compatibilitaRinforzi
      for (const rinforzo of this.selectedAdditivo.compatibilitaRinforzi) {
        compatibilitaRinforziArray.push(new FormControl(rinforzo));
      }
    }
  }
  cancelEditing() {
    this.isEditing = false
      // Ripristina i dati originali dell'additivo
      if (this.selectedAdditivo) {
        // Ripristina i campi del modulo ai valori originali dell'additivo selezionato
        this.form.patchValue({
          nome: this.selectedAdditivo.nome,
          funzione: this.selectedAdditivo.funzione,
          origine: this.selectedAdditivo.origine,
          biodegradabilita: this.selectedAdditivo.biodegradabilita,
          fineVita: this.selectedAdditivo.fineVita,
          sds: this.selectedAdditivo.sds,
          compatibilitaRinforzi: this.selectedAdditivo.compatibilitaRinforzi,
          compatibilitaPolimeri : this.selectedAdditivo.compatibilitaPolimeri
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
    if (this.selectedAdditivo) {
      const nome = this.form.value.nome;
      const funzione = this.form.value.funzione;
      const origine = this.form.value.origine;
      const biodegradabilita = this.form.value.biodegradabilita;
      const fineVita = this.form.value.fineVita;
      const sds = this.form.value.sds;
      const compatibilitaRinforzi = this.form.value.compatibilitaRinforzi;
      const compatibilitaPolimeri = this.form.value.compatibilitaPolimeri;

      // Effettua la richiesta HTTP per aggiornare l'additivo
      this.http.put(`http://localhost:4200/api/additivo/update/${nome}`, {
        nome: nome,
        funzione: funzione,
        origine: origine,
        biodegradabilita: biodegradabilita,
        fineVita: fineVita,
        sds: sds,
        compatibilitaRinforzi: compatibilitaRinforzi,
        compatibilitaPolimeri : compatibilitaPolimeri
      }, httpOptions).subscribe(
        response => {
          this.data = response;
          if (this.data.status === 201) {
            alert("Additivo updated successfully");
            this.closeAdditivoDetails();
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

  deleteAdditivo(){
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const nome = this.deleteForm.value.nome;

    this.http.delete(`http://localhost:4200/api/additivo/delete/${nome}`, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          alert("Additivo deleted successfully");
          this.getAllAdditivi();
        }
      },
      err => {
        this.data = err;
        if (this.data.status == 404) {
          alert("Additivo not found");
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
        } else {
          alert("An error occurred");
        }
      }
    );
  }

  toggleDeleteAdditivoForm() {
    this.showDeleteAdditivoForm = !this.showDeleteAdditivoForm;
    this.deleteSuccessMessage = ''; // Pulisci il messaggio di conferma
    this.addNewAdditivo = false;
    this.showFilterAdditivoForm = false;
  }

  toggleCreateAdditivoForm(){
    this.addNewAdditivo = !this.addNewAdditivo;
    this.showDeleteAdditivoForm = false;
    this.showFilterAdditivoForm = false;
    this.showAllAdditivi = false;
  }

  toggleFilterAdditivoForm(){
    this.showAllAdditivi = false;
    this.showFilterAdditivoForm = !this.showFilterAdditivoForm;
    this.addNewAdditivo = false;
    this.showDeleteAdditivoForm = false;
  }

  cancelDelete() {
    this.toggleDeleteAdditivoForm(); // Chiudi il modulo di eliminazione
    this.deleteForm.reset(); // Resetta il form
  }
  visualizzaUnitaMisuraPolimero(nomePolimero: string, campoNumerico: string): string {
    return this.unitaMisuraService.getUnitaMisuraPolimero(nomePolimero , campoNumerico);
  }

  visualizzaUnitaMisuraRinforzo(nomeRinforzo: string, campoNumerico: string): string {
    return this.unitaMisuraService.getUnitaMisuraRinforzo(nomeRinforzo, campoNumerico);
  }
}

