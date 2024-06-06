import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Title} from "@angular/platform-browser";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-update-course',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatProgressBar,
    RouterLink,
    NgIf
  ],
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.scss'
})
export class UpdateCourseComponent implements OnInit {

  selectedId: any;
  selectedCourseId:any;
  loading = false;
  courseTitle:any;
  courseDes:any;

  currentTime: string = '';

  private intervalId: any;

  constructor(private activeRouter: ActivatedRoute,
              private db:AngularFirestore,
              private snackBar:MatSnackBar,
              private router:Router,
              private title:Title,
              private cookieService:CookieService) {
    this.title.setTitle('Update Course | Pilot LMS');
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

        this.db.collection('courses',ref=>
          ref.where('courseid','==',this.selectedCourseId)).get()
          .subscribe(querySnapshot=>{
            querySnapshot.docs.map(doc=>{
              // @ts-ignore
              this.courseTitle = doc.data().title;
              // @ts-ignore
              this.courseDes = doc.data().description;

              this.loading = false;

            })
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

  updateCourse(title: any, des: any) {

    this.loading = true;

    let courseObj = {
      title:title.value,
      description:des.value
    }

    this.db.collection('courses').doc(this.selectedId).update(courseObj).then(()=>{

      this.snackBar.open('Course Updated Successful!','Close',{
        duration:5000,
        direction:'ltr',
        verticalPosition:'bottom',
        horizontalPosition:'start'
      })

      this.loading = false;

      this.router.navigate(["/dashboard/mycourses"]);

    }).catch(er=>{
      console.log(er);
    })

  }
}
