import { Component } from '@angular/core';
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

@Component({
  selector: 'app-add-lesson',
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
  templateUrl: './add-lesson.component.html',
  styleUrl: './add-lesson.component.scss'
})
export class AddLessonComponent {
  loading = false;
  selectedId:any;

  form = new FormGroup({
    index:new FormControl('',[
      Validators.required,
      Validators.minLength(1)
    ]),
    title:new FormControl('',[
      Validators.required
    ]),
    des:new FormControl('',[
      Validators.required
    ])
  })

  constructor(private activeRouter:ActivatedRoute,
              private title:Title,
              private db:AngularFirestore,
              private router:Router,
              private snackBar:MatSnackBar) {

    this.title.setTitle('Add Lesson | Pilot LMS');

    this.activeRouter.paramMap.subscribe(res=>{
      this.selectedId = res.get('id');
    })
  }

  allLesson(){

    this.loading = true;

     let newLesson = {
       courseId:this.selectedId,
       lessonId:this.form.value.index,
       title:this.form.value.title,
       content:this.form.value.des
     }

     this.db.collection('lessons').add(newLesson).then((docRef)=>{
       this.loading = false;
       this.snackBar.open('Lesson Added Successful!','Close',{
         duration:5000,
         verticalPosition:'bottom',
         horizontalPosition:'start',
         direction:'ltr'
       })
       this.router.navigate(["/dashboard/newlesson/"+this.selectedId]);
     }).catch(er=>{
       console.log(er);
       this.loading = false;
     })

  }

}
