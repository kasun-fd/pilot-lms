import {Component, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatIcon} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatButton, MatIconButton} from "@angular/material/button";
import {DatePipe, NgIf} from "@angular/common";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-update-assignment',
  standalone: true,
  imports: [
    MatProgressBar,
    RouterLink,
    MatIcon,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepicker,
    MatDatepickerToggle,
    MatButton,
    MatIconButton,
    NgIf,
    MatHint,
    FormsModule
  ],
  templateUrl: './update-assignment.component.html',
  styleUrl: './update-assignment.component.scss'
})
export class UpdateAssignmentComponent implements OnInit{
  currentTime: string = '';
  loading = false;
  private intervalId: any;
  selectedId:any;
  selectedCourseId:any;
  docId:any;
  titleText:any;
  content:any;
  dueDateView: Date | undefined

  constructor(private cookieService:CookieService,
              private title:Title,
              private router:Router,
              private activeRoute:ActivatedRoute,
              private db:AngularFirestore,
              private snackBar:MatSnackBar) {
    this.title.setTitle('Update Assignment | Pilot LMS');
    this.activeRoute.paramMap.subscribe(resp=>{
      this.selectedId = resp.get('id');
      this.selectedCourseId = resp.get('courseId');
      this.docId = resp.get('doc');
    })
  }

  ngOnInit(): void {

    this.loading = true;

    // Start the always working function
    this.intervalId = setInterval(() => {
      this.alwaysWorkingFunction();
    }, 1000);

    this.db.collection('assignments').doc(this.docId).get()
      .subscribe(doc=>{
        // @ts-ignore
        this.titleText = doc.data().title;
        // @ts-ignore
        this.content = doc.data().description;

        // @ts-ignore
        const date = new Date(doc.data().dueDate);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        this.dueDateView = new Date(`${month}/${day}/${year}`);

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

  updateAssignment(title: any, des: any, date: any) {

    this.loading = true;

    let obj = {
      title:title.value,
      description:des.value,
      dueDate:date.value
    }

    this.db.collection('assignments').doc(this.docId).update(obj).then(()=>{

      this.snackBar.open('Assignment Updated Successful!','Close',{
        duration:5000,
        direction:'ltr',
        verticalPosition:'bottom',
        horizontalPosition:'start'
      })

      this.loading = false;
      this.router.navigate(["/dashboard/myassignments/"+this.selectedId+"/"+this.selectedCourseId]);

    }).catch(er=>{
      console.log(er);
    })
  }
}
