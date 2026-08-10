import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRequestListCustomerComponent } from './loan-request-list-customer.component';

describe('LoanListCustomerComponent', () => {
  let component: LoanRequestListCustomerComponent;
  let fixture: ComponentFixture<LoanRequestListCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanRequestListCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanRequestListCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
