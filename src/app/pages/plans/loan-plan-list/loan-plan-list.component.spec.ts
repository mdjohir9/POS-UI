import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPlanListComponent } from './loan-plan-list.component';

describe('LoanPlanListComponent', () => {
  let component: LoanPlanListComponent;
  let fixture: ComponentFixture<LoanPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPlanListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
