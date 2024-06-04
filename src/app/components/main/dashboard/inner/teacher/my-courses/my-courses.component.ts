import {Component, OnInit} from '@angular/core';
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
import {Title} from "@angular/platform-browser";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {CookieService} from "ngx-cookie-service";

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
export class MyCoursesComponent implements OnInit{

  loading = false;

  constructor(private title:Title,
              private db:AngularFirestore,
              private cookieService:CookieService) {
  }

  ngOnInit(): void {

    this.loading = true;

    this.title.setTitle('My Courses | Pilot LMS');

    this.db.collection('courses',ref=>ref.where(
      'teacherId','==', atob(this.cookieService.get('teacherId')))).get().subscribe(querySnapshot=>{
        const documents = querySnapshot.docs.map(doc => doc.data());
        if (documents){
          console.log(documents);
          console.log('have');
        }else{
          console.log('haven');
        }
    })

  }

}
