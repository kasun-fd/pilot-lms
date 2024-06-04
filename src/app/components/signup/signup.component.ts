import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ɵValue} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AuthTokenService} from "../../services/auth-token.service";
import {CookieService} from "ngx-cookie-service";
import {map, Observable} from "rxjs";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    RouterLink,
    MatLabel
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  private StudentCollection: AngularFirestoreCollection<any>;
  loading = false;
  error: any;

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(10)
    ])
  })


  constructor(public afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private authTokenService: AuthTokenService,
              private cookieService:CookieService,
              private title:Title) {
    this.StudentCollection = this.afs.collection('student');

  }

  ngOnInit(): void {
    this.title.setTitle('SignUp | Pilot LMS');
    this.cookieService.deleteAll();
    }

  signUp() {
    this.error = '';
    this.loading = true;
    this.afAuth.createUserWithEmailAndPassword(<string>this.form.value.email, <string>this.form.value.password)
      .then((userCredential) => {
        // User signed up successfully
        // You can update the user's display name or perform other actions here
        userCredential.user?.updateProfile({displayName: this.form.value.name});
        let userObject = {
          stuId: userCredential.user?.uid,
          name: this.form.value.name,
          email: userCredential.user?.email
        }
        this.StudentCollection.add(userObject).then((docRef) => {
          // this.authTokenService.logout();
          this.authTokenService.removeToken();
          this.authTokenService.setToken(docRef.id);

          const expirationTime = new Date();
          expirationTime.setHours(expirationTime.getHours() + 1) // Set expiration time to 1 hour from now

          this.cookieService.set('login', 'Student', expirationTime);


          this.router.navigate(["/dashboard"])
        }).catch((error) => {
          console.error('Error adding user details: ', error);
          this.loading = false;
        });
      })
      .catch((error) => {
        // Handle sign up error
        // Check if the error is "email already in use"
        if (error.code === 'auth/email-already-in-use') {
          this.error = 'The email address is already in use by another account.';
          this.loading = false;
        } else {
          // Handle other errors
          this.error = 'An error occurred during sign up.';
          this.loading = false;
        }
      });

  }

}
