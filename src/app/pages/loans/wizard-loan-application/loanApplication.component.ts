import { Component, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CustommerService } from 'src/app/core/services/custommerService';
import { ICustommer } from 'src/app/core/models/interfaces/ICustommer';
import { ICustomerDetailes } from 'src/app/core/models/interfaces/ICustommerDetailes';
import { IContact } from 'src/app/core/models/interfaces/IContact';



import { AddLoansComponent } from '../add-loans/add-loans.component';
import { LoanTramsAndConditionComponent} from '../loan-trams-and-condition/loan-trams-and-condition.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ICustomerSave } from 'src/app/core/models/interfaces/ICustomerSave';
import { LoanService } from 'src/app/core/services/LoanService';
@Component({
  selector: 'app-custommer-add',
  templateUrl: './loanApplication.component.html',
  styleUrls: ['./loanApplication.component.scss'],
})

export class LoanApplicationComponent {
  isLoading = true;
  showContent = false;

  @ViewChild(AddLoansComponent) loanApplicationInfo!: AddLoansComponent;
  @ViewChild (LoanTramsAndConditionComponent) loanTramsAndCondition ! : LoanTramsAndConditionComponent;

  current = 0;
  showConfirmation = false;
  isReviewOrderFinished = false;
  customerId: string | null = null; 


  constructor(
    private modalService: NzModalService,
    private Custommer: CustommerService,
    private router: Router,               // ✅ use this
    private route: ActivatedRoute  ,private loanService: LoanService,       // (optional) only if you still need it
  ) {}
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const urlCustomerId = params.get('id'); // Get from URL
  
      if (urlCustomerId) {
        this.customerId = urlCustomerId; // Use URL ID
      } else {
        this.customerId = sessionStorage.getItem('__customerID__'); // Use session ID if URL ID is missing
      }
  
      console.log("Current Customer ID:", this.customerId);
    });
   this.loadData();
    
  }

  loadData() {
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }

  pre(): void {
    this.current -= 1;
  }
loanData: any = null;
next(): void {
  let isValid = false;

  switch (this.current) {
    case 0:
      isValid = this.loanApplicationInfo?.isValid();
      if (isValid) {
        this.loanData = this.loanApplicationInfo.getLoanApplicationData();
      }
      break;
  }

  if (isValid) {
    this.current++;
  }
}


confirm(): void {
  this.modalService.confirm({
    nzTitle: '<span class="text-dark dark:text-white/[.87]">Confirmation</span>',
    nzContent: `
      <div class="text-light dark:text-white/60 text-[15px]">
        Are you sure you want to submit the loan application?
      </div>
    `,
    nzClassName: 'confirm-modal',
    nzOnOk: () => {
      const signatureSave$ = this.loanTramsAndCondition?.submit();

      if (!signatureSave$ || !this.loanData) {
        console.error("Missing signature or loan data.");
        return;
      }

      // Step 1: Save T&C
      signatureSave$.subscribe({
        next: () => {
          // Step 2: Save Loan Application
          this.loanService.saveLoanApplication(this.loanData).subscribe({
            next: () => {
              this.isReviewOrderFinished = true;
              this.showConfirmation = true;
            },
            error: (error) => {
              console.error("Error saving loan:", error);
            }
          });
        },
        error: (err) => {
          console.error("Error saving T&C:", err);
        }
      });
    }
  });
}

      




  

  getStatus(stepIndex: number): string {
    if (this.current > stepIndex) {
      return 'finish';
    } else if (this.current === stepIndex) {
      return 'process';
    } else {
      return 'wait';
    }
  }
}
