import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeRequestsComponent } from './recharge-requests.component';

describe('RechargeRequestsComponent', () => {
  let component: RechargeRequestsComponent;
  let fixture: ComponentFixture<RechargeRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechargeRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RechargeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
