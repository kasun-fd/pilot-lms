import {Component, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";
// import {NbSharedModule} from "@nebular/theme/components/shared/shared.module";
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-new-assignment',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatProgressBar,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatHint,
    FormsModule
  ],
  templateUrl: './new-assignment.component.html',
  styleUrl: './new-assignment.component.scss'
})
export class NewAssignmentComponent implements OnInit{
  currentTime: string = '';
  private intervalId: any;
  selectedId:any;
  selectedCourseId:any;
  loading = false;
  docCount:any;

  form = new FormGroup({
    title:new FormControl('',[
      Validators.required
    ]),
    des:new FormControl('',[
      Validators.required
    ]),
    date:new FormControl('',[
      Validators.required
    ])
  })

  constructor(private cookieService:CookieService,
              private title:Title,
              private router:Router,
              private activeRoute:ActivatedRoute,
              private db:AngularFirestore,
              private snackBar:MatSnackBar) {
    this.title.setTitle('Add Assignment | Pilot LMS');
    this.activeRoute.paramMap.subscribe(resp=>{
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

    this.db.collection('assignments',ref=>
    ref.where('lessonId','==',this.selectedId)).get()
      .subscribe(querySnapshot=>{
        const map = querySnapshot.docs.map(docs=>docs.data());
        this.docCount = map.length;

        this.loading = false;

      })

  }

  addAssignment(){

    this.loading = true;

      let obj = {
        assignmentId:crypto.randomUUID(),
        title:this.form.value.title,
        description:this.form.value.des,
        lessonId:this.selectedId,
        index:this.docCount+1,
        dueDate:(this.form.value.date)?.toString()
      }

      this.db.collection('assignments').add(obj).then(()=>{
        this.snackBar.open('Assignment added successful!','Close',{
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

  alwaysWorkingFunction() {
    // Function that will be executed continuously
    this.currentTime = new Date().toLocaleTimeString();
    if (!this.cookieService.check('teacherId')) {
      this.cookieService.deleteAll('/');
      this.router.navigate(["/login"]);
    }
  }
}
