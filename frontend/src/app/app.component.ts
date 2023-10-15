  import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { environment } from 'src/environments/environments';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //Web title:
  title = 'frontend';

  //Variables that indicates if the page is standard or dashboard
  showMenuBar = true;

  /**
   * Constructor for AppComponent.
   * @param router the Router module.
   */
  constructor(
    private router: Router
  ) { }


  /**
   * NgOnInit implementation, that check if the User stay
   * on home or standard pages, or dashboard.
   */
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '' || event.url === '/' || event.url === '/additivi' || event.url === '/polimeri' || event.url === '/rinforzi') {
          this.showMenuBar = true;
        } else {
          this.showMenuBar = false;
        }
      }
    })
  }

}
