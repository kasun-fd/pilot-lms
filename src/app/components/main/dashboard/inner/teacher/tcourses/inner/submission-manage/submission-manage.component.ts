import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader, MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatAnchor, MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatTooltip} from "@angular/material/tooltip";
import {Title} from "@angular/platform-browser";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-submission-manage',
  standalone: true,
  imports: [
    DatePipe,
    MatAccordion,
    MatButton,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMiniFabButton,
    MatProgressBar,
    MatTooltip,
    NgForOf,
    NgIf,
    RouterLink,
    MatAnchor
  ],
  templateUrl: './submission-manage.component.html',
  styleUrl: './submission-manage.component.scss'
})
export class SubmissionManageComponent implements OnInit {


  currentTime: string = '';
  private intervalId: any;
  selectedId: any;
  selectedCourseId: any;
  titleText: any;
  loading = false;
  submissions: any[] = [];
  AssignmentId:any;
  noContent = false;
  tableView = true;
  active_color_code:any;
  assignmentDocId:any;
  unblocked = false;
  blocked = false;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private cookieService: CookieService,
              private title: Title,
              private db: AngularFirestore,
              private snackBar:MatSnackBar) {
    this.title.setTitle('Submissions | Pilot LMS');
    this.activeRoute.paramMap.subscribe(resp => {
      this.selectedId = resp.get('id');
      this.selectedCourseId = resp.get('courseId');
      this.AssignmentId = resp.get('assignmentId');
    })
  }

  ngOnInit(): void {

    this.loading = true;

    this.db.collection('assignments',ref =>
    ref.where('assignmentId','==',this.AssignmentId)).get()
      .subscribe(query=>{
        query.docs.map(doc=>{
          // @ts-ignore
          if (doc.data().blockStatus == 'Blocked'){
            // @ts-ignore
            this.blocked = true;
            this.unblocked = false;
          }else {
            this.blocked = false;
            this.unblocked = true;
          }
        })
      })

    // Start the always working function
    this.intervalId = setInterval(() => {
      this.alwaysWorkingFunction();
    }, 1000);

    this.db.collection('assignments', ref =>
      ref.where('assignmentId', '==', this.AssignmentId)).get()
      .subscribe(query => {
        query.docs.map(doc => {
          // @ts-ignore
          this.titleText = doc.data().title;
          this.assignmentDocId = doc.id;

          this.db.collection('submitted_assignments',ref=>
            ref.where('taskId','==',this.AssignmentId)).get()
            .subscribe(query=>{
              query.docs.map(doc=>{
                this.submissions.push({id:doc.id,data:doc.data()});
                this.loading = false;
              });
              if (query.size != 0){
                // =====
              }else {
                this.noContent = true;
                this.tableView = false;
                this.loading = false;
              }
            })

        })
      })

  }

  changeStatusBlocked(){
    this.loading = true;
    let obj = {
      blockStatus:'unBlocked'
    }
    this.db.collection('assignments').doc(this.assignmentDocId).update(obj).then(()=>{
      this.snackBar.open('Unblocked Assignment!','Close',{
        duration:5000,
        direction:'ltr',
        verticalPosition:'bottom',
        horizontalPosition:'start'
      })
      this.active_color_code = 'bg-danger';
      this.router.navigate(["/dashboard/myassignments/"+this.selectedId+"/"+this.selectedCourseId]);
      this.loading = false;
    }).catch(er=>{
      console.log(er);
    })
  }

  changeStatus(){
    this.loading = true;
    let obj = {
      blockStatus:'Blocked'
    }
    this.db.collection('assignments').doc(this.assignmentDocId).update(obj).then(()=>{
      this.snackBar.open('Blocked Assignment!','Close',{
        duration:5000,
        direction:'ltr',
        verticalPosition:'bottom',
        horizontalPosition:'start'
      })
      this.active_color_code = 'bg-danger';
      this.router.navigate(["/dashboard/myassignments/"+this.selectedId+"/"+this.selectedCourseId]);
      this.loading = false;
    }).catch(er=>{
      console.log(er);
    })
  }

  alwaysWorkingFunction() {
    // Function that will be executed continuously
    this.currentTime = new Date().toLocaleTimeString();
    if (!this.cookieService.check('teacherId')) {
      this.cookieService.deleteAll('/');
      this.router.navigate(["/login"]);
    }
  }
}
