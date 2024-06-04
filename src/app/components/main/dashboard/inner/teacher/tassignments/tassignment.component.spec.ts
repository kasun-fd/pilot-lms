import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TassignmentComponent } from './tassignment.component';

describe('TassignmentComponent', () => {
  let component: TassignmentComponent;
  let fixture: ComponentFixture<TassignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TassignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
