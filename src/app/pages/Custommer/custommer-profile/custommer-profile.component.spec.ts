import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustommerProfileComponent } from './custommer-profile.component';

describe('EmployeeProfileComponent', () => {
  let component: CustommerProfileComponent;
  let fixture: ComponentFixture<CustommerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustommerProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustommerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
