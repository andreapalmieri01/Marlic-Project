import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from "../../../../Models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  response: any;

  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    localStorage.clear();
  }
/*
  onSubmit() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    const requestData = { username, password };

    this.httpClient.post('http://localhost:4200/api/user/login', requestData)
      .subscribe(
        (response: any) => {
          const { status, user, accessToken, refreshToken, message } = response;
          this.response = response;
          if (status === 200) {
            // Salva le informazioni dell'utente loggato come desiderato
            const userLogged = new User(user.id, user.username);
            this.userService.setUser(userLogged);
            // Login successful
            this.authService.saveToken(accessToken, refreshToken);
            // Redirect alla dashboard o a un'altra pagina
            this.router.navigate(['dashboard/user']);
          } else {
            // Login fallito
            alert("Password or email not correct.");
          }
        },
        (error: any) => {
          // Gestisci l'errore di chiamata API
          console.error(error);
          this.errorMessage = 'Errore durante la chiamata al server.';
        }
      );
  }
 */


  onSubmit() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    this.httpClient.post(`http://localhost:4200/api/user/login`, { username: username, password: password }).subscribe(
      response => {
        this.response = response;
        if (this.response.status == 200) {
          const userLogged = new User( this.response.jsonResponse.id , this.response.jsonResponse.username);
          this.userService.setUser(userLogged);
          this.authService.saveToken(this.response.accessToken, this.response.refreshToken);
          alert("Login successful");
          this.router.navigate(['dashboard/user']);
        } else {
          alert("Password or username not correct.");
        }
      }, err => {
        alert('Password or username not correct.');
      }
    );
  }
  goBackToMainPage() {
    this.router.navigate(['']); // La rotta vuota ('') rappresenta la pagina principale
  }
}

