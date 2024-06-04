import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatFabButton} from "@angular/material/button";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIcon,
    MatFabButton
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  currentTime: string = '';

  private intervalId: any;

  constructor(private title:Title,
              private cookieService:CookieService,
              private router:Router) {
  }

    ngOnInit(): void {
        this.title.setTitle('Dashboard | Pilot LMS');

      // Start the always working function
      this.intervalId = setInterval(() => {
        this.alwaysWorkingFunction();
      }, 1000);

    }

  alwaysWorkingFunction() {
    // Function that will be executed continuously
    this.currentTime = new Date().toLocaleTimeString();
    if (!this.cookieService.check('login')){
      this.cookieService.deleteAll('/');
      this.router.navigate(["/login"]);
    }
  }

}
