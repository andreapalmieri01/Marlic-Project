import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  @Output() selectedComponent: string | undefined;

  userType: any;

  isUser = false;

  constructor(private router: Router, private authUser: UserService) { }

  ngOnInit() {
    this.userType = this.authUser.getUser();

    if (this.userType instanceof User) {
      // L'utente è autenticato e ha un oggetto User
      this.isUser = true;
    } else {
      // L'utente non è autenticato o il tipo non è User
      this.isUser = false;
    }
  }


  changeRoute(route: string) {
    if (this.userType instanceof User) {
      if (route === '/polimeri') {
        this.router.navigate(['/dashboard/user/polimeri']);
      }
      else if (route === '/additivi') {
        this.router.navigate(['/dashboard/user/additivi']);
      }
      else if (route === '/rinforzi') {
        this.router.navigate(['/dashboard/user/rinforzi']);
      }
      else if(route === '/account') {
        this.router.navigate(['/dashboard/user/account']);
      }
    }else{
      if (route === '/polimeri') {
        this.router.navigate(['/polimeri']);
      }
      else if (route === '/additivi') {
        this.router.navigate(['/additivi']);
      }
      else if (route === '/rinforzi') {
        this.router.navigate(['/rinforzi']);
      }
    }

  }
}
