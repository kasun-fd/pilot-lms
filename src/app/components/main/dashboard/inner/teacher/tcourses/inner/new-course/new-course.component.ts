import {Component, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {MatProgressBar} from "@angular/material/progress-bar";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {CookieService} from "ngx-cookie-service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-new-course',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    MatIconButton,
    RouterLink,
    MatButton,
    MatProgressBar,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './new-course.component.html',
  styleUrl: './new-course.component.scss'
})
export class NewCourseComponent implements OnInit {

  currentTime: string = '';

  private intervalId: any;

  loading = false;

  formattedDate: any;

  generatedId = crypto.randomUUID();

  form = new FormGroup({
    Coursetitle: new FormControl('', [
      Validators.required
    ]),
    Coursedes: new FormControl('', [
      Validators.required
    ]),
    Lessontitle: new FormControl('', [
      Validators.required
    ]),
    Lessondes: new FormControl('', [
      Validators.required
    ])
  })

  constructor(private title: Title,
              private cookieService: CookieService,
              private router: Router,
              private db: AngularFirestore,
              private snackBar: MatSnackBar) {
    this.title.setTitle('New Course | Pilot LMS');
  }

  ngOnInit(): void {

    this.loading = true;

    // Start the always working function
    this.intervalId = setInterval(() => {
      this.alwaysWorkingFunction();
    }, 1000);

    this.loading = false;
  }

  alwaysWorkingFunction() {
    // Function that will be executed continuously
    this.currentTime = new Date().toLocaleTimeString();
    if (!this.cookieService.check('teacherId')) {
      this.cookieService.deleteAll('/');
      this.router.navigate(["/login"]);
    }
  }

  addCourse() {

    this.loading = true;

    this.db.collection('teacher', ref =>
      ref.where('uId', '==', atob(this.cookieService.get('teacherId')))).get().subscribe(querySapshot => {

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
      const day = String(now.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      this.formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      let newCourse = {
        courseid: this.generatedId,
        teacherid: atob(this.cookieService.get('teacherId')),
        // @ts-ignore
        teacherName: querySapshot.docs.map(doc => doc.data().name).toString(),
        title: this.form.value.Coursetitle,
        description: this.form.value.Coursedes,
        addedDate: this.formattedDate
      }

      this.db.collection('courses').add(newCourse).then((docRef) => {
        let firstLesson = {
          courseId:this.generatedId,
          index:crypto.randomUUID(),
          lessonId:1,
          title:this.form.value.Lessontitle,
          content:this.form.value.Lessondes
        }
        this.db.collection('lessons').add(firstLesson).then((docRefLessons)=>{
          this.loading = false;
          this.snackBar.open('Course Added!', 'Close', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'start',
            direction: 'ltr'
          })
          this.router.navigate(["/dashboard/newlesson/" +this.generatedId]);
        })
      }).catch(err => {
        console.log(err);
        this.loading = false;
      })
    })
  }

}
