import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgForOf, NgIf} from "@angular/common";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router, RouterLink} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {Title} from "@angular/platform-browser";
import {NbAccordionModule, NbLayoutModule, NbSidebarComponent, NbSidebarModule} from "@nebular/theme";
import {
  MatAccordion,
  MatExpansionPanel, MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {map} from "rxjs";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    MatProgressBar,
    NgForOf,
    NgIf,
    NbSidebarModule,
    NbLayoutModule,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatExpansionPanelDescription,
    MatButton,
    RouterLink

  ],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent implements OnInit, OnDestroy {
  loading = false;

  allLessons: any[] = [];

  currentTime: string = '';

  private intervalId: any;

  panelOpenState = false;

  have = false;
  haven = false;

  constructor(private db: AngularFirestore,
              private router: Router,
              private cookieService: CookieService,
              private title: Title
  ) {
  }

  ngOnInit(): void {

    this.loading = true;

    this.title.setTitle('Student Lessons | Pilot LMS');

    // Start the always working function
    this.intervalId = setInterval(() => {
      this.alwaysWorkingFunction();
    }, 1000);


    if (atob(this.cookieService.get('courseCode'))) {
      this.db.collection('lessons', ref => ref.where('courseId', '==', atob(this.cookieService.get('courseCode')))).get().subscribe(querySnapshot => {
          const documents = querySnapshot.docs.map(doc => doc.data());

          this.allLessons = documents;
          this.loading = false;
        }
      );
      this.have = true;
      this.haven = false;
    } else {
      this.haven = true;
      this.have = false;
      this.loading = false;
    }

  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }


  alwaysWorkingFunction() {
    // Function that will be executed continuously
    this.currentTime = new Date().toLocaleTimeString();
    if (!this.cookieService.check('login')) {
      this.cookieService.deleteAll('/');
      this.router.navigate(["/login"]);
    }
  }

  goToAssignments(lessonId: any,title:any) {
    this.cookieService.delete('lessonId');
    this.cookieService.delete('lessonTitle');
    this.cookieService.set('lessonId', btoa(lessonId), 365 * 10, '/');
    this.cookieService.set('lessonTitle', btoa(title), 365 * 10, '/');
    this.router.navigate(["/dashboard/assignments"]);
  }

}
