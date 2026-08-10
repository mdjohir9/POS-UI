import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';

import {
  NzFormTooltipIcon
} from 'ng-zorro-antd/form';
import { ICustommer } from 'src/app/core/models/interfaces/ICustommer';
import { ICustomerDetailes } from 'src/app/core/models/interfaces/ICustommerDetailes';
import { CustommerService } from 'src/app/core/services/custommerService';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'custommer-contact',
  template: `
<div>
  <h4 class="text-[20px] font-medium mb-[20px] text-dark dark:text-white/[.87]">2. Please Setup Your Contact Info</h4>
  <form class="max-w-full" nz-form [formGroup]="validateForm" (ngSubmit)="submitContactForm()">
    <nz-form-control class="mb-[20px]" nzErrorTip="The Phone Number is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtPhone" nzRequired>Phone Number</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="txtPhone" id="txtPhone" placeholder="Phone Number" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The Alternative Phone Number is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="cmName" nzRequired>Alternative Phone Number</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="txtAltPhoneNumber" id="txtAltPhoneNumber" placeholder="Alternative Phone Number" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The Email is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
        nzFor="txtEmail" nzRequired>
        Email
      </nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input id="txtEmail" formControlName="txtEmail" placeholder="Email" />
    </nz-form-control>
    
    <h4 class="text-[20px] font-medium text-dark dark:text-white/[.87]">Present Address</h4>
    <hr class="mb-[20px]">
    <nz-form-control class="mb-[20px]" nzErrorTip="The Street and Home No is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtPreStreet"  nzErrorTip="The Street Or Road Address is Required!" nzRequired>Street and Home No</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtPreStreet" id="txtPreStreet" placeholder="Street and Home No" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The Zip/Postal Code is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtPreZip" nzRequired>Zip/Postal Code</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtPreZip" id="txtPreZip" placeholder="Enter Zip" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The State is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtPreState" nzRequired>State</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtPreState" id="txtPreState" placeholder="Enter State" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The City Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtPreCity" nzRequired>City</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtPreCity" id="txtPreCity" placeholder="Enter City" />
    </nz-form-control>

    <h4 class="text-[20px] font-medium  text-dark dark:text-white/[.87]">Permanent Address</h4>
    <label class="mr-2">Same as Present Address?</label>
    <nz-switch formControlName="switchIsSameAddress" (ngModelChange)="onToggleAddress($event)"></nz-switch>


    <hr class="mb-[20px]">
    

    <nz-form-control class="mb-[20px]" nzErrorTip="The Street and Home No is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtPreStreet"  nzErrorTip="The Street Or Road Address is Required!" nzRequired>Street and Home No</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtPerStreet" id="txtPreStreet" placeholder="Street and Home No" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The Zip/Postal Code is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtPreZip" nzRequired>Zip/Postal Code</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtPerZip" id="txtPreZip" placeholder="Enter Zip" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The State is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtPreState" nzRequired>State</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtPerState" id="txtPreState" placeholder="Enter State" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The City is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize" nzFor="txtPreCity" nzRequired>City</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60 mb-[15px]"
        nz-input formControlName="txtPerCity" id="txtPreCity" placeholder="Enter City" />
    </nz-form-control>

  </form>
</div>
`,
})
export class CustommerContactComponent {

  @Output() formContactSubmitted = new EventEmitter<any>(); // Emit data to parent
  contactData: ICustomerDetailes | null = null;
  validateForm!: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder, private Custommer: CustommerService , private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      txtPhone: [null, [Validators.required]],
      txtEmail: [null, [Validators.required]],
      txtAltPhoneNumber: [null, [Validators.required]],
      txtPreStreet: [null, [Validators.required]],
      txtPreState: [null, [Validators.required]],
      txtPreZip: [null, [Validators.required]],
      txtPreCity: [null, [Validators.required]],
      txtPerStreet: [null, [Validators.required]],
      txtPerState: [null, [Validators.required]],
      txtPerZip: [null, [Validators.required]],
      txtPerCity: [null, [Validators.required]],
      switchIsSameAddress: [false]
  
    });

    const customerId = sessionStorage.getItem('__customerID__');

    if (customerId) {
      console.log("Editing Customer ID from session:", customerId);
      this.getContactInfo(customerId);
    } else {
      console.log("Adding New Customer");
    }

  
    this.validateForm.get('switchIsSameAddress')?.valueChanges.subscribe(value => {
      this.onToggleAddress(value);
    });
  }
  
// Fetch Contact Info
// Fetch Contact Info
getContactInfo(CustomerID :any): void {

    console.log("Editing Customer ID:", CustomerID);

    this.Custommer.getCustommerInfo(CustomerID).subscribe(
      (customerList) => {
        if (customerList && customerList.length > 0) {
          this.contactData = customerList[0];
          this.populateForm(this.contactData);
        } else {
          console.warn('No customer data found for the provided ID.');
        }
      },
      (error) => {
        console.error('Error fetching contact info:', error);
      }
    );
 
}



// Populate the form with retrieved data
populateForm(data: ICustomerDetailes): void {
  setTimeout(() => {
    this.validateForm.patchValue({
      txtPhone: data.phoneNumber,
      txtEmail: data.emailAddress,
      txtAltPhoneNumber: data.alternativePhoneNumber,
      txtPreStreet: data.preStreet,
      txtPreState: data.preState,
      txtPreZip: data.preZIP,
      txtPreCity: data.preCity,
      txtPerStreet: data.perStreet,
      txtPerState: data.perState,
      txtPerZip: data.perZIP, 
      txtPerCity: data.perCity,
    });
  });
}

  // Auto-fill Permanent Address when switch is toggled
  onToggleAddress(isSameAddress: boolean): void {
    if (isSameAddress) {
      this.validateForm.patchValue({
        txtPerStreet: this.validateForm.get('txtPreStreet')?.value,
        txtPerZip: this.validateForm.get('txtPreZip')?.value,
        txtPerState: this.validateForm.get('txtPreState')?.value,
        txtPerCity: this.validateForm.get('txtPreCity')?.value
      });
    } else {
      this.validateForm.patchValue({
        txtPerStreet: '',
        txtPerZip: '',
        txtPerState: '',
        txtPerCity: ''
      });
    }
  }

  // Submit Form Data
  submitContactForm(): boolean {
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
