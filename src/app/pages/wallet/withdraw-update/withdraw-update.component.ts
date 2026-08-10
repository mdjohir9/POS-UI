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
import { switchMap, timer } from 'rxjs';
import { ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-withdraw-update',
  templateUrl: './withdraw-update.component.html',
  styleUrl: './withdraw-update.component.css'
})
export class WithdrawUpdateComponent {
 isLoading = true;
  validateForm!: FormGroup;
  paymentMethods: { id: number, name: string }[] = [];
  rechargeAccounts: any[] = [];
  selectRechargeAccount: number = 0;
  fileList: NzUploadFile[] = [];
  allFilesBase64: { name: string; base64: string }[] = [];

  showContent = false;
  constructor(private fb: FormBuilder, private withdrawService: WithdrawService,private loanService: LoanService,  private message: NzMessageService, private router:Router,private route: ActivatedRoute) {}
  private  UpdateId : any;
  ngOnInit(): void {
    // Load payment methods
    this.getCustommer();
    this.getPaymentMethods();



    this.validateForm = this.fb.group({
      ddlCustommer:[null , [Validators.required]],
      ddlPaymentMethod: [null, [Validators.required]],
      ddlBank: [null, [Validators.required]],
      txtAccountNo: [null, [Validators.required]],
      txtAmount: [null, [Validators.required]],
    });

    // Subscribe to value changes of the Payment Method dropdown

    this.validateForm.get('ddlPaymentMethod')?.valueChanges.subscribe(
      (paymentMethodId) => {
        this.onPaymentMethodChange(paymentMethodId);
      }
    );

    this.route.paramMap.subscribe(params => {
      const rechargeIdParam = params.get('id'); // assuming route is like /loan-plan/:id
      const withDrawId = rechargeIdParam ? +rechargeIdParam : null;
      this.UpdateId = withDrawId;
      if (withDrawId) {
        this.getWithdrawRequestById(withDrawId);
      } else {
        console.warn('Invalid or missing plan ID in route.');
      }
    });

  
  }


  getWithdrawRequestById(withdrawId: number): void {
    timer(1000).pipe(
      switchMap(() => this.withdrawService.getWithdrawtById(withdrawId))
    ).subscribe(
      (response) => {
        if (response && response.statusCode === 200 && response.data) {
          const RechargeInfo = response.data;
          this.populateWithdrawForm(RechargeInfo);
          
        } else {
          console.warn('No loan plan data found for the provided ID.');
        }
      },
      (error) => {
        console.error('Error fetching loan plan:', error);
      }
    );
  }
populateWithdrawForm(data: any): void {
  if (!data) return;

  // Patch all fields except ddlBank
  this.validateForm.patchValue({
    ddlCustommer: data.custommerID ?? null,
    ddlPaymentMethod: data.paymentMethodID ?? null,
    txtAccountNo: data.accountNumber ?? '',
    txtAmount: data.amount ?? ''
  });

  const checkAndSetBank = () => {
    const interval = setInterval(() => {
      const found = this.rechargeAccounts.find(x => x.id === data.bankId);
      if (found) {
        this.validateForm.get('ddlBank')?.setValue(data.bankId);
         // optional, if you want bank details to be filled
        clearInterval(interval);
      }
    }, 100); // check every 100ms
  };

  checkAndSetBank();


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
            this.validateForm.get('ddlBank')?.setValue(null); 
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
          this.showContent=true;
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
      bankId: this.validateForm.value.ddlBank,
      accountNumber: this.validateForm.value.txtAccountNo,
      amount: this.validateForm.value.txtAmount,
      custommerID: this.validateForm.value.ddlCustommer,
      userId:userId,
    };
  
    this.withdrawService.UpdateWithdrawRequest(withdrawData,this.UpdateId).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Withdraw request submitted successfully', response);
  
        Swal.fire('Success', 'Withdraw request submitted successfully!', 'success');
        this.validateForm.reset();
        this.router.navigate(['/wallet/all-withdraw']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting withdraw request:', error);
  
      }
    });
  }
  
}
