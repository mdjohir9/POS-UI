import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustommerListComponent } from './custommer-list.component';

describe('CustommerListComponent', () => {
  let component: CustommerListComponent;
  let fixture: ComponentFixture<CustommerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustommerListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustommerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
