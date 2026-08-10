import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLoanPlansComponent } from './update-loan-plans.component';

describe('LoanPlansComponent', () => {
  let component: UpdateLoanPlansComponent;
  let fixture: ComponentFixture<UpdateLoanPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateLoanPlansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateLoanPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
