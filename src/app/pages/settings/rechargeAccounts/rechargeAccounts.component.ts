import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { LoanService } from 'src/app/core/services/LoanService';
import { SettingsService } from 'src/app/core/services/settingsService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department',
  templateUrl: './rechargeAccounts.component.html',
  styleUrl: './rechargeAccounts.component.css'
})
export class RechargeAccountsComponent {
 isLoading = true;
  showContent = false;
  allDatas: any[] = []; 
  datas: any[] = [];
  constructor(private fb: UntypedFormBuilder,private http: HttpClient, private settingsService : SettingsService, private loanService : LoanService) {}

  ngOnInit(): void {
    this.getRechargeAccounts();
    this.getPaymentMethods();
    this.validateForm = this.fb.group({
      ddlPaymentMethod: [null, [Validators.required]],
      txtBankName: [null, [Validators.required, Validators.maxLength(100)]],
      txtAccountName: [null,[ Validators.maxLength(100)]],
      txtAccountNumber: [null, [Validators.required]],
      ddlIsActive: [null, [Validators.required]]
    });


  }


  getRechargeAccounts(): void {
  this.settingsService.getRechargeAccountList().subscribe({
    next: (response) => {
      if (response.statusCode === 200) {
        this.allDatas = response.data;
        this.showContent = true;
      }
    },
    error: (err) => {
      console.error('Failed to load recharge data:', err);
      this.showContent = true;
    }
  });
}

  validateForm!: UntypedFormGroup;
  captchaTooltipIcon: NzFormTooltipIcon= {
    type: 'info-circle',
    theme: 'twotone'
  };

editMode: boolean = false;
editId: number | null = null;

submitForm(): void {
  if (this.validateForm.valid) {
    const payload = {
      recPaymentMethodId: this.validateForm.value.ddlPaymentMethod,
      bankOrWalletName: this.validateForm.value.txtBankName,
      accountName: this.validateForm.value.txtAccountName,
      accountNumber: this.validateForm.value.txtAccountNumber,
      isActive: this.validateForm.value.ddlIsActive === '1' ? true : false
    };

    if (this.editMode) {
      // Update
      this.settingsService.updateRechargeAccount(payload, this.editId ).subscribe({
        next: (res) => {
          Swal.fire('Updated', 'Recharge account updated successfully!', 'success');
          this.validateForm.reset();
           this.getRechargeAccounts();
           this.editMode==false;
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      // Create
      this.settingsService.saveRechargeAccount(payload).subscribe({
        next: (res) => {
          Swal.fire('Created', 'Recharge account created successfully!', 'success');
          this.validateForm.reset();
          this.getRechargeAccounts();
        },
        error: (err) => console.error('Create failed', err)
      });
    }
  }
}
  paymentMethods: { id: number, name: string }[] = [];

  getPaymentMethods() {
    this.loanService.getPaymentMethods().subscribe((res) => {
      if (res.statusCode === 200) {
        this.paymentMethods = res.data;
      }
    });
  }

editRechargeAccount(id: number): void {
  this.settingsService.getRechargeAccountById(id).subscribe({
    next: (res) => {
      const data = res.data;
      this.editMode = true;
      this.editId = id;

      this.validateForm.patchValue({
        ddlPaymentMethod: data.recPaymentMethodId,
        txtBankName: data.bankOrWalletName,
        txtAccountName: data.accountName,
        txtAccountNumber: data.accountNumber,
        ddlIsActive: data.isActive ? '1' : '0'
      });
    },
    error: (err) => console.error('Failed to load account data', err)
  });
}


deleteRechargeAccount(id: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this record!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.settingsService.DeleteRechargeAccountByeId(id).subscribe({
        next: () => {
          Swal.fire('Deleted!', 'Recharge account has been deleted.', 'success');
          this.getRechargeAccounts(); // Refresh list
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  });
}


}
