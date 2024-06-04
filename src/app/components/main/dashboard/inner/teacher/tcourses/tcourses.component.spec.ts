import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcoursesComponent } from './tcourses.component';

describe('TcoursesComponent', () => {
  let component: TcoursesComponent;
  let fixture: ComponentFixture<TcoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TcoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TcoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
