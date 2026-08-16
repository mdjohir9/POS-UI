import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Company {
  id?: number;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyForm!: FormGroup;
  editingId: number | null = null;

  // Sample Data List
  companyList: Company[] = [
    { id: 1, companyName: 'Next POS Solutions', email: 'info@nextpos.com', phone: '+8801700000000', address: 'Dhaka, Bangladesh', isActive: true }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required]],
      email: [''],
      phone: [''],
      address: [''],
      isActive: [true]
    });
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      if (this.editingId !== null) {
        const index = this.companyList.findIndex(c => c.id === this.editingId);
        if (index !== -1) {
          this.companyList[index] = {
            id: this.editingId,
            ...this.companyForm.value
          };
        }
        this.editingId = null;
      } else {
        const newCompany: Company = {
          id: this.companyList.length + 1,
          ...this.companyForm.value
        };
        this.companyList = [...this.companyList, newCompany];
      }
      this.resetForm();
    } else {
      Object.values(this.companyForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  editCompany(company: Company): void {
    if (company.id) {
      this.editingId = company.id;
      this.companyForm.patchValue({
        companyName: company.companyName,
        email: company.email,
        phone: company.phone,
        address: company.address,
        isActive: company.isActive
      });
    }
  }

  deleteCompany(id?: number): void {
    if (id) {
      this.companyList = this.companyList.filter(c => c.id !== id);
    }
  }

  resetForm(): void {
    this.companyForm.reset({
      companyName: '',
      email: '',
      phone: '',
      address: '',
      isActive: true
    });
    this.editingId = null;
  }
}