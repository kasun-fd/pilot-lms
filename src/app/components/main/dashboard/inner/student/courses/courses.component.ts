import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {NgForOf, NgIf} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {
  MatDatepicker,
  MatDatepickerActions, MatDatepickerApply, MatDatepickerCancel,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {dobValidator, nicValidator} from "../../../../../../validator";
import {AuthTokenService} from "../../../../../../services/auth-token.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {map, Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    NgForOf,
    MatProgressBar,
    NgIf,
    MatButton
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit, OnDestroy {

  courseName: any;

  name: any;

  have = false;

  message_box = false;

  courseID: any;

  public static courseDocId: any;

  loading = false;

  allCourses: any[] = [];

  currentTime: string = '';

  private intervalId: any;

  showFirst = false;

  constructor(private db: AngularFirestore,
              public dialog: MatDialog,
              private authTokenService: AuthTokenService,
              private cookieService: CookieService,
              private router: Router,
              private title:Title
  ) {
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  ngOnInit(): void {

    this.title.setTitle('Student Courses | Pilot LMS');

// Start the always working function
    this.intervalId = setInterval(() => {
      this.alwaysWorkingFunction();
    }, 1000);

    this.loading = true;

    this.checkFieldExistsById('student', this.authTokenService.getToken(), 'courseId').subscribe(
      fieldValue => {
        if (fieldValue !== null) {
          console.log('Field value:', fieldValue);
          this.courseID = fieldValue;
          // Perform actions with the field value

        } else {
          console.log('Field or document does not exist');
          this.showFirst = true;
        }
      },
      error => {
        console.error('Error checking field existence:', error);
      }
    );

    this.db.collection("courses").get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.allCourses.push({id: doc.id, data: doc.data()});
          let data = doc.data();

          // @ts-ignore
          if (data.courseid === this.courseID) {
            this.have = true;
            // @ts-ignore
            this.courseName = data.title;
            this.message_box = true;

          }
          this.loading = false;
        })
      })


  }

  alwaysWorkingFunction() {
    // Function that will be executed continuously
    this.currentTime = new Date().toLocaleTimeString();
    if (!this.cookieService.check('login')) {
      this.cookieService.deleteAll('/');
      this.router.navigate(["/login"]);
    }
  }


  checkFieldExistsById(collectionName: string, documentId: string, fieldName: string): Observable<any> {
    return this.db.collection(collectionName).doc(documentId).get().pipe(
      map(doc => {
        // @ts-ignore
        if (doc.exists && doc.data().hasOwnProperty(fieldName)) {
          // @ts-ignore
          return doc.data()[fieldName];
        } else {
          return null;
        }
      })
    );
  }


  openDialog(courseid: any) {

    CoursesComponent.courseDocId = courseid;

    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormField, MatInput, MatLabel, MatHint, MatDatepickerInput, MatDatepickerToggle, MatDatepicker, ReactiveFormsModule, MatDatepickerActions, MatDatepickerCancel, MatDatepickerApply],
})
export class DialogContentExampleDialog {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private store: AngularFirestore,
              private authTokenService: AuthTokenService,
              private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      nic: ['', [Validators.required, nicValidator()]],
      dob: ['', [Validators.required]]
    });
  }

  saveForm() {
    console.log(this.authTokenService.getToken())
    console.log(this.form.value);
    let data = {
      name: this.form.value.firstName + ' ' + this.form.value.lastName,
      dob: this.form.value.dob,
      nic: this.form.value.nic,
      courseId: CoursesComponent.courseDocId
    }

    const documentId = this.authTokenService.getToken();

    this.updateDocumentFields(documentId, data);

  }

  async updateDocumentFields(documentId: string, data: any) {
    try {
      const documentRef = this.store.collection('student').doc(documentId);
      await documentRef.update(data);


      this.snackBar.open('Successfully registered!', 'Close', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'start',
        direction: 'ltr'
      })

      window.location.reload();

    } catch (error) {
      console.error('Error updating document fields:', error);
      // Handle any errors that occur during the update
    }
  }


}
