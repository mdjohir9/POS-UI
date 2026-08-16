import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Category {
  id?: number;
  categoryName: string;
  description: string;
  isActive: boolean;
}

@Component({
  selector: 'app-pos-category',
  templateUrl: './pos-category.component.html',
  styleUrls: ['./pos-category.component.css']
})
export class PosCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  editingId: number | null = null;

  // Sample Data List
  categoryList: Category[] = [
    { id: 1, categoryName: 'Electronics', description: 'Gadgets & Electronic items', isActive: true },
    { id: 2, categoryName: 'Clothing', description: 'Apparel & Fashion items', isActive: true }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required]],
      description: [''],
      isActive: [true]
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      if (this.editingId !== null) {
        const index = this.categoryList.findIndex(c => c.id === this.editingId);
        if (index !== -1) {
          this.categoryList[index] = {
            id: this.editingId,
            ...this.categoryForm.value
          };
        }
        this.editingId = null;
      } else {
        const newCategory: Category = {
          id: this.categoryList.length + 1,
          ...this.categoryForm.value
        };
        this.categoryList = [...this.categoryList, newCategory];
      }
      this.resetForm();
    } else {
      Object.values(this.categoryForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  editCategory(category: Category): void {
    if (category.id) {
      this.editingId = category.id;
      this.categoryForm.patchValue({
        categoryName: category.categoryName,
        description: category.description,
        isActive: category.isActive
      });
    }
  }

  deleteCategory(id?: number): void {
    if (id) {
      this.categoryList = this.categoryList.filter(c => c.id !== id);
    }
  }

  resetForm(): void {
    this.categoryForm.reset({
      categoryName: '',
      description: '',
      isActive: true
    });
    this.editingId = null;
  }
}