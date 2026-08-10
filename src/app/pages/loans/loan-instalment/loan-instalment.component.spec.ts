import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanInstalmentComponent } from './loan-instalment.component';

describe('LoanInstalmentComponent', () => {
  let component: LoanInstalmentComponent;
  let fixture: ComponentFixture<LoanInstalmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanInstalmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanInstalmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
