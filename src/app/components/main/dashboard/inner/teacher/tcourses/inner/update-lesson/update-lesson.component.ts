import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-update-lesson',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatProgressBar,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './update-lesson.component.html',
  styleUrl: './update-lesson.component.scss'
})
export class UpdateLessonComponent implements OnInit {
  loading = false;
  selectedId: any;
  selectedCourseId:any;
  lessonText: any;
  description:any;

  currentTime: string = '';

  private intervalId: any;

  form = new FormGroup({
    title: new FormControl('', []),
    des: new FormControl('', [])
  })

  constructor(private activeRouter: ActivatedRoute,
              private title: Title,
              private db: AngularFirestore,
              private snackBar:MatSnackBar,
              private router:Router,
              private cookieService:CookieService) {

    this.title.setTitle('Update Lesson | Pilot LMS');

    this.activeRouter.paramMap.subscribe(resp => {
      this.selectedId = resp.get('id');
      this.selectedCourseId = resp.get('courseId');
    })

  }

  ngOnInit(): void {
    this.loading = true;

    // Start the always working function
    this.intervalId = setInterval(() => {
      this.alwaysWorkingFunction();
    }, 1000);

    this.db.collection('lessons').doc(this.selectedId).get().subscribe(doc => {
      // @ts-ignore
      this.lessonText = doc.data().title;
      // @ts-ignore
      this.description = doc.data().content
      this.loading = false;
    })
  }

  alwaysWorkingFunction() {
    // Function that will be executed continuously
    this.currentTime = new Date().toLocaleTimeString();
    if (!this.cookieService.check('teacherId')) {
      this.cookieService.deleteAll('/');
      this.router.navigate(["/login"]);
    }
  }

  updateLesson(title: any, des: any) {

    this.loading = true;

    let updateLessonObj = {
      title:title,
      content:des
    }

    this.db.collection('lessons').doc(this.selectedId).update(updateLessonObj).then(()=>{
      this.snackBar.open('Lesson Update Successful!','Close',{
        duration:5000,
        verticalPosition:'bottom',
        horizontalPosition:'start',
        direction:'ltr'
      })

      this.loading = false;

      this.router.navigate(["/dashboard/newlesson/"+this.selectedCourseId]);

    })

  }

}
