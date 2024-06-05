import {Component, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {Title} from "@angular/platform-browser";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {CookieService} from "ngx-cookie-service";
import {doc} from "@angular/fire/firestore";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {map} from "rxjs";

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [
    MatLabel,
    MatOption,
    MatSelect,
    MatFormField,
    MatInput,
    MatButton,
    MatProgressBar,
    NgForOf,
    NgIf,
    RouterLink,
    MatIcon,
    MatMiniFabButton,
    MatTooltip,
    MatIconButton,
    MatMenuItem,
    MatMenuTrigger,
    MatMenu
  ],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss'
})
export class MyCoursesComponent implements OnInit {

  currentTime: string = '';

  private intervalId: any;

  loading = false;

  myAllCourses: any[] = [];

  noContent = false;

  content = false;

  constructor(private title: Title,
              private db: AngularFirestore,
              private cookieService: CookieService,
              private router:Router) {
  }

  ngOnInit(): void {

    this.content = false;

    this.noContent = false;

    this.loading = true;

    this.title.setTitle('My Courses | Pilot LMS');

    // Start the always working function
    this.intervalId = setInterval(() => {
      this.alwaysWorkingFunction();
    }, 1000);

    this.db.collection('courses', ref => ref.where(
      'teacherid', '==', atob(this.cookieService.get('teacherId')))).get()
      .subscribe(
      querySnapshot => {
        const documents:any[] = querySnapshot.docs.map
        (doc => {
          this.myAllCourses.push({id:doc.id,data:doc.data()});
        });
        if (documents.length !== 0){
            this.content = true;
            this.loading = false;
          } else {
            this.content = false;
            this.noContent = true;
            this.loading = false;
          }
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

  updateCourse(id:any){
    console.log(id)
  }

  deleteCourse(id:any){
    console.log(id)
  }

}
