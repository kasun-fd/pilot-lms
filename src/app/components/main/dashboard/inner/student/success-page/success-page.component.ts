import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {routes} from "../../../../../../app.routes";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [
    MatButton,
    RouterLink
  ],
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.scss'
})
export class SuccessPageComponent implements OnInit{

  currentTime: string = '';

  private intervalId: any;

  constructor(private router:Router,
              private cookieService:CookieService,
              private title:Title) {
  }

    ngOnInit(): void {

        this.title.setTitle('Uploaded | Pilot LMS');

      // Start the always working function
      this.intervalId = setInterval(() => {
        this.alwaysWorkingFunction();
      }, 1000);


    }

  alwaysWorkingFunction() {
    // Function that will be executed continuously
    this.currentTime = new Date().toLocaleTimeString();
    if (!this.cookieService.check('success-task')){
      this.router.navigate(["/dashboard/assignments"]);
    }
  }

}
