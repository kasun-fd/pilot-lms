import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-new-course',
  standalone: true,
    imports: [
        MatFormField,
        MatInput,
        MatLabel
    ],
  templateUrl: './new-course.component.html',
  styleUrl: './new-course.component.scss'
})
export class NewCourseComponent {

}
