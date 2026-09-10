import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {CustommerService} from 'src/app/core/services/custommerService';
import { ICustommer } from 'src/app/core/models/interfaces/ICustommer';

@Component({
  selector: 'app-pos-customer',
  standalone: false,
  templateUrl: './pos-customer.component.html',
  styleUrl: './pos-customer.component.css'
})
export class PosCustomerComponent {
   [x: string]: any;
private fb = inject(FormBuilder);
private customerService = inject(CustommerService);
  customerForm!: FormGroup;
  isEditMode = false;
  searchQuery = '';
  editCustomerId: number = 0;
  // Demo Dataset matching API
  customers: ICustommer[] = [];

  filteredCustomers: ICustommer[] = [];

  ngOnInit(): void {
    this.initForm();
    //this.filteredCustomers = [...this.customers];
    this.getCustomers();
  }
    initForm(): void {
    this.customerForm = this.fb.group({
      customerCode: [`CUST-${Date.now().toString().slice(-4)}`, [Validators.required]],
      customerName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: [''],
      isActive: [true]
    });
  }
 getCustomers(): void {
  this.customerService.getCustomers().subscribe({
    next: (response) => {
      console.log('Customer Response:', response);

      if (response.statusCode === 200) {
        this.customers = response.data || [];
        this.filteredCustomers = [...this.customers];
      } else {
        this.customers = [];
        this.filteredCustomers = [];
        this.message.error(response.message || 'Customer not found.');
      }
    },
    error: (error) => {
      console.error('Customer API Error:', error);
      this.customers = [];
      this.filteredCustomers = [];
      this.message.error('Failed to load customers.');
    }
  });
}

 onSubmit(): void {
  if (this.customerForm.invalid) {
    Object.values(this.customerForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    return;
  }

  const payload: ICustommer = this.customerForm.value;

  if (this.isEditMode) {
    this.updateCustomer(payload,this.editCustomerId);
  } else {
    this.saveCustomer(payload);
  }
}

saveCustomer(payload: ICustommer): void {
  this.customerService.saveCustommer(payload).subscribe({
    next: (response) => {
      if (response.statusCode === 200 || response.statusCode === 201) {
        Swal.fire('Saved!', response.message || 'Customer created successfully.', 'success');
        this.getCustomers();
        this.resetForm();
      } else {
        Swal.fire('Error!', response.message || 'Failed to save customer.', 'error');
      }
    },
    error: (error) => {
      console.error('Save Customer Error:', error);
      Swal.fire('Error!', 'Failed to save customer.', 'error');
    }
  });
}

  filterData(): void {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredCustomers = [...this.customers];
      return;
    }
    this.filteredCustomers = this.customers.filter(c =>
      c.customerCode.toLowerCase().includes(q) ||
      c.customerName.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  }

  editCustomer(customer: ICustommer, Id:number): void {
    this.isEditMode = true;
      this.editCustomerId = Id;
    this.customerForm.patchValue(customer);
  }
  updateCustomer(payload: ICustommer,Id :number): void {
  this.customerService.updateCustommerInfo(payload,Id).subscribe({
    next: (response) => {
      if (response.statusCode === 200) {
        Swal.fire('Updated!', response.message || 'Customer updated successfully.', 'success');
        this.getCustomers();
        this.resetForm();
      } else {
        Swal.fire('Error!', response.message || 'Failed to update customer.', 'error');
      }
    },
    error: (error) => {
      console.error('Update Customer Error:', error);
      Swal.fire('Error!', 'Failed to update customer.', 'error');
    }
  });
}

deleteCustomer(Id: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to delete customer ${Id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0B3B60',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes, Delete'
  }).then((result) => {
    if (result.isConfirmed) {

      this.customerService.DeleteCustomerByeId(Id).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            Swal.fire(
              'Deleted!',
              response.message || 'Customer deleted successfully.',
              'success'
            );

            this.getCustomers();
          } else {
            Swal.fire(
              'Error!',
              response.message || 'Failed to delete customer.',
              'error'
            );
          }
        },
        error: (error) => {
          console.error('Delete Customer Error:', error);
          Swal.fire('Error!', 'Failed to delete customer.', 'error');
        }
      });

    }
  });
}

  resetForm(): void {
    this.isEditMode = false;
    this.customerForm.reset();
    this.initForm();
  }
 
}
