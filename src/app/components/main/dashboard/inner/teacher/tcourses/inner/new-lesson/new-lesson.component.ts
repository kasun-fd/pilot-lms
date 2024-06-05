import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatTooltip} from "@angular/material/tooltip";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {
  MatAccordion,
  MatExpansionPanel, MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {Title} from "@angular/platform-browser";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ref} from "@angular/fire/database";

@Component({
  selector: 'app-new-lesson',
  standalone: true,
  imports: [
    MatButton,
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
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatExpansionPanelDescription,
    MatMenuTrigger
  ],
  templateUrl: './new-lesson.component.html',
  styleUrl: './new-lesson.component.scss'
})
export class NewLessonComponent implements OnInit{
  loading = false;
  panelOpenState = false;
  allLessons:any[] = [];
  selectedId:any;
  titleText:any;

  constructor(private activeRouter:ActivatedRoute,
              private title:Title,
              private db:AngularFirestore) {
      this.title.setTitle('Lessons | Pilot LMS');
      activeRouter.paramMap.subscribe(response=>{
        this.selectedId = response.get('id');
      })

  }

  ngOnInit(): void {

    this.loading = true;

    this.db.collection('courses',ref=>
      ref.where('courseid','==',this.selectedId)).get().subscribe(querySnapshot=>{
      // @ts-ignore
      this.titleText = querySnapshot.docs.map(doc=>doc.data().title);
    })

        this.db.collection('lessons',
            ref=>ref.where('courseId','==',this.selectedId)
              .orderBy('lessonId','asc')).get().subscribe(doc=>{
              doc.docs.map(docs=> {
                this.allLessons.push({id:docs.id,data:docs.data()});
              });
              this.loading = false;
        })
    }

  goToAssignments(lessonId: any){}

}
