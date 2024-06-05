import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";

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

  constructor(private activeRouter:ActivatedRoute) {
    activeRouter.paramMap.subscribe(resp=>{
      this.selectedId = resp.get('id');
    })
  }

}
