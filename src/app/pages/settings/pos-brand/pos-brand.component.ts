import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Brand {
  id?: number;
  brandName: string;
  isActive: boolean;
}

@Component({
  selector: 'app-pos-brand',
  templateUrl: './pos-brand.component.html',
  styleUrls: ['./pos-brand.component.css']
})
export class PosBrandComponent implements OnInit {
  brandForm!: FormGroup;
  editingId: number | null = null;

  // Sample Data List
  brandList: Brand[] = [
    { id: 1, brandName: 'Nike', isActive: true },
    { id: 2, brandName: 'Adidas', isActive: false }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.brandForm = this.fb.group({
      brandName: ['', [Validators.required]],
      isActive: [true]
    });
  }

  onSubmit(): void {
    if (this.brandForm.valid) {
      if (this.editingId !== null) {
        // Edit Existing Brand
        const index = this.brandList.findIndex(b => b.id === this.editingId);
        if (index !== -1) {
          this.brandList[index] = {
            id: this.editingId,
            ...this.brandForm.value
          };
        }
        this.editingId = null;
      } else {
        // Add New Brand
        const newBrand: Brand = {
          id: this.brandList.length + 1,
          ...this.brandForm.value
        };
        this.brandList = [...this.brandList, newBrand];
      }
      this.resetForm();
    } else {
      Object.values(this.brandForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  editBrand(brand: Brand): void {
    if (brand.id) {
      this.editingId = brand.id;
      this.brandForm.patchValue({
        brandName: brand.brandName,
        isActive: brand.isActive
      });
    }
  }

  deleteBrand(id?: number): void {
    if (id) {
      this.brandList = this.brandList.filter(b => b.id !== id);
    }
  }

  resetForm(): void {
    this.brandForm.reset({
      brandName: '',
      isActive: true
    });
    this.editingId = null;
  }
}