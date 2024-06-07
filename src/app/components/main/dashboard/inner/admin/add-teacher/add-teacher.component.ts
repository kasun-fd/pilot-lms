import { Component } from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {CookieService} from "ngx-cookie-service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthTokenService} from "../../../../../../services/auth-token.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-teacher',
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
        RouterLink
    ],
  templateUrl: './add-teacher.component.html',
  styleUrl: './add-teacher.component.scss'
})
export class AddTeacherComponent {
  loading = false;

  constructor(private title:Title,
              private cookieService:CookieService,
              private db:AngularFirestore,
              public afAuth: AngularFireAuth,
              private authTokenService:AuthTokenService,
              private router:Router,
              private snackBar:MatSnackBar) {
    this.title.setTitle('Add Teacher | Pilot LMS');
  }

  form = new FormGroup({
    name:new FormControl('',[
      Validators.required
    ]),
    email:new FormControl('',[
      Validators.required
    ]),
    password:new FormControl('',[
      Validators.required
    ])
  })

  addTeacher(){

    this.loading = true;

    this.afAuth.createUserWithEmailAndPassword(<string>this.form.value.email, <string>this.form.value.password)
      .then((userCredential) => {
        // User signed up successfully
        // You can update the user's display name or perform other actions here
        userCredential.user?.updateProfile({displayName: this.form.value.name});
        let userObject = {
          uId: userCredential.user?.uid,
          name: this.form.value.name,
          email: userCredential.user?.email
        }
        this.db.collection('teacher').add(userObject).then((docRef) => {

          this.snackBar.open('Teacher added successful!','Close',{
            duration:5000,
            direction:'ltr',
            verticalPosition:'bottom',
            horizontalPosition:'center'
          })

          this.router.navigate(["/dashboard/allteacherslist"]);

          this.loading = false;

        }).catch((error) => {
          console.error('Error adding user details: ', error);
          this.loading = false;
        });
      })
      .catch((error) => {
        // Handle sign up error
        // Check if the error is "email already in use"
        if (error.code === 'auth/email-already-in-use') {
          this.snackBar.open('The email address is already in use by another account.','Close',{
            duration:5000,
            direction:'ltr',
            verticalPosition:'bottom',
            horizontalPosition:'center'
          })
          this.loading = false;
        } else {
          // Handle other errors
          this.snackBar.open('An error occurred during sign up.','Close',{
            duration:5000,
            direction:'ltr',
            verticalPosition:'bottom',
            horizontalPosition:'center'
          })
          this.loading = false;
        }
      });
  }

}
