import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Product {
  id?: number;
  productName: string;
  sku: string;
  price: number;
  category: string;
  isActive: boolean;
}

@Component({
  selector: 'app-pos-products',
  templateUrl: './pos-products.component.html',
  styleUrls: ['./pos-products.component.css']
})
export class PosProductsComponent implements OnInit {
  productForm!: FormGroup;
  editingId: number | null = null;

  // Sample Data List
  productList: Product[] = [
    { id: 1, productName: 'Wireless Mouse', sku: 'WM-101', price: 850, category: 'Electronics', isActive: true },
    { id: 2, productName: 'Cotton T-Shirt', sku: 'TS-202', price: 450, category: 'Clothing', isActive: true }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      price: [null, [Validators.required]],
      category: [''],
      isActive: [true]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      if (this.editingId !== null) {
        const index = this.productList.findIndex(p => p.id === this.editingId);
        if (index !== -1) {
          this.productList[index] = {
            id: this.editingId,
            ...this.productForm.value
          };
        }
        this.editingId = null;
      } else {
        const newProduct: Product = {
          id: this.productList.length + 1,
          ...this.productForm.value
        };
        this.productList = [...this.productList, newProduct];
      }
      this.resetForm();
    } else {
      Object.values(this.productForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  editProduct(product: Product): void {
    if (product.id) {
      this.editingId = product.id;
      this.productForm.patchValue({
        productName: product.productName,
        sku: product.sku,
        price: product.price,
        category: product.category,
        isActive: product.isActive
      });
    }
  }

  deleteProduct(id?: number): void {
    if (id) {
      this.productList = this.productList.filter(p => p.id !== id);
    }
  }

  resetForm(): void {
    this.productForm.reset({
      productName: '',
      sku: '',
      price: null,
      category: '',
      isActive: true
    });
    this.editingId = null;
  }
}