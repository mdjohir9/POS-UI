import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { commonTaskService } from 'src/app/core/services/commonTaskService';
import { ProductService } from 'src/app/core/services/product.service';

interface Category {
  id: number;
  categoryName: string;
}

interface Brand {
  id: number;
  brandName: string;
}

interface Unit {
  id: number;
  unitName: string;
}

interface Product {
  id: number;
  productCode: string;
  productName: string;
  categoryId: number;
  companyId: number;
  brandId: number;
  unitId: number;
  purchasePrice: number;
  salesPrice: number;
  vatPercent: number;
  barcode: string;
  isBatchRequired: boolean;
  isActive: boolean;
}

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './pos-products.component.html'
, styleUrl: './pos-products.component.css'
})
export class PosProductsComponent {

  private fb = inject(FormBuilder);

  constructor(
    private productService: ProductService,
    private commonTask: commonTaskService,
    private message: NzMessageService
  ) {}

  productForm!: FormGroup;
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  units: Unit[] = [];

  isModalVisible = false;
  isEditMode = false;
  selectedProductId: number | null = null;

  companyId: number = 0;

  ngOnInit(): void {
    this.companyId = Number(sessionStorage.getItem('__companyId__')) || 0;
    this.initForm();
    this.getProducts();
    this.getCategories();
    this.getBrands();
    this.getUnits();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      productCode: ['', [Validators.required, Validators.
        maxLength(50)]],
      productName: ['', [Validators.required, Validators.maxLength(200)]],
      categoryId: [null, [Validators.required]],
      companyId: [this.companyId, [Validators.required]],
      brandId: [null, [Validators.required]],
      unitId: [null, [Validators.required]],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      salesPrice: [0, [Validators.required, Validators.min(0)]],
      vatPercent: [0, [Validators.min(0), Validators.max(100)]],
      barcode: [''],
      isBatchRequired: [false],
      isActive: [true]
    });
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.products = response.data || [];
        } else {
          this.products = [];
          this.message.error(response.message || 'Product not found.');
        }
      },
      error: (error) => {
        console.error('Product API Error:', error);
        this.products = [];
        this.message.error('Failed to load products.');
      }
    });
  }

  getCategories(): void {
    this.commonTask.getCategorys().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.categories = response.data || [];
        }
      },
      error: (error) => {
        console.error('Category API Error:', error);
      }
    });
  }

  getBrands(): void {
    this.commonTask.getBrands().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.brands = response.data || [];
        }
      },
      error: (error) => {
        console.error('Brand API Error:', error);
      }
    });
  }

  getUnits(): void {
    this.commonTask.getUnits().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.units = response.data || [];
        }
      },
      error: (error) => {
        console.error('Unit API Error:', error);
      }
    });
  }

  showAddProduct(): void {
    this.isEditMode = false;
    this.selectedProductId = null;

    this.productForm.reset({
      productCode: '',
      productName: '',
      categoryId: null,
      companyId: this.companyId,
      brandId: null,
      unitId: null,
      purchasePrice: 0,
      salesPrice: 0,
      vatPercent: 0,
      barcode: '',
      isBatchRequired: false,
      isActive: true
    });

    this.isModalVisible = true;
  }

  editProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.isEditMode = true;
          this.selectedProductId = id;
          this.productForm.patchValue(response.data);
          this.isModalVisible = true;
        } else {
          this.message.error(response.message || 'Unable to load product.');
        }
      },
      error: (error) => {
        console.error('Get Product Error:', error);
        this.message.error('Failed to load product.');
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      Object.values(this.productForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const formValue = this.productForm.getRawValue();

    const payload = {
      productCode: formValue.productCode,
      productName: formValue.productName,
      categoryId: Number(formValue.categoryId),
      companyId: this.companyId,
      brandId: Number(formValue.brandId),
      unitId: Number(formValue.unitId),
      purchasePrice: Number(formValue.purchasePrice),
      salesPrice: Number(formValue.salesPrice),
      vatPercent: Number(formValue.vatPercent),
      barcode: formValue.barcode || '',
      isBatchRequired: formValue.isBatchRequired,
      isActive: formValue.isActive
    };

    console.log('Product Payload:', payload);

    if (this.isEditMode && this.selectedProductId) {
      this.productService.updateProduct(payload, this.selectedProductId).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.message.success(response.message || 'Product updated successfully.');
            this.isModalVisible = false;
            this.getProducts();
          } else {
            this.message.error(response.message || 'Failed to update product.');
          }
        },
        error: (error) => {
          console.error('Update Product Error:', error);
        }
      });

      return;
    }

    this.productService.createProduct(payload).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.message.success(response.message || 'Product created successfully.');
          this.isModalVisible = false;
          this.getProducts();
        } else {
          this.message.error(response.message || 'Failed to create product.');
        }
      },
      error: (error) => {
        console.error('Create Product Error:', error);
      }
    });
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.message.success(response.message || 'Product deleted successfully.');
          this.getProducts();
        } else {
          this.message.error(response.message || 'Failed to delete product.');
        }
      },
      error: (error) => {
        console.error('Delete Product Error:', error);
      }
    });
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.productForm.reset();
  }
}