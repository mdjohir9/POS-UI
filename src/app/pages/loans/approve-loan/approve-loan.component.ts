import { Component } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { ICustomerIDName } from 'src/app/core/models/interfaces/ICustomerIDName';
import { ICustommer } from 'src/app/core/models/interfaces/ICustommer';
import { ILoanApplication } from 'src/app/core/models/interfaces/ILoanApplication';
import { LoanService } from 'src/app/core/services/LoanService';
import { CustommerService } from 'src/app/core/services/custommerService';
import { LoanPlanService } from 'src/app/core/services/loanPlanService';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-approve-loan',
  standalone: false,
  templateUrl: './approve-loan.component.html',
  styleUrl: './approve-loan.component.css'
})
export class ApproveLoanComponent {
  CustomerIdName: { customerID: number, fullName: string }[] = [];

  isLoading = true;
  showContent = true;
  validateForm!: FormGroup;
  personnelData: ICustommer | null = null;
  constructor(private fb: UntypedFormBuilder,private loanService: LoanService,private LoanPlan : LoanPlanService,private Custommer: CustommerService,private route: ActivatedRoute,private  router:Router ) {}


  currentMinAmount: number = 0;
  currentMaxAmount: number = 0;
  currentMinTenure: number = 0;
  currentMaxTenure: number = 0;

updateLoanAmountValidators(selectedLoanType: string): void {
  this.loanService.getLoanLimitsByPlanId(selectedLoanType).subscribe({
    next: ({ minAmount, maxAmount, minRepaymentPeriod, maxRepaymentPeriod }) => {
      this.currentMinAmount = minAmount;
      this.currentMaxAmount = maxAmount;
      this.currentMinTenure = minRepaymentPeriod;
      this.currentMaxTenure = maxRepaymentPeriod;

      const amountControl = this.validateForm.get('txtLaonAmount');
      const tenureControl = this.validateForm.get('txtRepaymentPreiod');

      if (amountControl) {
        amountControl.clearValidators();
        amountControl.setValidators([
          Validators.required,
          Validators.min(minAmount),
          Validators.max(maxAmount)
        ]);
        amountControl.updateValueAndValidity();
      }

      if (tenureControl) {
        tenureControl.clearValidators();
        tenureControl.setValidators([
          Validators.required,
          Validators.min(minRepaymentPeriod),
          Validators.max(maxRepaymentPeriod)
        ]);
        tenureControl.updateValueAndValidity();
      }
    },
    error: err => console.error('Failed to fetch loan limits', err)
  });
}





  ngOnInit(): void {
    this.initializeForm();
    this.getCustommer();
    this.getLoanType();
    this.route.paramMap.subscribe(params => {
      const customerId = params.get('id');
      if (customerId) {
        // Convert the customerId to an integer
        const parsedCustomerId = parseInt(customerId, 10);
  
        // Ensure it's a valid number
        if (!isNaN(parsedCustomerId)) {
          this.getLoanApplicationInfo(parsedCustomerId);
        } else {
          console.error('Invalid Customer ID');
        }
      } else {
        // Handle the case where 'id' is not present in the route
        console.error('Customer ID not found in route parameters');
      }
    });
  }

  initializeForm(): void {
    this.validateForm = this.fb.group({
      ddlCustommer: new FormControl({ value: null, disabled: true },   Validators.required),
      ddlLoanType: new FormControl('', Validators.required),
      txtLaonAmount: new FormControl('', [Validators.required]),
      txtRepaymentPreiod: new FormControl('', [Validators.required, Validators.min(3)]),
      txtApplyDate: new FormControl('', Validators.required),
      txtPurposeOfLoan: new FormControl('')
    });

   
    this.validateForm.get('ddlLoanType')?.valueChanges.subscribe((selectedLoanType) => {
    this.updateLoanAmountValidators(selectedLoanType);
  });


    this.validateForm.valueChanges.subscribe(() => {
    const loanAmount = this.validateForm.get('txtLaonAmount')?.value;
    const planID = this.validateForm.get('ddlLoanType')?.value;
    const repaymentPeriod = this.validateForm.get('txtRepaymentPreiod')?.value;

    // Only call if all values are present and valid
    if (this.validateForm.valid && loanAmount && planID && repaymentPeriod) {
      this.GetLoanDetails(loanAmount, planID, repaymentPeriod);
    }
  });
  }



  onSubmit(): void {
    if (this.validateForm.invalid) {
      this.validateForm.markAllAsTouched();
      return;
    }
     const userId = Number(sessionStorage.getItem('__useId__')); // <-- Get user ID from session
    if (!userId) {
         Swal.fire('warning', 'please Re-Login and trye!', 'warning');
      return;
    }
    this.isLoading = true;
    const loanData = {
      loanAmount: this.validateForm.value.txtLaonAmount,
      repaymentPeriod: this.validateForm.value.txtRepaymentPreiod,
      purposeOfLoan: this.validateForm.value.txtPurposeOfLoan,
      applicationDate: this.formatDate(this.validateForm.value.txtApplyDate),

      planID: this.validateForm.value.ddlLoanType, // Assuming ddlLoanType = planID
      customerID: this.validateForm.value.ddlCustommer,
      payMethodID:1,
      userId:userId,
    };
    this.route.paramMap.subscribe(params => {
      const applicationId = params.get('id');
      if (applicationId) {
        this.loanService.approveLoanApplication(applicationId,loanData).subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Loan Approve successfully', response);
            
           Swal.fire('Success', 'Loan Approve successfully!', 'success');
            this.validateForm.reset();
            this.router.navigate(['/loan/loan-request-list']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error submitting loan:', error);
          //  alert('Failed to Approve loan. Please try again.');
            Swal.fire('Approval Failed', 'Loan approval could not be completed. Please try again.', 'error');

          }
        });
      } else {
        // Handle the case where 'id' is not present in the route
        console.error('Customer ID not found in route parameters');
      }
    });
 
  }

  private formatDate(date: Date): string {
    return date ? new Date(date).toISOString().split('T')[0] : ''; // Converts to YYYY-MM-DD
  }


