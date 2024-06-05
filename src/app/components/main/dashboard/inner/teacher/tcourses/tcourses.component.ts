import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {Title} from "@angular/platform-browser";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatButton} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-tcourses',
  standalone: true,
  imports: [
    MatProgressBar,
    MatButton,
    NgForOf,
    RouterLink,
    NgIf
  ],
  templateUrl: './tcourses.component.html',
  styleUrl: './tcourses.component.scss'
})
export class TcoursesComponent implements OnInit{

  currentTime: string = '';

  private intervalId: any;

  loading = false;

  allCourses:any[] = [];

  constructor(private router:Router,
              private cookieService:CookieService,
              private title:Title,
              private db:AngularFirestore) {
  }

  ngOnInit(): void {

    this.loading = true;

    this.title.setTitle('All Courses | Pilot LMS');

    // Start the always working function
    this.intervalId = setInterval(() => {
      this.alwaysWorkingFunction();
    }, 1000);

    this.db.collection("courses").get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.allCourses.push({id: doc.id, data: doc.data()});
          this.loading = false;
        })
      })

  }

  alwaysWorkingFunction() {
    // Function that will be executed continuously
    this.currentTime = new Date().toLocaleTimeString();
    if (!this.cookieService.check('teacherId')){
      this.cookieService.deleteAll('/');
      this.router.navigate(["/login"]);
    }
  }

}
