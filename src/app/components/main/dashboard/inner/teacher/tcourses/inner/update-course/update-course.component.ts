import { Component } from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-update-course',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatProgressBar,
    RouterLink
  ],
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.scss'
})
export class UpdateCourseComponent {

}
