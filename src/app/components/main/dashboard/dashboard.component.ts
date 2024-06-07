import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink, RouterLinkActive,
  RouterOutlet
} from "@angular/router";
import {MatButton, MatFabButton} from "@angular/material/button";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {routes} from "../../../app.routes";
import {filter, map, Observable, Subscription} from "rxjs";
import {MatIcon} from "@angular/material/icon";
import {response} from "express";
import {NgIf} from "@angular/common";
import {AuthTokenService} from "../../../services/auth-token.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthServiceService} from "../../../services/auth-service.service";
import {FirestoreServiceService} from "../../../services/firestore-service.service";
import {CookieService} from "ngx-cookie-service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-student-context',
  standalone: true,
  imports: [
    RouterLink,
    MatButton,
    RouterOutlet,
    MatIcon,
    MatFabButton,
    NgIf,
    RouterLinkActive
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit , OnDestroy{
  private authStateSubscription: Subscription | null = null;
  private routerSubscription: Subscription | null = null;

  selectedState: string | null | undefined;
  student:any;
  teacher:any;
  admin:any;
  currentTime: string = '';
  private intervalId: any;

  constructor(private afAuth: AngularFireAuth,
              private fireStore:AngularFirestore,
              private router: Router,
              private activatedRoute:ActivatedRoute,
              private authTokenService:AuthTokenService,
              private authService:AuthServiceService,
              private afs:FirestoreServiceService,
              private cookieService:CookieService,
              private title:Title
  ) {

  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  ngOnInit() {

    this.title.setTitle('Dashboard | Pilot LMS');

    // Start the always working function
    this.intervalId = setInterval(() => {
      this.alwaysWorkingFunction();
    }, 1000);

      this.documentExists('student', this.authTokenService.getToken())
      .subscribe(exists => {
        if (exists){
          this.student = true;
          this.teacher = false;
          this.admin = false;
        }else{
          this.documentExists('teacher', this.authTokenService.getToken())
            .subscribe(exists => {
              if (exists){
                this.student = false;
                this.teacher = true;
                this.admin = false;
              }else{
                this.documentExists('admin', this.authTokenService.getToken())
                  .subscribe(exists => {
                    if (exists){
                      this.student = false;
                      this.teacher = false;
                      this.admin = true;
                    }else{
                      console.log('Invalid entry!');
                      this.router.navigate(["/login"]);
                    }
                  });
              }
            });
        }
      });

    // Listen for changes in the authentication state
    this.authStateSubscription = this.authService.getUser().subscribe(user => {
        // console.log(user?.uid);
    });
  }

  alwaysWorkingFunction() {
    // Function that will be executed continuously
    this.currentTime = new Date().toLocaleTimeString();
    if (!this.cookieService.check('login')){
      this.cookieService.deleteAll('/');
      this.router.navigate(["/login"]);
    }
  }

  documentExists(collection: string, docId: string): Observable<boolean> {
    return this.fireStore.collection(collection).doc(docId).get().pipe(
      map(docSnapshot => {
        return docSnapshot.exists;
      })
    );
  }



  async logout() {
    try {
      // Sign out from Firebase Authentication
      await this.afAuth.signOut();

      // Remove the token from local storage
      localStorage.removeItem('token');

      // Optionally, navigate to the login page or any other desired page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle any errors that occur during logout
    }
  }
}
