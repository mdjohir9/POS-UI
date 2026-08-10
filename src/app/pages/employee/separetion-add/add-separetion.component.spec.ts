import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeparetionComponent } from './add-separetion.component';

describe('AddSeparetionComponent', () => {
  let component: AddSeparetionComponent;
  let fixture: ComponentFixture<AddSeparetionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSeparetionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSeparetionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
