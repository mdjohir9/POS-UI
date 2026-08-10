import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { ICustomerDetailes } from 'src/app/core/models/interfaces/ICustommerDetailes';
import { CustommerService } from 'src/app/core/services/custommerService';
@Component({
  selector: 'custommer-guarantor',
  template: `
  <form class="max-w-full" nz-form [formGroup]="validateForm" (ngSubmit)="submitGuarantorForm()">
    <nz-form-control class="mb-[20px]">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtGuarantorName">Guarantor Name
        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="txtGuarantorName" id="txtGuarantorName" placeholder="Guarantor Name" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The Email is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
        nzFor="txtRelWithApplicant" nzRequired>
       Reletion With Applicant
      </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input id="txtRelWithApplicant" formControlName="txtRelWithApplicant" placeholder="Reletion With Applicent" />
    </nz-form-control>

    <nz-form-control class="mb-[20px]">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtGurantorContact"  nzErrorTip="The Street Or Road Address is Required!">Guarantor Contact
        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtGurantorContact" id="txtGurantorContact" placeholder="Guarantor Contact" />
    </nz-form-control>
    <nz-form-control>
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtGuarantorAddress">Guarantor Address

        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtGuarantorAddress" id="txtGuarantorAddress" placeholder="Guarantor Address" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtGurNatIDOrPassport">Guarantor National ID Or Passport
        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtGurNatIDOrPassport" id="txtGurNatIDOrPassport" placeholder="Guarantor National ID Or Passport" />
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

export class CustommerGuarantorComponent {
  @Output() formGuarantorSubmitted = new EventEmitter<any>(); // Emit data to parent

  validateForm!: UntypedFormGroup;
  financialData: ICustomerDetailes | null = null;

  constructor(private fb: UntypedFormBuilder, private Custommer: CustommerService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      txtGuarantorName: ['', Validators.required],
      txtRelWithApplicant: ['', Validators.required],
      txtGurantorContact: ['', Validators.required],
      txtGuarantorAddress: ['', Validators.required],
      txtGurNatIDOrPassport: ['', Validators.required]
    });
    this.getGurantorInfo();
  }
  getGurantorInfo(): void {
    const customerIdStr = sessionStorage.getItem('__customerID__');
    const customerId = customerIdStr ? parseInt(customerIdStr, 10) : null;

    if (customerId === null) {
      console.error('Invalid customer ID');
      return;
    }

    this.Custommer.getCustommerInfo(customerId).subscribe(
      (customerList) => {
        if (customerList && customerList.length > 0) {
          this.financialData = customerList[0]; 
          this.populateForm(this.financialData); 
        }
      },
      (error) => {
        console.error('Error fetching financial info', error);
      }
    );
  }
  populateForm(data: any): void {
    if (!data) return;
  
    this.validateForm.patchValue({
      txtGuarantorName: data.guarantorFullName || '',
      txtRelWithApplicant: data.relationshipWithApplicant || '',
      txtGurantorContact: data.guarantorContactNumber || '',
      txtGuarantorAddress: data.guarantorAddress || '',
      txtGurNatIDOrPassport: data.guarantorNationalIDOrPassport || ''
    });
  }
  
  submitGuarantorForm(): void {
    if (this.validateForm.valid) {
      const formattedData = this.formatGuarantorData(this.validateForm.value);
      this.formGuarantorSubmitted.emit(formattedData);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }

  formatGuarantorData(formData: any): any {
    return {
      customerID: sessionStorage.getItem('__customerID__') ? parseInt(sessionStorage.getItem('__customerID__')!, 10) : null,
      guarantorName: formData.txtGuarantorName || null,
      relationshipWithApplicant: formData.txtRelWithApplicant || null,
      guarantorContact: formData.txtGuarantorContact || null,
      guarantorAddress: formData.txtGuarantorAddress || null,
      guarantorNationalIDOrPassport: formData.txtGurNatIDOrPassport || null
    };
  }
}
