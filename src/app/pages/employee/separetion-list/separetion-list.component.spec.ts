import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeparetionListComponent } from './separetion-list.component';

describe('SeparetionListComponent', () => {
  let component: SeparetionListComponent;
  let fixture: ComponentFixture<SeparetionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeparetionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeparetionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
