import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/components/authentication/services/auth.service';
import { User } from 'src/app/Models/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  //GENERAL VARIABLES

  //This is the variable for the FormGroup.
  form !: FormGroup;

  data: any;

  addNewAdmin = false;

  allAdministrators : User[] = [];

  showAllAdministrators = true;

  showDeleteAdminForm = false;
  deleteForm!: FormGroup;
  deleteSuccessMessage = '';

  /**
   * Constructor for this Component.
   * @param httpClient the HttpClient object.
   * @param userService the UserService for get the User/Employee logged.
   * @param formBuilder the FormBuilder object for the Forms.
   */
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.deleteForm = this.formBuilder.group({
      username: ['', Validators.required],
    });
    this.getAllAdministrators();
  }

  initForms() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  createNewAdministrator(){
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const username = this.form.value.username;
    const password = this.form.value.password;

    this.http.post('http://localhost:4200/api/user/createAdmin' , { username : username , password : password } , httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          alert("Admin created successfully");
          this.closeCreationAdmin();
        }
      }, err => {
        this.data = err;
        if (this.data.status == 400) {
          alert("Campi vuoti. Operazione non valida. Riprova.");
          return;
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
          return;
        }else if (this.data.status == 404) {
          alert("Username già esistente");
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

  closeCreationAdmin(){
    this.resetData();
    this.resetForm();
    this.addNewAdmin = false;
  }
  undoCreation() {
    this.resetForm();
    this.addNewAdmin = false;
  }

  deleteAdministrator() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const username = this.deleteForm.value.username;

    this.http.delete(`http://localhost:4200/api/user/delete/${username}`, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          alert("User deleted successfully");
          // Puoi eseguire altre azioni dopo l'eliminazione dell'utente se necessario.
        }
      },
      err => {
        this.data = err;
        if (this.data.status == 404) {
          alert("User not found");
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
        } else {
          alert("An error occurred");
        }
      }
    );
  }

  toggleDeleteAdminForm() {
    this.addNewAdmin = false;
    this.showDeleteAdminForm = !this.showDeleteAdminForm;
    this.deleteSuccessMessage = ''; // Pulisci il messaggio di conferma
  }

  toggleCreateAdminForm(){
    this.showDeleteAdminForm = false;
    this.addNewAdmin = !this.addNewAdmin;
  }

  cancelDelete() {
    this.toggleDeleteAdminForm(); // Chiudi il modulo di eliminazione
    this.deleteForm.reset(); // Resetta il form
  }


  getAllAdministrators() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.http.get<any>(`http://localhost:4200/api/additivo/findAll`, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          this.allAdministrators = this.data.data;
          // Ordina la lista in modo alfabetico
          this.allAdministrators.sort((a, b) => a.username.localeCompare(b.username));
        }
      }, err => {
        this.data = err;
        if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
        }
      });
  }

}
