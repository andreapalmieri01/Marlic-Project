 import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  userType: any;

  //Variable for associate the response Http when Logout is successful.
  response: any;

  isUser: boolean = false;

  constructor(
    private authUser: UserService,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.userType = this.authUser.getUser();
    if (this.userType instanceof User) {
      this.isUser = true;
    }
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }


  //Logout method -- finire
  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (this.userType instanceof User) {
      this.httpClient.post(`http://localhost:4200/api/user/logout`, {refreshToken: refreshToken}).subscribe(
        response => {
          this.response = response;
          if (this.response.status == 200) {
            alert("Logout Successfully");
            window.location.reload(); // Ricarica la pagina
            this.router.navigate(['']);
          } else {
            alert("Logout Failed");
          }
        }, err => {
          alert("Logout Failed");
        }
      );
    }
  }
}
