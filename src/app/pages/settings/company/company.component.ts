import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
interface Person {
  id: string;
  name: string;
  shipment: string;
  department: string;
  employeeCode: string;
  joinDate: string;
  status: string;
}
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit {
  isLoading = true;
  showContent = false;
  constructor(private fb: UntypedFormBuilder,private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      username: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      zip: [null, [Validators.required]],
      agree: [false]
    });
  }



  loadData() {
    // Simulate an asynchronous data loading operation
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }




  validateForm!: UntypedFormGroup;
  captchaTooltipIcon: NzFormTooltipIcon= {
    type: 'info-circle',
    theme: 'twotone'
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }




  //Company List Start 

  
    value = '';
      statusFilter = '';
      contactSearchValue = '';
      people: Person[] = [];
      filteredPeople: Person[] = [];

    
      searchById(): void {
        if (this.value) {
          this.filteredPeople = this.people.filter(
            (person) => person.id === this.value
          );
        } else {
          this.filteredPeople = this.people;
        }
      }
    
      filterByContact(): void {
        this.filteredPeople = this.applyFilters();
      }
    
      filterByStatus(): void {
        this.filteredPeople = this.applyFilters();
      }
    
      private applyFilters(): Person[] {
        return this.people.filter((person) =>
          person.name.toLowerCase().includes(this.contactSearchValue.toLowerCase())
          && (this.statusFilter === 'all' || person.status.toLowerCase() === this.statusFilter.toLowerCase())
        );
      }
}
