import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import Swal from 'sweetalert2';
import { PosBrandService } from 'src/app/core/services/pos-brand.service';

export interface Brand {
  id?: number;
  name: string;
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

  brandList: Brand[] = [];

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private brandService: PosBrandService
  ) {}


  ngOnInit(): void {
    this.initForm();
    this.getBrands();
  }


  // Initialize Form

  initForm(): void {

    this.brandForm = this.fb.group({

      brandName: [
        '',
        [
          Validators.required
        ]
      ],

      isActive: [
        true
      ]

    });

  }


  // Get Brand List

  getBrands(): void {

    this.isLoading = true;

    this.brandService.getBrands().subscribe({

      next: (response) => {

        if (response.statusCode === 200) {

          this.brandList =
            response.data || [];

        } else {

          this.brandList = [];

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              response.message ||
              'Brand not found.'
          });

        }

        this.isLoading = false;

      },

      error: (error) => {

        console.error(
          'Brand List API Error:',
          error
        );

        this.brandList = [];

        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            'Failed to load brand list.'
        });

      }

    });

  }


  // Create / Update

  onSubmit(): void {

    if (this.brandForm.invalid) {

      Object.values(
        this.brandForm.controls
      ).forEach(control => {

        control.markAsDirty();

        control.updateValueAndValidity({
          onlySelf: true
        });

      });

      return;
    }


    const postData = {
      name: this.brandForm.value.brandName,
      isActive: this.brandForm.value.isActive
    };


    // Update

    if (this.editingId !== null) {

      this.brandService .updateBrand(
          postData,
          this.editingId
        )
        .subscribe({

          next: (response) => {

            if (
              response.statusCode === 200
            ) {

              Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text:
                  response.message ||
                  'Brand updated successfully.',
                timer: 1500,
                showConfirmButton: false
              });

              this.resetForm();

              this.getBrands();

            } else {

              Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text:
                  response.message ||
                  'Failed to update brand.'
              });

            }

          },

          error: (error) => {

            console.error(
              'Update Brand Error:',
              error
            );

          }

        });

      return;
    }


    // Create
    

    this.brandService.saveBrand(postData)
      .subscribe({

        next: (response) => {

          if (
            response.statusCode === 200 ||
            response.statusCode === 201
          ) {

            Swal.fire({
              icon: 'success',
              title: 'Saved!',
              text:
                response.message ||
                'Brand saved successfully.',
              timer: 1500,
              showConfirmButton: false
            });

            this.resetForm();

            this.getBrands();

          } else {

            Swal.fire({
              icon: 'error',
              title: 'Save Failed',
              text:
                response.message ||
                'Failed to save brand.'
            });

          }

        },

        error: (error) => {

          console.error(
            'Save Brand Error:',
            error
          );

        }

      });

  }


  // Edit Brand

  editBrand(brand: Brand): void {

    if (!brand.id) {
      return;
    }

    this.editingId = brand.id;

    this.brandForm.patchValue({

      brandName: brand.name,

      isActive:
        brand.isActive

    });

  }


  // Delete Brand

  deleteBrand(id?: number): void {

    if (!id) {
      return;
    }


    Swal.fire({

      title: 'Are you sure?',

      text:
        'Do you really want to delete this brand?',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#3085d6',

      cancelButtonColor: '#d33',

      confirmButtonText:
        'Yes, delete it!'

    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }


      this.brandService
        .deleteBrand(id)
        .subscribe({

          next: (response) => {

            if (
              response.statusCode === 200
            ) {

              Swal.fire({

                icon: 'success',

                title: 'Deleted!',

                text:
                  response.message ||
                  'Brand deleted successfully.',

                timer: 1500,

                showConfirmButton: false

              });

              this.getBrands();

            } else {

              Swal.fire({

                icon: 'error',

                title: 'Delete Failed',

                text:
                  response.message ||
                  'Failed to delete brand.'

              });

            }

          },

          error: (error) => {

            console.error(
              'Delete Brand Error:',
              error
            );

          }

        });

    });

  }


  resetForm(): void {

    this.brandForm.reset({

      brandName: '',

      isActive: true

    });

    this.editingId = null;

  }

}