onReject(): void {
  this.route.paramMap.subscribe(params => {
    const applicationId = params.get('id');
    if (applicationId) {
      this.isLoading = true;

      this.loanService.rejectLoanApplication(applicationId).subscribe({
        next: (response) => {
          this.isLoading = false;
          const successMessage = response?.message || 'Loan rejected successfully!';
          Swal.fire('Success', successMessage, 'success');
          this.validateForm.reset();
           this.router.navigate(['/loan/loan-request-list']);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error?.error?.message || 'Loan rejection could not be completed. Please try again.';
          console.error('Error rejecting loan:', error);
          Swal.fire('Rejection Failed', errorMessage, 'warning');
        }
      });

    } else {
      console.error('Application ID not found in route parameters');
      Swal.fire('warning', 'Application ID not found.', 'warning');
    }
  });
}



  
  LoanSummary: any = {
    monthlyInstallment: '',
    totalInterest: '',
    totalPayable: '',
    depositAmount: '',
    lateCharge: ''
  };
  
  GetLoanDetails(loanAmount: number, planID: number, repaymentPeriod: number): void {
    if (!loanAmount || !planID || !repaymentPeriod) {
      this.LoanSummary = {
        monthlyInstallment: '',
        totalInterest: '',
        totalPayable: '',
        depositAmount: '',
        lateCharge: ''
      };
      return;
    }
  
    const urlParams = `LoanAmount=${loanAmount}&RepaymentPeriod=${repaymentPeriod}&PlanID=${planID}`;
  
    this.loanService.getLoanEMIDetailes(urlParams).subscribe(
      (response: any) => {
        if (response.statusCode === 200 && response.data) {
          this.LoanSummary = {
            monthlyInstallment: response.data.monthlyInstallment,
            totalInterest: response.data.totalInterest,
            totalPayable: response.data.totalPayable,
            depositAmount: response.data.depositAmount,
            lateCharge: response.data.lateCharge
          };
        } else {
          console.error('Error fetching loan details:', response.message);
          this.resetLoanSummary();
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.resetLoanSummary();
      }
    );
  }
  
  private resetLoanSummary(): void {
    this.LoanSummary = {
      monthlyInstallment: '',
      totalInterest: '',
      totalPayable: '',
      depositAmount: '',
      lateCharge: ''
    };
  }
  
  
  LoanType: any ;
  getLoanType(): void {
    this.LoanPlan.getLaonPlans().subscribe({
      next: (response) => {
        this.LoanType = response.data.map((plan: any) => ({
          planID: plan.planID,
          planName: plan.planName
        }));
      },
      error: (err) => {
        console.error('Failed to load loan plans:', err);
        this.isLoading = false;
        this.showContent = true;
      }
    });
  }

  selectCustomer: number = 0;
  getCustommer() {
    this.loanService.getCustommerIdName().subscribe(
      (response: IApiResponse<ICustomerIDName[]>) => {
        if (response.statusCode === 200) {

          this.CustomerIdName = [{ customerID: null, fullName: '-----Select----' }, ...response.data];
          this.selectCustomer=null;
        } else {
          console.error('Error fetching employees:', response.message);
        }
      },
      error => {
        console.error('API Error:', error);
      }
    );
  }


  customerData: any = null;

  getPersonnelInfo(customerId: number): void {
    this.Custommer.getCustommerInfo(customerId).subscribe(
      (customerList) => {
        if (customerList && customerList.length > 0) {
          this.customerData = customerList[0]; 
       
        }
      },
      (error) => {
        console.error('Error fetching contact info', error);
      }
    );
  }
  
  
  LoanApplicationData: any = null;
  getLoanApplicationInfo(customerId:any): void {
    
    this.loanService.getLoanApplicationByeId( customerId).subscribe(
      (data) => {
        if (data) {
          this.LoanApplicationData = data;
          this.getPersonnelInfo(data.customerID);

          this.populateForm(data); // Populate the form with fetched data
        }
      },
      (error) => {
        console.error('Error fetching personnel info', error);
      }
    );
  }

  // Method to populate the form with retrieved data
  populateForm(data: ILoanApplication): void {
    this.validateForm.patchValue({
      ddlCustommer: data.customerID,
      ddlLoanType: data.planID,
      txtLaonAmount: data.loanAmount,
      txtRepaymentPreiod: data.repaymentPeriod,
      txtApplyDate: data.applicationDate,
      txtPurposeOfLoan: data.purposeOfLoan
      
    });
  }

}
