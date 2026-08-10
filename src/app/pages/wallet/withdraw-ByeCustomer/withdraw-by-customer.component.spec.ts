import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawByeCustomerIdComponent } from './withdraw-by-customer.component';

describe('RechargeRequestsComponent', () => {
  let component: WithdrawByeCustomerIdComponent;
  let fixture: ComponentFixture<WithdrawByeCustomerIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawByeCustomerIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WithdrawByeCustomerIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
