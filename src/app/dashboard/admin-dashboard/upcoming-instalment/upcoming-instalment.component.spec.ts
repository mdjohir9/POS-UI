import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingInstalmentComponent } from './upcoming-instalment.component';

describe('AllLoanInstalmentComponent', () => {
  let component: UpcomingInstalmentComponent;
  let fixture: ComponentFixture<UpcomingInstalmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingInstalmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpcomingInstalmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
