import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PosCategoryService } from 'src/app/core/services/pos-category.service';

export interface Category {
  id?: number;
  name?: string;
  categoryName?: string;
  description?: string;
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
  categoryList: Category[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: PosCategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCategories();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required]],
      description: [''],
      isActive: [true]
    });
  }

  getCategories(): void {
    this.isLoading = true;

    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.categoryList = response.data || [];
        } else {
          this.categoryList = [];
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'Category not found.'
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Category List API Error:', error);
        this.categoryList = [];
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load category list.'
        });
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      Object.values(this.categoryForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const postData = {
      name: this.categoryForm.value.categoryName,
      description: this.categoryForm.value.description,
      isActive: this.categoryForm.value.isActive
    };

    if (this.editingId !== null) {
      this.categoryService.updateCategory(postData, this.editingId).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: response.message || 'Category updated successfully.',
              timer: 1500,
              showConfirmButton: false
            });
            this.resetForm();
            this.getCategories();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: response.message || 'Failed to update category.'
            });
          }
        },
        error: (error) => {
          console.error('Update Category Error:', error);
        }
      });
      return;
    }

    this.categoryService.saveCategory(postData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: response.message || 'Category saved successfully.',
            timer: 1500,
            showConfirmButton: false
          });
          this.resetForm();
          this.getCategories();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Save Failed',
            text: response.message || 'Failed to save category.'
          });
        }
      },
      error: (error) => {
        console.error('Save Category Error:', error);
      }
    });
  }

  editCategory(category: Category): void {
    if (!category.id) return;

    this.editingId = category.id;
    this.categoryForm.patchValue({
      categoryName: category.name || category.categoryName || '',
      description: category.description || '',
      isActive: category.isActive
    });
  }

  deleteCategory(id?: number): void {
    if (!id) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.categoryService.deleteCategory(id).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: response.message || 'Category deleted successfully.',
              timer: 1500,
              showConfirmButton: false
            });
            this.getCategories();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: response.message || 'Failed to delete category.'
            });
          }
        },
        error: (error) => {
          console.error('Delete Category Error:', error);
        }
      });
    });
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