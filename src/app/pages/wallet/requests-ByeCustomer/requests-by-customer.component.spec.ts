import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsByeCustomerIdComponent } from './requests-by-customer.component';

describe('RechargeRequestsComponent', () => {
  let component: RequestsByeCustomerIdComponent;
  let fixture: ComponentFixture<RequestsByeCustomerIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsByeCustomerIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestsByeCustomerIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
