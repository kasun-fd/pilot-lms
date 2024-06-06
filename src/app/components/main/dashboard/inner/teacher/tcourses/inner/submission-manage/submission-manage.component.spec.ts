import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionManageComponent } from './submission-manage.component';

describe('SubmissionManageComponent', () => {
  let component: SubmissionManageComponent;
  let fixture: ComponentFixture<SubmissionManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmissionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
