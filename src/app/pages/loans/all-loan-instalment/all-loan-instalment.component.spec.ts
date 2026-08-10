import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLoanInstalmentComponent } from './all-loan-instalment.component';

describe('AllLoanInstalmentComponent', () => {
  let component: AllLoanInstalmentComponent;
  let fixture: ComponentFixture<AllLoanInstalmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllLoanInstalmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllLoanInstalmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
