import {Component, OnInit} from '@angular/core';
import {MatAnchor, MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {MatTooltip} from "@angular/material/tooltip";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Title} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-all-teachers',
  standalone: true,
  imports: [
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatProgressBar,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatAnchor,
    MatMiniFabButton,
    MatTooltip,
    NgForOf
  ],
  templateUrl: './all-teachers.component.html',
  styleUrl: './all-teachers.component.scss'
})
export class AllTeachersComponent implements OnInit{

  loading:any
  noContent = false;
  tableView = false;
  allTeachers:any[] = [];

  constructor(private db:AngularFirestore,
              private title:Title,
              private snackBar:MatSnackBar) {
    this.loadTable();
    title.setTitle('All Teachers | Pilot LMS');
  }

    ngOnInit(): void {
        this.loading = true;
        this.db.collection('teacher').get().subscribe(query=>{
          query.docs.map(doc=>{
            this.allTeachers.push({id:doc.id, data:doc.data()});
            this.loading = false;
          });
          if (query.size != 0){
            this.noContent = false;
            this.tableView = true;
          }else{
            this.noContent = true;
            this.tableView = false;
          }
        })
    }

    loadTable(){}

  deleteTeacher(docId:any){

    this.loading = true;

    this.db.collection('teacher').doc(docId).delete().then(()=>{
      this.snackBar.open('Deleted Successful!','Close',{
        duration:5000,
        direction:'ltr',
        verticalPosition:'bottom',
        horizontalPosition:'start'
      })
      this.allTeachers = [];
      this.loadTable();
      this.ngOnInit();
      this.loading = false;
    }).catch(er=>{
      console.log(er);
    })
  }

}
