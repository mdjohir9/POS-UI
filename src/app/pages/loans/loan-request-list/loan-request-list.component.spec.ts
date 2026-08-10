import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRequersListComponent } from './loan-request-list.component';

describe('LoanListComponent', () => {
  let component: LoanRequersListComponent;
  let fixture: ComponentFixture<LoanRequersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanRequersListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanRequersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
