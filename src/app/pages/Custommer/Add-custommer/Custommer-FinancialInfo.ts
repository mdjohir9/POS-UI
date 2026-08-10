import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { ICustomerDetailes } from 'src/app/core/models/interfaces/ICustommerDetailes';
import { CustommerService } from 'src/app/core/services/custommerService';
@Component({
  selector: 'custommer-financialInfo',
  template: `
  <form class="max-w-full" nz-form [formGroup]="validateForm" (ngSubmit)="submitFinancialForm()">

    <nz-form-control class="mb-[20px]" nzErrorTip="The Bank Name is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtBankName" nzRequired>Bank Name
        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="txtBankName" id="txtBankName" placeholder="Bank Name" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The Account No Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
        nzFor="txtAccountNo" nzRequired>
        Account No
      </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input id="txtAccountNo" formControlName="txtAccountNo" placeholder="Account No" />
    </nz-form-control>

    <nz-form-control class="mb-[20px]" nzErrorTip="The Monthly Income Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtMonthlyInc" nzRequired>Monthly Income
        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtMonthlyInc" id="txtMonthlyInc" placeholder="Monthly Income" />
    </nz-form-control>
    <nz-form-control>
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtMonthlyExpenses">Monthly Expenses

        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtMonthlyExpenses" id="txtMonthlyExpenses" placeholder="Monthly Expenses" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtAssetsOwned">Assets Owned 
        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtAssetsOwned" id="txtAssetsOwned" placeholder="Assets Owned" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtLiabilities">Liabilities</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtLiabilities" id="txtLiabilities" placeholder="Liabilities" />
    </nz-form-control>

  </form>  
`,
styles: [`
  :host ::ng-deep .review .ant-checkbox-checked::after,
  :host ::ng-deep .review .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  :host ::ng-deep .review .ant-checkbox:hover .ant-checkbox-inner,
  :host ::ng-deep .review .ant-checkbox-input:focus + .ant-checkbox-inner{
    @apply border-success;
  }
  :host ::ng-deep .review .ant-checkbox-checked .ant-checkbox-inner{
    @apply bg-success border-success;
  }
`]
})

export class CustommerFinancialInfoComponent {
  @Output() formFinancialSubmitted = new EventEmitter<any>(); // Emit data to parent

  validateForm!: UntypedFormGroup;
  financialData: ICustomerDetailes | null = null;

  constructor(private fb: UntypedFormBuilder, private Custommer: CustommerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      txtBankName: [null, [Validators.required]],
      txtAccountNo: [null, [Validators.required]],
      txtMonthlyInc: [null, [Validators.required]],
      txtMonthlyExpenses: [null],
      txtAssetsOwned: [null],
      txtLiabilities: [null]
    });
    const customerId = sessionStorage.getItem('__customerID__');

    if (customerId) {
      console.log("Editing Customer ID from session:", customerId);
      this.getFinancialInfo(customerId);
    } else {
      console.log("Adding New Customer");
    }
  }

  getFinancialInfo(customerId:any): void {

      this.Custommer.getCustommerInfo(customerId).subscribe(
        (customerList) => {
          if (customerList && customerList.length > 0) {
            this.financialData = customerList[0];
            this.populateForm(this.financialData);
          } else {
            console.warn('No financial data found for the provided customer ID.');
          }
        },
        (error) => {
          console.error('Error fetching financial info:', error);
        }
      );
  }
  

  // Populate the form with retrieved data
  populateForm(data: ICustomerDetailes): void {
    setTimeout(() => {
      this.validateForm.patchValue({
        txtBankName: data.bankName || null,
        txtAccountNo: data.accountNumber || null,
        txtMonthlyInc: data.monthlyIncOrBusnRev || 0,
        txtMonthlyExpenses: data.monthlyExpenses || 0,
        txtAssetsOwned: data.assetsOwned || null,
        txtLiabilities: data.liabilities || null
      });
    });
  }

  // Submit Form Data
  submitFinancialForm(): boolean {
    if (this.validateForm.valid) {
      return true;
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return false;
    }
  }
}
