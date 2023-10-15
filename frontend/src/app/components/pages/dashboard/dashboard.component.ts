import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/service/user.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() selectedComponent: string | undefined;

  sideBarOpen = true;
  userType : any;
  isUser: boolean | undefined;
  hasChild = false;



  constructor(private router: Router, private authUser : UserService) { }

  ngOnInit () {
    this.userType = this.authUser.getUser();
    if(this.userType instanceof User){
      this.isUser = true;
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.hasChild = false;
        } else {
          this.hasChild = true;
        }
      }
    });
  }


  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

}
