import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ɵValue} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {routes} from "../../app.routes";
import {catchError, map, Observable, of} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AuthTokenService} from "../../services/auth-token.service";
import {AuthServiceService} from "../../services/auth-service.service";
import {FirestoreServiceService} from "../../services/firestore-service.service";
import {CookieService} from "ngx-cookie-service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit{

  loading = false;
  error: any;

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(10)
    ]),
    code: new FormControl('', [
      Validators.minLength(1)
    ])
  });


  constructor(
              private router: Router,
              private authTokenService: AuthTokenService,
              private authService:AuthServiceService,
              private afs:FirestoreServiceService,
              private firestore:AngularFirestore,
              private cookieService:CookieService,
              private title:Title
  ) {
    this.cookieService.deleteAll();
  }

  ngOnInit(): void {
        this.title.setTitle('Login | Pilot LMS');
        this.cookieService.deleteAll();
    }

  signIn() {
    this.authTokenService.removeToken();
    this.cookieService.deleteAll();
    this.error = '';
    this.loading = true;
    this.authService.login(this.form.value.email, this.form.value.password)
      .then((userCredential) => {
        this.findDocIdByField('student', 'stuId', userCredential.user?.uid).subscribe(ids => {
          if (ids) {
            this.authTokenService.removeToken();
            this.authTokenService.setToken(ids);

            this.checkFieldExistsById('student', this.authTokenService.getToken(), 'courseId').subscribe(
              fieldValue => {
                if (fieldValue !== null) {

                  this.cookieService.set('courseCode', btoa(fieldValue), 365 * 100,'/');

                } else {
                  this.cookieService.delete('courseCode');
                  console.log('Field or document does not exist');
                }
              },
              error => {
                this.cookieService.delete('courseCode');
                console.error('Error checking field existence:', error);
              }
            );

            const expirationTime = new Date();
            expirationTime.setHours(expirationTime.getHours() + 1) // Set expiration time to 1 hour from now

            this.cookieService.set('login', 'Student', expirationTime,'/');

            // console.log('student coming');
            this.router.navigate(["/dashboard"]);
          } else {
            this.findDocIdByField('teacher', 'uId', userCredential.user?.uid).subscribe(ids => {
              if (ids) {

                this.firestore.collection('teacher').doc(ids).get().subscribe(doc=>{
                  if (doc.exists){
                    const expirationTime = new Date();
                    expirationTime.setHours(expirationTime.getHours() + 1)
                    // @ts-ignore
                    this.cookieService.set('teacherId',btoa(doc.data().uId),expirationTime,'/');
                  }else{
                    console.log('No data');
                  }
                })

                this.authTokenService.removeToken();
                this.authTokenService.setToken(ids);

                const expirationTime = new Date();
                expirationTime.setHours(expirationTime.getHours() + 1); // Set expiration time to 1 hour from now

                this.cookieService.set('login', 'Teacher', expirationTime,'/');

                this.router.navigate(["/dashboard"]);
                // this.form.reset();
              } else {
                console.log('invalid user name or password.');
                this.loading = false;
              }
            })
          }
        })
      }).catch((error) => {
      console.log(error);
      this.loading = false;
    })


  }

  checkFieldExistsById(collectionName: string, documentId: string, fieldName: string): Observable<any> {
    return this.firestore.collection(collectionName).doc(documentId).get().pipe(
      map(doc => {
        // @ts-ignore
        if (doc.exists && doc.data().hasOwnProperty(fieldName)) {
          // @ts-ignore
          return doc.data()[fieldName];
        } else {
          return null;
        }
      })
    );
  }

  findDocIdByField(collectionName: string, fieldName: string, fieldValue: any): Observable<string> {
    // @ts-ignore
    return this.firestore.collection(collectionName, ref => ref.where(fieldName, '==', fieldValue)).snapshotChanges().pipe(
      map(actions => {
        const documentId = actions.length > 0 ? actions[0].payload.doc.id : null;
        return documentId;
      })
    );
  }

}
