import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { LoanService } from 'src/app/core/services/LoanService';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { RechargeService } from 'src/app/core/services/recharge.service';
import { ICustomerIDName } from 'src/app/core/models/interfaces/ICustomerIDName';
import Swal from 'sweetalert2';
import { WithdrawService } from 'src/app/core/services/withdraw.service';

@Component({
  selector: 'app-reachrage',
  standalone: false,

  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent implements OnInit {
  isLoading = true;
  validateForm!: FormGroup;
  paymentMethods: { id: number, name: string }[] = [];
  rechargeAccounts: any[] = [];
  selectRechargeAccount: number = 0;
  fileList: NzUploadFile[] = [];
  allFilesBase64: { name: string; base64: string }[] = [];
  constructor(private fb: FormBuilder, private withdrawService: WithdrawService,private loanService: LoanService,  private message: NzMessageService) {}

  ngOnInit(): void {
    // Load payment methods
    this.getCustommer();
    this.getPaymentMethods();

    // Initialize the form group
    this.validateForm = this.fb.group({
      ddlCustommer:[null , [Validators.required]],
      ddlPaymentMethod: [null, [Validators.required]],
      ddlBank: [null, [Validators.required]],
      txtAccountNo: [null, [Validators.required]],
      txtAmount: [null, [Validators.required]],
    });

        this.validateForm.get('ddlPaymentMethod')?.valueChanges.subscribe(
      (paymentMethodId) => {
        this.onPaymentMethodChange(paymentMethodId);
      }
    );

  
  }


    onPaymentMethodChange(paymentMethodId: number): void {
    if (paymentMethodId) {
      this.loanService.getRechargeAccountsByPaymentType(paymentMethodId).subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            const activeAccounts = response.data.filter((acc) => acc.isActive);
            this.rechargeAccounts = [
              { id: null, bankOrWalletName: '---Select---' },
              ...activeAccounts,
            ];
            this.validateForm.get('ddlBank')?.setValue(null); // Reset bank selection
          } else {
            console.error('Error fetching recharge accounts:', response.message);
          }
        },
        (error) => {
          console.error('API Error:', error);
          this.rechargeAccounts = [];
        }
      );
    } else {
      this.rechargeAccounts = [];
    }
  }


  // Get the list of payment methods from the service
  getPaymentMethods() {
    this.loanService.getPaymentMethods().subscribe((res) => {
      if (res.statusCode === 200) {
        this.paymentMethods = res.data;
      }
    });
  }
  bankDetails: any = {
    accountName: '',
    accountNumber: ''
  };
  

  
 
  CustomerIdName: { customerID: number, fullName: string }[] = [];

  selectCustomer: number = 0;
  getCustommer() {
    this.loanService.getCustommerIdName().subscribe(
      (response: IApiResponse<ICustomerIDName[]>) => {
        if (response.statusCode === 200) {

          this.CustomerIdName = [{ customerID: null, fullName: '-----Select----' }, ...response.data];
          this.selectCustomer = null;
        } else {
          console.error('Error fetching employees:', response.message);
        }
      },
      error => {
        console.error('API Error:', error);
      }
    );
  }
  
  // Handle form submission
  submitWithdraw(): void {
    if (this.validateForm.invalid) {
      this.validateForm.markAllAsTouched();
      return;
    }
     const userId = Number(sessionStorage.getItem('__useId__')); // <-- Get user ID from session

    if (!userId) {
      this.message.error('User session expired. Please log in again.');
      return;
    }
    this.isLoading = true;
  
    const withdrawData = {
      paymentMethodID: this.validateForm.value.ddlPaymentMethod,
      bankName: String(this.validateForm.value.ddlBank),
      accountNumber: this.validateForm.value.txtAccountNo,
      amount: this.validateForm.value.txtAmount,
      custommerID: this.validateForm.value.ddlCustommer,
      userId:userId,
    };
  
    this.withdrawService.saveWithdrawRequest(withdrawData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Withdraw request submitted successfully', response);
  
        Swal.fire('Success', 'Withdraw request submitted successfully!', 'success');
        this.validateForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting withdraw request:', error);
  
      }
    });
  }
  



}