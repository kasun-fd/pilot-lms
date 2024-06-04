import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";
import {DashboardComponent} from "./components/main/dashboard/dashboard.component";
import {CoursesComponent} from "./components/main/dashboard/inner/student/courses/courses.component";
import {LessonsComponent} from "./components/main/dashboard/inner/student/lessons/lessons.component";
import {AssignmentsComponent} from "./components/main/dashboard/inner/student/assignments/assignments.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {HomeComponent} from "./components/main/dashboard/inner/home/home.component";
import {TcoursesComponent} from "./components/main/dashboard/inner/teacher/tcourses/tcourses.component";
import {TlessonsComponent} from "./components/main/dashboard/inner/teacher/tlessons/tlessons.component";
import {TassignmentComponent} from "./components/main/dashboard/inner/teacher/tassignments/tassignment.component";
import {SuccessPageComponent} from "./components/main/dashboard/inner/student/success-page/success-page.component";
import {MyCoursesComponent} from "./components/main/dashboard/inner/teacher/my-courses/my-courses.component";
import {NewCourseComponent} from "./components/main/dashboard/inner/teacher/new-course/new-course.component";

export const routes: Routes = [
  {path:'',redirectTo:'/login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'dashboard', component:DashboardComponent,children:[
      {path:'',redirectTo:'/dashboard/home',pathMatch:'full'},
      {path:'home',component:HomeComponent},
      {path:'courses',component:CoursesComponent},
      {path:'lessons',component:LessonsComponent},
      {path:'assignments',component:AssignmentsComponent},
      {path:'success',component:SuccessPageComponent},

      // ==== teachers ====

      {path:'tcourses',component:TcoursesComponent},
      {path:'tlessons',component:TlessonsComponent},
      {path:'tassignments',component:TassignmentComponent},
      {path:'mycourses',component:MyCoursesComponent},
      {path:'newcourse',component:NewCourseComponent}

    ]},
  {path:'**',component:NotFoundComponent}
];
