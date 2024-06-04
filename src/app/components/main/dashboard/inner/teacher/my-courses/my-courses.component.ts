import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [
    MatLabel,
    MatOption,
    MatSelect,
    MatFormField,
    MatInput,
    MatButton,
    MatProgressBar,
    NgForOf,
    NgIf,
    RouterLink,
    MatIcon,
    MatMiniFabButton,
    MatTooltip,
    MatIconButton
  ],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss'
})
export class MyCoursesComponent {

}
