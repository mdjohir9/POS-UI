import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawRequestsComponent } from './withdraw-requests.component';
describe('RechargeRequestsComponent', () => {
  let component: WithdrawRequestsComponent;
  let fixture: ComponentFixture<WithdrawRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WithdrawRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
