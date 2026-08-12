import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
interface CustomerModel {
  customerCode: string;
  customerName: string;
  phone: string;
  address: string;
  isActive: boolean;
}
@Component({
  selector: 'app-pos-customer',
  standalone: false,
  templateUrl: './pos-customer.component.html',
  styleUrl: './pos-customer.component.css'
})
export class PosCustomerComponent {
private fb = inject(FormBuilder);

  customerForm!: FormGroup;
  isEditMode = false;
  searchQuery = '';

  // Demo Dataset matching API
  customers: CustomerModel[] = [
    {
      customerCode: 'CUST-001',
      customerName: 'Rahim Apparel Ltd.',
      phone: '+8801711223344',
      address: 'House 12, Road 5, Uttara, Dhaka',
      isActive: true
    },
    {
      customerCode: 'CUST-002',
      customerName: 'Fashion Warehouse',
      phone: '+8801822334455',
      address: 'Agrabad C/A, Chittagong',
      isActive: true
    },
    {
      customerCode: 'CUST-003',
      customerName: 'Knitwear Traders',
      phone: '+8801933445566',
      address: 'Narayanganj BSCIC',
      isActive: false
    }
  ];

  filteredCustomers: CustomerModel[] = [];

  ngOnInit(): void {
    this.initForm();
    this.filteredCustomers = [...this.customers];
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

  editCustomer(customer: CustomerModel): void {
    this.isEditMode = true;
    this.customerForm.patchValue(customer);
  }

  deleteCustomer(code: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete customer ${code}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0B3B60',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customers = this.customers.filter(c => c.customerCode !== code);
        this.filterData();
        Swal.fire('Deleted!', 'Customer record removed successfully.', 'success');
      }
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.customerForm.reset();
    this.initForm();
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const payload: CustomerModel = this.customerForm.value;

      if (this.isEditMode) {
        const index = this.customers.findIndex(c => c.customerCode === payload.customerCode);
        if (index !== -1) {
          this.customers[index] = payload;
        }
        Swal.fire('Updated!', 'Customer updated successfully.', 'success');
      } else {
        this.customers.unshift(payload);
        Swal.fire('Saved!', 'New customer created successfully.', 'success');
      }

      console.log('Customer API Payload:', JSON.stringify(payload, null, 2));
      this.filterData();
      this.resetForm();
    } else {
      Object.values(this.customerForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }
}
