import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {AngularFirestore} from "@angular/fire/compat/firestore";

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
export class UpdateLessonComponent {
  loading = false;
  selectedId:any;
  docsCount:any;

  form = new FormGroup({
    index:new FormControl('',[
      Validators.required
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
              private db:AngularFirestore) {

    this.title.setTitle('Update Lesson | Pilot LMS');

    activeRouter.paramMap.subscribe(resp=>{
      this.selectedId = resp.get('id');
    })

    this.db.collection('lessons').get().subscribe(querySnapshot=>{
      querySnapshot.docs.map(doc=>{
        // @ts-ignore
        console.log(doc.data().length)
      })
    })

  }

  allLesson(){}

}
