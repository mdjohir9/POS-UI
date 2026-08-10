import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { ICustomerDetailes } from 'src/app/core/models/interfaces/ICustommerDetailes';
import { CustommerService } from 'src/app/core/services/custommerService';
@Component({
  selector: 'custommer-employment',
  template: `
  <form class="max-w-full" nz-form [formGroup]="validateForm" (ngSubmit)="submitEmploymentForm()">
  <nz-form-control class="mb-[20px]" nzErrorTip="The Gender is Required!">
  <nz-form-label
    class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
    nzFor="ddlEmploymentType" nzRequired>
    Employment Type
  </nz-form-label>
  <nz-select formControlName="ddlEmploymentType"
    class="w-full capitalize [&>nz-select-top-control]:border-normal dark:[&>nz-select-top-control]:border-white/10 [&>nz-select-top-control]:bg-white [&>nz-select-top-control]:dark:bg-white/10 [&>nz-select-top-control]:shadow-none [&>nz-select-top-control]:text-dark [&>nz-select-top-control]:dark:text-white/60 [&>nz-select-top-control]:h-[50px] [&>nz-select-top-control]:flex [&>nz-select-top-control]:items-center [&>nz-select-top-control]:rounded-[6px] [&>nz-select-top-control]:px-[20px] [&>.ant-select-arrow]:text-theme-gray dark:[&>.ant-select-arrow]:text-white/60"
    name="ddlEmploymentType">
    <nz-option [nzValue]="'Salaried'" [nzLabel]="'Salaried'"></nz-option>
    <nz-option [nzValue]="'Self-Employed'" [nzLabel]="'Self-Employed'"></nz-option>
    <nz-option [nzValue]="'Business-Owner'" [nzLabel]="'Business-Owner'"></nz-option>
  </nz-select>
</nz-form-control>
    <nz-form-control class="mb-[20px]">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtEmployerOrBusnName" nzRequired >Employer/Business Name
        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="txtEmployerOrBusnName" id="txtEmployerOrBusnName" placeholder="Employer / Business Name" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The Job Title/Business Type Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
        nzFor="txtJobTitleOrBusnType" nzRequired>
        Job Title/Business Type
      </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input id="txtJobTitleOrBusnType" formControlName="txtJobTitleOrBusnType" placeholder="Job or business type" />
    </nz-form-control>

    <nz-form-control class="mb-[20px]" nzErrorTip="Monthly Income/Business Revenue Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtMonthlyIncOrBusnRev"  nzErrorTip="The Monthly Income/Business Revenue Required!" nzRequired>Monthly Income/Business Revenue
        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtMonthlyIncOrBusnRev" id="txtMonthlyIncOrBusnRev" placeholder="Monthly Income/Business Revenue" />
    </nz-form-control>
    <nz-form-control >
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtYearsOfExp" >Years of Experience/Business Age
        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtYearsOfExp" id="txtYearsOfExp" placeholder="Years of Experience/Business Age" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtWorkOrBusnAddress">Work/Business Address
        </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtWorkOrBusnAddress" id="txtWorkOrBusnAddress" placeholder="Work/Business Address" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The Employer/Business Contact is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtEmployerOrBusnContact" nzRequired>Employer / Business Contact</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtEmployerOrBusnContact" id="txtEmployerOrBusnContact" placeholder="Employer/Business" />
    </nz-form-control>

  </form>
`,
})
export class CustommerEmploymentComponent implements OnInit {
  @Output() formEmploymentSubmitted = new EventEmitter<any>(); // Emit data to parent
  employmentData: ICustomerDetailes | null = null;
  validateForm!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private custommerService: CustommerService ,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      ddlEmploymentType: [null, [Validators.required]],
      txtEmployerOrBusnName: [null, [Validators.required]],
      txtJobTitleOrBusnType: [null, [Validators.required]],
      txtMonthlyIncOrBusnRev: [null, [Validators.required]],
      txtYearsOfExp: [null], // now optional
      txtWorkOrBusnAddress: [null],
      txtEmployerOrBusnContact: [null, [Validators.required]]
    });

    const customerId = sessionStorage.getItem('__customerID__');

    if (customerId) {
      console.log("Editing Customer ID from session:", customerId);
      this.getEmploymentInfo(customerId);
    } else {
      console.log("Adding New Customer");
    }
    
  }

  // Fetch Employment Info
  getEmploymentInfo(customerID:any): void {  
      this.custommerService.getCustommerInfo(customerID).subscribe(
        (customerList) => {
          if (customerList && customerList.length > 0) {
            this.employmentData = customerList[0];
            this.populateForm(this.employmentData);
          } else {
            console.warn('No employment data found for the provided customer ID.');
          }
        },
        (error) => {
          console.error('Error fetching employment info:', error);
        }
      );
   
  }
  

  // Populate the form with retrieved data
  populateForm(data: ICustomerDetailes): void {
    this.validateForm.patchValue({
      ddlEmploymentType: data.employmentType || null,
      txtEmployerOrBusnName: data.employerOrBusnName || null,
      txtJobTitleOrBusnType: data.jobTitleOrBusnType || null,
      txtMonthlyIncOrBusnRev: data.monthlyIncOrBusnRev || 0,
      txtYearsOfExp: data.yearsOfExpOrBusnAge || 0,
      txtWorkOrBusnAddress: data.workOrBusnAddress || null,
      txtEmployerOrBusnContact: data.employerOrBusnContact || null
    });
  }
  

  // Submit Form Data
  submitEmploymentForm(): boolean {
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
