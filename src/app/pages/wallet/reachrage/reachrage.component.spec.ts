import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReachrageComponent } from './reachrage.component';

describe('ReachrageComponent', () => {
  let component: ReachrageComponent;
  let fixture: ComponentFixture<ReachrageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReachrageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReachrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
