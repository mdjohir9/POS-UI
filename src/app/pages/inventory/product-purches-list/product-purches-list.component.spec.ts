import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPurchesListComponent } from './product-purches-list.component';

describe('ProductPurchesListComponent', () => {
  let component: ProductPurchesListComponent;
  let fixture: ComponentFixture<ProductPurchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPurchesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductPurchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
