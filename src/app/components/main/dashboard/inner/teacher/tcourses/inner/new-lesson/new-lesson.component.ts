import {Component, OnInit} from '@angular/core';
import {MatButton, MatButtonModule, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatTooltip} from "@angular/material/tooltip";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {
  MatAccordion,
  MatExpansionPanel, MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {Title} from "@angular/platform-browser";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ref} from "@angular/fire/database";
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {routes} from "../../../../../../../../app.routes";
import {reload} from "@angular/fire/auth";

@Component({
  selector: 'app-new-lesson',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMiniFabButton,
    MatProgressBar,
    MatTooltip,
    NgForOf,
    NgIf,
    RouterLink,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatExpansionPanelDescription,
    MatMenuTrigger
  ],
  templateUrl: './new-lesson.component.html',
  styleUrl: './new-lesson.component.scss'
})
export class NewLessonComponent implements OnInit {
  loading = false;
  panelOpenState = false;
  allLessons: any[] = [];
  selectedId: any;
  titleText: any;
  static globalCourseId: any;
  static globalLessonId: any;
  static globalLessonDocId: any;

  constructor(private activeRouter: ActivatedRoute,
              private title: Title,
              private db: AngularFirestore,
              public dialog: MatDialog) {
    this.title.setTitle('Lessons | Pilot LMS');
    activeRouter.paramMap.subscribe(response => {
      this.selectedId = response.get('id');
    })

  }

  public ngOnInit(): void {

    this.loading = true;

    this.db.collection('courses', ref =>
      ref.where('courseid', '==', this.selectedId)).get().subscribe(querySnapshot => {
      // @ts-ignore
      this.titleText = querySnapshot.docs.map(doc => doc.data().title);
    })

    this.db.collection('lessons',
      ref => ref.where('courseId', '==', this.selectedId)
        .orderBy('lessonId', 'asc')).get().subscribe(doc => {
      doc.docs.map(docs => {
        this.allLessons.push({id: docs.id, data: docs.data()});
      });
      this.loading = false;
    })
  }

  goToAssignments(lessonId: any) {
  }

  openDialog(courseId: any, lessonId: any, docId: any): void {
    NewLessonComponent.globalCourseId = courseId;
    NewLessonComponent.globalLessonId = lessonId;
    NewLessonComponent.globalLessonDocId = docId;

    const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
      width: '400px',
    });
  }

}


@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog-box.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, NgIf],
})
export class DialogAnimationsExampleDialog{

  courseId: any;
  lessonId: any;
  docId: any;
  docData: any[] = [];
  loadingCircle = false;
  content = true;

  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>,
              private db: AngularFirestore,
              private snackBar: MatSnackBar,
              private router: Router) {
    this.courseId = NewLessonComponent.globalCourseId;
    this.lessonId = NewLessonComponent.globalLessonId;
    this.docId = NewLessonComponent.globalLessonDocId;
  }

  deleteLesson() {

    this.loadingCircle = true;
    this.content = false;

    this.db.collection('lessons').doc(this.docId).delete().then(() => {
      this.db.collection('lessons', ref =>
        ref.where('courseId', '==', this.courseId)
          .where('lessonId', '>', this.lessonId)
          .orderBy('lessonId', 'asc')).get()
        .subscribe(querySnapshot => {
          querySnapshot.docs.map(doc => {
            this.docData.push({id: doc, data: doc.data()});
            this.updateOtherDocs();
          })
        })
    }).then(() => {
      this.snackBar.open('Lesson Deleted!', 'Close', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'start',
        direction: 'ltr'
      })
      this.dialogRef.close();

      this.loadingCircle = false;
      this.content = true;

      window.location.reload();

    }).catch(er => {
      console.log(er);
    })

  }

  async updateOtherDocs() {
    for (let docData of this.docData) {
      let updateObj = {
        lessonId: docData.data.lessonId - 1
      }
      await this.db.collection('lessons').doc(docData.id.id).update(updateObj).catch(er => {
        console.log(er);
      })
    }
  }

}
