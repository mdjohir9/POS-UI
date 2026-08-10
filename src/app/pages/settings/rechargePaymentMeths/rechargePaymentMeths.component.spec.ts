import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargePaymentMethsComponent } from './rechargePaymentMeths.component';

describe('DepartmentComponent', () => {
  let component: RechargePaymentMethsComponent;
  let fixture: ComponentFixture<RechargePaymentMethsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RechargePaymentMethsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechargePaymentMethsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
