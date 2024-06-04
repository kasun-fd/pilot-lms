import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-tassignment',
  standalone: true,
  imports: [],
  templateUrl: './tassignment.component.html',
  styleUrl: './tassignment.component.scss'
})
export class TassignmentComponent implements OnInit{

  currentTime: string = '';

  private intervalId: any;

  constructor(private router:Router,
              private cookieService:CookieService,
              private title:Title) {
  }

    ngOnInit(): void {

    this.title.setTitle('Teacher Assignments | Pilot LMS');

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
