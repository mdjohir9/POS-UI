import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveLoanComponent } from './approve-loan.component';

describe('ApproveLoanComponent', () => {
  let component: ApproveLoanComponent;
  let fixture: ComponentFixture<ApproveLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveLoanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApproveLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
