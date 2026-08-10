import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { LoanPlanService } from 'src/app/core/services/loanPlanService';
import Swal from 'sweetalert2';
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
  selector: 'app-loan-plans',
  standalone: false,
  templateUrl: './loan-plans.component.html',
  styleUrl: './loan-plans.component.css'
})
export class LoanPlansComponent {
isLoading = true;
  showContent = false;
  constructor(private fb: UntypedFormBuilder,private http: HttpClient , private LoanPlan : LoanPlanService) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.showContent = true;
    this.validateForm = this.fb.group({
      txtPlanName: [null, [Validators.required]],
      txtMaximumAmount: [null, [Validators.required]],
      txtMinimumAmount: [null, [Validators.required]],
      txtIntarestRate: [null, [Validators.required]],
      txtMaxRePaymentMonth : [null, [Validators.required]],
      txtMinRepaymentMonth : [null, [Validators.required]],
      txtProcessingFee : [ null, [Validators.required]],
      txtLateFee : [null , [Validators.required]],
      txtDiscraption: [null, [Validators.required]],
      rdlIsActive:new FormControl (),
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
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }
  
    const planData = {
      planName: this.validateForm.value.txtPlanName,
      minAmount: this.validateForm.value.txtMinimumAmount,
      maxAmount: this.validateForm.value.txtMaximumAmount,
      interestRate: this.validateForm.value.txtIntarestRate,
      minRepaymentPeriod: this.validateForm.value.txtMinRepaymentMonth,
      maxRepaymentPeriod: this.validateForm.value.txtMaxRePaymentMonth,
      processingFee: this.validateForm.value.txtProcessingFee,
      latePaymentPenalty: this.validateForm.value.txtLateFee,
      descraption: this.validateForm.value.txtDiscraption,
      isActive: this.validateForm.value.rdlIsActive ? 1 : 0
    };
  
    this.isLoading = true;
    this.LoanPlan.saveLoanPlan(planData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire('Success', 'Loan plan submitted successfully!', 'success');
        this.validateForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting loan plan:', error);
      }
    });
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
