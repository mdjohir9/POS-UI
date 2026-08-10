import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { ICustomerIDName } from 'src/app/core/models/interfaces/ICustomerIDName';
import { ILoanApplication } from 'src/app/core/models/interfaces/ILoanApplication';
import { LoanPlanService } from 'src/app/core/services/loanPlanService';
import { LoanService } from 'src/app/core/services/LoanService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-loans',
  standalone: false,
  templateUrl: './add-loans.component.html',
  styleUrl: './add-loans.component.css'
})
export class AddLoansComponent {
  @Output() loanSubmitted = new EventEmitter<any>();
  CustomerIdName: { customerID: number, fullName: string }[] = [];


  isLoading = true;
  showContent = true;
  validateForm!: FormGroup;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';
 
  allDatas: any[] = []; // Store original data
  datas: any[] = [];
  constructor(private fb: UntypedFormBuilder,private loanService: LoanService,private LoanPlan :LoanPlanService, private route :ActivatedRoute,private router:Router) {}

  //Validation check 
/*   loanTypeLimits: { [key: string]: { min: number; max: number } } = {
    '1': { min: 2000, max: 25000 }, // Personal Loan
    '2': { min: 1000, max: 3000 }, // Tourist Loan
    '3': { min: 5000, max: 50000 }, // Car Loan
    '4': { min: 5000, max: 100000 }, // Home Loan
    '5': { min: 10000, max: 10000000 } // Business Loan
  }; */
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



dataAccessLevel: number | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.getCustommer();
    this.getLoanType();
    this.getLoanRequestByCustomer();
   const accessLevel = sessionStorage.getItem('__DataAccessLevel__');
  this.dataAccessLevel = accessLevel ? parseInt(accessLevel, 10) : null;
  }

  initializeForm(): void {
    this.validateForm = this.fb.group({
      ddlCustommer: new FormControl(null, Validators.required),
      ddlLoanType: new FormControl('', Validators.required),
      txtLaonAmount: new FormControl('', [Validators.required]),
      txtRepaymentPreiod: new FormControl('', [Validators.required, Validators.min(3)]),
      txtApplyDate: new FormControl('', Validators.required),
      txtPurposeOfLoan: new FormControl('')
    });

      // Listen for ddlLoanType changes
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


  // In AddLoansComponent
getLoanApplicationData(): any | null {
  if (this.validateForm.invalid) {
    this.validateForm.markAllAsTouched();
    return null;
  }
   const userId = Number(sessionStorage.getItem('__useId__')); // <-- Get user ID from session
 sessionStorage.removeItem('__customerID__');
 sessionStorage.setItem('__customerID__', this.validateForm.value.ddlCustommer);
  return {
    loanAmount: this.validateForm.value.txtLaonAmount,
    repaymentPeriod: this.validateForm.value.txtRepaymentPreiod,
    purposeOfLoan: this.validateForm.value.txtPurposeOfLoan,
    applicationDate: this.formatDate(this.validateForm.value.txtApplyDate),
    userId:userId,
    planID: this.validateForm.value.ddlLoanType,
    customerID: this.validateForm.value.ddlCustommer,
    payMethodID: 1,
  };
}


isValid(): boolean {
  return this.validateForm.valid;
}
  onSubmit(): void {
    if (this.validateForm.invalid) {
      this.validateForm.markAllAsTouched();
      return;
    }
    const userId = Number(sessionStorage.getItem('__useId__')); // <-- Get user ID from session

    if (!userId) {
      Swal.fire('Warning', 'Please  agin login and trye agin !', 'warning');
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
      payMethodID: 1,
      UserId:userId,
    };
 
   this.loanService.saveLoanApplication(loanData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Loan Application submitted successfully', response);

        Swal.fire('Success', 'Loan submitted successfully!', 'success');
        this.getLoanRequestByCustomer();
        this.validateForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting loan:', error);
  
      }
    }); 
    
  }



  private formatDate(date: Date): string {
    return date ? new Date(date).toISOString().split('T')[0] : ''; // Converts to YYYY-MM-DD
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
  


   getLoanRequestByCustomer(): void {
      this.isLoading = true;
      this.showContent = false; // Hide content during loading
    
      setTimeout(() => {
        this.loanService.getLaonApplicationByCustomer().subscribe(
          (response: IApiResponse<ILoanApplication[]>) => {
            this.isLoading = false;
            this.showContent = true;
    
            if (response.statusCode === 200) {
              this.allDatas = response.data || [];
            } else {
              this.allDatas = [];
              console.error('Error fetching loan applications:', response.message);
            }
          },
          error => {
            this.isLoading = false;
            this.showContent = true;
            this.allDatas = [];
            this.datas = [];
            console.error('API Error:', error);
          }
        );
      });
    }
       listOfCurrentPageData: readonly ILoanApplication[] = [];
    
      onCurrentPageDataChange(listOfCurrentPageData: readonly ILoanApplication[]): void {
        this.listOfCurrentPageData = listOfCurrentPageData;
    
        console.log(listOfCurrentPageData);
      }
    
      filterByAnyMetchingData() {
        const searchTerm = this.searchAny.toLowerCase().trim();
      
        if (!searchTerm) {
          this.datas = [...this.allDatas]; // Reset
          this.dataType = 'allDatas'; // Show full list
          return;
        }
      
        this.datas = this.allDatas.filter(custommer =>
          Object.values(custommer).some(value =>
            value?.toString().toLowerCase().includes(searchTerm)
          )
        );
      
        this.dataType = 'datas'; // Show filtered result
      }
      
      
  
}
