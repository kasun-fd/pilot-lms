import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-tlessons',
  standalone: true,
  imports: [],
  templateUrl: './tlessons.component.html',
  styleUrl: './tlessons.component.scss'
})
export class TlessonsComponent implements OnInit{

  currentTime: string = '';

  private intervalId: any;


  constructor(private router:Router,
              private cookieService:CookieService,
              private title:Title) {
  }

  ngOnInit(): void {
    this.title.setTitle('Teacher Lessons | Pilot LMS');

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
