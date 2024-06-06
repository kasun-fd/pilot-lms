import {Component, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader, MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatButton, MatButtonModule, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatTooltip} from "@angular/material/tooltip";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
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
import {NewLessonComponent} from "../new-lesson/new-lesson.component";

@Component({
  selector: 'app-my-assignments',
  standalone: true,
  imports: [
    MatAccordion,
    MatButton,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
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
    MatMenuTrigger,
    DatePipe
  ],
  templateUrl: './my-assignments.component.html',
  styleUrl: './my-assignments.component.scss'
})
export class MyAssignmentsComponent implements OnInit {

  currentTime: string = '';
  private intervalId: any;
  loading = false;
  titleText: any;
  selectedId: any;
  allAssignments: any[] = [];
  panelOpenState = false;
  noContent = false;
  selectedCouseId:any;

  static globalLessonId:any;
  static globalDocId:any;
  static globalIndex:any;

  constructor(private cookieService: CookieService,
              private title: Title,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private db:AngularFirestore,
              public dialog:MatDialog) {
    this.title.setTitle('All Assignments | Pilot LMS');
    this.activeRoute.paramMap.subscribe(resp => {
      this.selectedId = resp.get('id');
      this.selectedCouseId = resp.get('courseId');
    })
  }

  ngOnInit(): void {

    this.loading = true;

    // Start the always working function
    this.intervalId = setInterval(() => {
      this.alwaysWorkingFunction();
    }, 1000);

    this.db.collection('lessons',ref=>
    ref.where('index','==',this.selectedId)).get()
      .subscribe(querySnapshot=>{
      querySnapshot.docs.map(doc=>{
        // @ts-ignore
        this.titleText = doc.data().title;
      })
    })

    this.db.collection('assignments',ref=>
    ref.where('lessonId','==',this.selectedId)
      .orderBy('index','asc')).get()
      .subscribe(querySnapshot=>{
      const map = querySnapshot.docs.map(docs=>{
        this.allAssignments.push({id:docs.id, data:docs.data()});
      });
        if (map.length !== 0){
        //   ====
        }else {
          this.noContent = true;
        }
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

  openDialog(selectedId: any, index: any, docId: any) {
    MyAssignmentsComponent.globalDocId = docId;
    MyAssignmentsComponent.globalIndex = index;
    MyAssignmentsComponent.globalLessonId = selectedId;
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

  lessonId: any;
  AssignmentDocId: any;
  index: any;
  docData: any[] = [];
  loading = false;
  content = true;


  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>,
              private db: AngularFirestore,
              private snackBar: MatSnackBar,
              private router: Router) {
    this.lessonId = MyAssignmentsComponent.globalLessonId;
    this.AssignmentDocId = MyAssignmentsComponent.globalDocId;
    this.index = MyAssignmentsComponent.globalIndex;
  }

  deleteAssignment() {

    this.loading = true;
    this.content = false;

    this.db.collection('assignments').doc(this.AssignmentDocId).delete().then(() => {
      this.db.collection('assignments', ref =>
        ref.where('lessonId', '==', this.lessonId)
          .where('index', '>', this.index)
          .orderBy('index', 'asc')).get()
        .subscribe(querySnapshot => {
          querySnapshot.docs.map(doc => {
            this.docData.push({id: doc, data: doc.data()});
            this.updateOtherDocs();
          })
        })
    }).then(() => {
      this.snackBar.open('Assignment Deleted!', 'Close', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'start',
        direction: 'ltr'
      })
      this.dialogRef.close();

      this.loading = false;
      this.content = true;

      window.location.reload();

    }).catch(er => {
      console.log(er);
    })

  }

  async updateOtherDocs() {
    for (let docData of this.docData) {
      let updateObj = {
        index: docData.data.index - 1
      }
      await this.db.collection('assignments').doc(docData.id.id).update(updateObj).catch(er => {
        console.log(er);
      })
    }
  }

}
