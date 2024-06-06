import {Component, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatButton, MatButtonModule, MatIconButton, MatMiniFabButton} from "@angular/material/button";
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
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NewLessonComponent} from "../new-lesson/new-lesson.component";
import {Dialog} from "@angular/cdk/dialog";

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

  static docId: any;

  static courseId: any;

  constructor(private title: Title,
              private db: AngularFirestore,
              private cookieService: CookieService,
              private router: Router,
              public dialog: MatDialog) {
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
          const documents: any[] = querySnapshot.docs.map
          (doc => {
            this.myAllCourses.push({id: doc.id, data: doc.data()});
          });
          if (documents.length !== 0) {
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
    if (!this.cookieService.check('teacherId')) {
      this.cookieService.deleteAll('/');
      this.router.navigate(["/login"]);
    }
  }

  openDialog(id: any, courseid: any) {
    MyCoursesComponent.docId = id;
    MyCoursesComponent.courseId = courseid;

    // @ts-ignore
    const dialogRef = this.dialog.open(CourseDialogBox, {
      width: '400px',
      id,
      courseid
    });

  }
}

@Component({
  selector: 'course-dialog-box',
  templateUrl: 'course-dialog-box.html',
  standalone: true,
  imports: [MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent, NgIf],
})
export class CourseDialogBox {

  loadingCircle = false;
  content = true;
  docId: any
  courseId: any;
  lessonsDocIds:any[] = [];

  constructor(public dialogRef: MatDialogRef<CourseDialogBox>,
              private db: AngularFirestore,
              private snackBar: MatSnackBar,
              private router: Router) {
    this.docId = MyCoursesComponent.docId;
    this.courseId = MyCoursesComponent.courseId;
  }

  deleteCourse() {
    this.loadingCircle = true;
    this.content = false;

    this.db.collection('courses').doc(this.docId).delete().then(() => {
      this.db.collection('lessons', ref =>
        ref.where('courseId', '==', this.courseId)).get()
        .subscribe(querySnapshot => {
          querySnapshot.docs.map(docs => {
            this.lessonsDocIds.push(docs.id);
            this.deleteLessons().then(() => {
              this.snackBar.open('Course Deleted!', 'Close', {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'start',
                direction: 'ltr'
              })
              this.dialogRef.close();

              this.loadingCircle = false;
              this.content = true;

              window.location.reload();
            }).catch(er=>{
              console.log(er)
            });
          })
        })
    }).catch(er => {
      console.log(er);
    });
  }

  async deleteLessons(){
    for (const lessonsDocId of this.lessonsDocIds) {
      await this.db.collection('lessons').doc(lessonsDocId).delete()
        .catch(er=>{
          console.log(er);
        });
    }
  }

}
