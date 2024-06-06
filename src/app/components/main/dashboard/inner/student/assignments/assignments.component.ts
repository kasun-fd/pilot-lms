import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {Title} from "@angular/platform-browser";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {doc} from "@angular/fire/firestore";
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize, Observable} from "rxjs";
import firebase from "firebase/compat";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthTokenService} from "../../../../../../services/auth-token.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [
    MatProgressBar,
    NgForOf,
    NgIf,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatButton,
    NgClass,
    DatePipe
  ],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.scss'
})
export class AssignmentsComponent implements OnInit , OnDestroy{

  static uploadRate:Observable<number | undefined>;

  static downloadLink:Observable<string | undefined>;

  static titleTask:any;

  static taskId:any;

  haven = false;

  have = false;

  loading = false;

  allAssignments:any[] = [];

  currentTime: string = '';

  private intervalId: any;

  assignmentIdsToDisable:number[] = [];

  buttonTest = 'Submit';

  titleText:any = atob(this.cookieService.get('lessonTitle'));

  constructor(
    private db:AngularFirestore,
    public storage:AngularFireStorage,
    private router:Router,
    private cookieService:CookieService,
    private title:Title,
    public dialog: MatDialog,
    private authToken:AuthTokenService
  ) {
  }

  ngOnInit(): void {

    this.loading = true;

    this.title.setTitle('Student Assignments | Pilot LMS');

    // Start the always working function
    this.intervalId = setInterval(() => {
      this.alwaysWorkingFunction();
    }, 1000);

    this.db.collection('student').doc(this.authToken.getToken()).valueChanges()
      .subscribe((doc:any)=>{
        if (doc){
          this.db.collection('submitted_assignments',ref=>
            ref.where('stuId','==',doc.stuId)).get().subscribe(
            querySnapshot=>{
              const ids = querySnapshot.docs.map(doc=> doc.data());
              if (ids){
                for (let temp of ids){
                  // @ts-ignore
                  this.assignmentIdsToDisable.push(temp.taskId);
                }

              }

              if (atob(this.cookieService.get('lessonId'))){
                this.db.collection('assignments', ref => ref.where('lessonId',
                  '==', atob(this.cookieService.get('lessonId')))
                  .where('blockStatus','==','unBlocked')).get().subscribe(
                  querySnapshot => {
                    const documents = querySnapshot.docs.map(doc => doc.data());
                    if (documents.length !== 0){
                      this.allAssignments = documents;
                    }else{
                      this.haven = true;
                      this.have = false;
                    }
                    this.loading = false;
                  }
                );
                this.have = true;
                this.haven = false;
              }else{
                this.haven = true;
                this.have = false;
                this.loading = false;
              }

            })
        }
      })

  }

  static submitAssignment(selectedFile:any,storage:any){

    const path = 'file/'+ AssignmentsComponent.titleTask + '/' + selectedFile.name;
    const fileRef = storage.ref(path);
    const task = storage.update(path, selectedFile);

    this.uploadRate = task.percentageChanges();

  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }


  alwaysWorkingFunction() {
    // Function that will be executed continuously
    this.currentTime = new Date().toLocaleTimeString();
    if (!this.cookieService.check('login')){
      this.cookieService.deleteAll('/');
      this.router.navigate(["/login"]);
    }
  }

  openDialog(title: string | HTMLTitleElement | SVGTitleElement | undefined | null, assignmentId: any) {

    AssignmentsComponent.titleTask = title;

    AssignmentsComponent.taskId = assignmentId;

    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  protected readonly document = document;
  protected readonly doc = doc;
}



@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-context.html',
  styleUrl:'assignments.component.scss',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatLabel, MatFormField, MatInput, ReactiveFormsModule, FormsModule,
    MatProgressBar, NgIf, AsyncPipe, MatProgressSpinner],
})
export class DialogContentExampleDialog {

  // @ts-ignore
  uploadRate: Observable<number | undefined>;
  // @ts-ignore
  downloadLink: Observable<string | undefined>;

  loading = false;

  selectedFile:any;

  loadingLine = false;

  constructor(private storage:AngularFireStorage,
              private db:AngularFirestore,
              private authToken:AuthTokenService,
              private snackBar:MatSnackBar,
              private dialogRef: MatDialogRef<DialogContentExampleDialog>,
              private router:Router,
              private cookieService:CookieService) {
  }

  form = new FormGroup({
    fileChooser:new FormControl('',[
      Validators.required
    ])
  })

  onChange(file:any){
    if (file.target.files[0].type === 'application/pdf') {
      this.snackBar.dismiss();
      this.loading = false;
      this.selectedFile = file.target.files[0];
    } else {
      this.snackBar.open(
        'Please select a valid PDF file!'
      ,'Close',{
          direction:'ltr',
          verticalPosition:'bottom',
          horizontalPosition:'center',
          duration:7000
        })
      this.loading = true;
    }
  }
  submitFile(){
    this.loading = true;
    this.loadingLine = true;
    const path = 'file/'+ AssignmentsComponent.titleTask + '/' + this.authToken.getToken() + '/'
      + this.selectedFile.name;
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path,this.selectedFile);


    this.uploadRate = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(()=>{
        this.downloadLink = fileRef.getDownloadURL();
      })
    ).subscribe();

    task.then(()=>{

      this.db.collection('student').doc(this.authToken.getToken()).valueChanges()
        .subscribe((doc:any)=>{
          if (doc){
            this.downloadLink?.subscribe(res=>{
              let subObj = {
                taskId:AssignmentsComponent.taskId,
                submitId: Math.random().toString(36).substring(2,7),
                stuId: doc.stuId,
                email:doc.email,
                file: res
              }

              this.db.collection('submitted_assignments').add(subObj).then((docRef)=>{
                this.loading = false;
                this.loadingLine = false;
                this.dialogRef.close();
                const expireTime = new Date();
                expireTime.setMinutes(expireTime.getMinutes() + 2);
                this.cookieService.set('success-task','success',expireTime,'/');
                this.router.navigate(["/dashboard/success"]);
                // const message = 'Task Upload Successful! 🎉'
                // this.snackBar.open(message,'Close',{
                //   duration:5000,
                //   verticalPosition:'bottom',
                //   horizontalPosition:'start',
                //   direction:'ltr'
                // })
                //
              }).catch(er=>{
                console.log(er);
                this.loading = false;
                this.loadingLine = false;
              });

            })
          }
        })


    }).catch(error=>{
      console.log(error)
      this.loading = false;
      this.loadingLine = false;
    })
  }
}
