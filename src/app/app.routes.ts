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
import {SuccessPageComponent} from "./components/main/dashboard/inner/student/success-page/success-page.component";
import {
  MyCoursesComponent
} from "./components/main/dashboard/inner/teacher/tcourses/inner/my-courses/my-courses.component";
import {
  NewCourseComponent
} from "./components/main/dashboard/inner/teacher/tcourses/inner/new-course/new-course.component";
import {
  UpdateCourseComponent
} from "./components/main/dashboard/inner/teacher/tcourses/inner/update-course/update-course.component";
import {
  NewLessonComponent
} from "./components/main/dashboard/inner/teacher/tcourses/inner/new-lesson/new-lesson.component";
import {
  AddLessonComponent
} from "./components/main/dashboard/inner/teacher/tcourses/inner/add-lesson/add-lesson.component";
import {
  UpdateLessonComponent
} from "./components/main/dashboard/inner/teacher/tcourses/inner/update-lesson/update-lesson.component";
import {
  MyAssignmentsComponent
} from "./components/main/dashboard/inner/teacher/tcourses/inner/my-assignments/my-assignments.component";
import {
  NewAssignmentComponent
} from "./components/main/dashboard/inner/teacher/tcourses/inner/new-assignment/new-assignment.component";
import {
  UpdateAssignmentComponent
} from "./components/main/dashboard/inner/teacher/tcourses/inner/update-assignment/update-assignment.component";
import {
  SubmissionManageComponent
} from "./components/main/dashboard/inner/teacher/tcourses/inner/submission-manage/submission-manage.component";
import {AddTeacherComponent} from "./components/main/dashboard/inner/admin/add-teacher/add-teacher.component";
import {AllTeachersComponent} from "./components/main/dashboard/inner/admin/all-teachers/all-teachers.component";

export const routes: Routes = [
  {path:'',redirectTo:'/login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'dashboard', component:DashboardComponent,children:[
      {path:'',redirectTo:'/dashboard/home',pathMatch:'full'},
      {path:'home',component:HomeComponent},

      // ==== students ====

      {path:'courses',component:CoursesComponent},
      {path:'lessons',component:LessonsComponent},
      {path:'assignments',component:AssignmentsComponent},
      {path:'success',component:SuccessPageComponent},

      // ==== teachers ====

      {path:'tcourses',component:TcoursesComponent},
      {path:'mycourses',component:MyCoursesComponent},
      {path:'newcourse',component:NewCourseComponent},
      {path:'updatecourse/:id/:courseId',component:UpdateCourseComponent},
      {path:'newlesson/:id',component:NewLessonComponent},
      {path:'addlesson/:id',component:AddLessonComponent},
      {path:'updatelesson/:id/:courseId',component:UpdateLessonComponent},
      {path:'myassignments/:id/:courseId',component:MyAssignmentsComponent},
      {path:'newassignment/:id/:courseId',component:NewAssignmentComponent},
      {path:'updateassignment/:doc/:id/:courseId',component:UpdateAssignmentComponent},
      {path:'submissions/:id/:courseId/:assignmentId',component:SubmissionManageComponent},

      //   ===== admin =====

      {path:'addteacher',component:AddTeacherComponent},
      {path:'allteacherslist',component:AllTeachersComponent}

    ]},
  {path:'**',component:NotFoundComponent}
];
