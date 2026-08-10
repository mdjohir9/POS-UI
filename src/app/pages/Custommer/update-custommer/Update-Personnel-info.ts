import {
  Component,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  NzFormTooltipIcon
} from 'ng-zorro-antd/form';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ICustommer } from 'src/app/core/models/interfaces/ICustommer';
import { ICustomerDetailes } from 'src/app/core/models/interfaces/ICustommerDetailes';
import { accessControlService } from 'src/app/core/services/accessControlService';
import { CustommerService } from 'src/app/core/services/custommerService';

@Component({
  selector: 'update-personnel-info',
  template: `
<div>
  <h4 class="text-[20px] font-medium mb-[20px] text-dark dark:text-white/[.87]">1. Please Add Your Personnel Information</h4>
  <form class="max-w-full" [formGroup]="validateForm" (ngSubmit)="submitForm()">

  
  <div class="px-5 pt-[25px] pb-5 text-center border-b border-regular dark:border-white/10">
            <figure class="relative max-w-[120px] mx-auto mb-6">
              <nz-avatar  [nzSize]="120" nzIcon="user" [nzSrc]="avatarUrl"></nz-avatar>
              <span class="absolute right-0 flex items-center justify-center w-10 h-10 bg-white rounded-full -bottom-2 dark:bg-white/10">
                <nz-upload
                    nzName="avatar"
                    [nzShowUploadList]="false"
                    (nzChange)="handleChange($event)">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-[14px] text-white" nz-icon nzType="camera" nzTheme="outline">
                    </span>
                </nz-upload>
              </span>
            </figure>
            <figcaption>
              <h1 class="mb-0 text-lg font-semibold text-dark dark:text-white/[.87]">Passport Size Photo <span style="color: red;">*</span> </h1>
            </figcaption>
            <div *ngIf="validateForm.get('avatar')?.invalid && (validateForm.get('avatar')?.dirty || validateForm.get('avatar')?.touched)">
          <span class="text-red-500 text-sm">Please add an your Image, Size Max 2 MB.</span>
          </div>
          </div>
  <nz-form-control class="mb-[20px]" nzErrorTip="The User is Required!">
  <nz-form-label
    class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
    nzFor="ddlGender" nzRequired>
    Select User
  </nz-form-label>
  <nz-select
  formControlName="ddlUser"
  class="w-full capitalize [&>nz-select-top-control]:border-normal dark:[&>nz-select-top-control]:border-white/10 [&>nz-select-top-control]:bg-white [&>nz-select-top-control]:dark:bg-white/10 [&>nz-select-top-control]:shadow-none [&>nz-select-top-control]:text-dark [&>nz-select-top-control]:dark:text-white/60 [&>nz-select-top-control]:h-[50px] [&>nz-select-top-control]:flex [&>nz-select-top-control]:items-center [&>nz-select-top-control]:rounded-[6px] [&>nz-select-top-control]:px-[20px] [&>.ant-select-arrow]:text-theme-gray dark:[&>.ant-select-arrow]:text-white/60"
  name="ddlUser"
  [nzPlaceHolder]="'Select User'"
>
  <nz-option
    *ngFor="let user of userList"
    [nzValue]="user.userId"
    [nzLabel]="user.userName"
  ></nz-option>
</nz-select>

</nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The Full Name is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
        nzFor="txtFullName" nzRequired >Full Name</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="txtFullName" id="txtFullName" placeholder="Full Name" />
    </nz-form-control>
    <nz-form-control class="mb-[20px]" nzErrorTip="The Gender is Required!">
  <nz-form-label
    class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
    nzFor="ddlGender" nzRequired>
    Gender
  </nz-form-label>
  <nz-select formControlName="ddlGender"
    class="w-full capitalize [&>nz-select-top-control]:border-normal dark:[&>nz-select-top-control]:border-white/10 [&>nz-select-top-control]:bg-white [&>nz-select-top-control]:dark:bg-white/10 [&>nz-select-top-control]:shadow-none [&>nz-select-top-control]:text-dark [&>nz-select-top-control]:dark:text-white/60 [&>nz-select-top-control]:h-[50px] [&>nz-select-top-control]:flex [&>nz-select-top-control]:items-center [&>nz-select-top-control]:rounded-[6px] [&>nz-select-top-control]:px-[20px] [&>.ant-select-arrow]:text-theme-gray dark:[&>.ant-select-arrow]:text-white/60"
    name="ddlGender">
    <nz-option [nzValue]="'Male'" [nzLabel]="'Male'"></nz-option>
    <nz-option [nzValue]="'Female'" [nzLabel]="'Female'"></nz-option>
    <nz-option [nzValue]="'Other'" [nzLabel]="'Other'"></nz-option>
  </nz-select>
</nz-form-control>
<nz-form-control nxMd="8" nzXs="24" class="mb-[10px]" nzErrorTip="The Date Of Birth is Required!">
   <nz-form-label class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 mb-[10px] p-0 text-[15px] capitalize" nzRequired nzFor="txtDateOfBirth">
    Date Of Birth </nz-form-label>
        <nz-date-picker class="w-full rounded-6 border-normal border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60" id="txtDateOfBirth" formControlName="txtDateOfBirth"  placeholder="Select date Of Birth" ></nz-date-picker>   
 </nz-form-control>
 <nz-form-control class="mb-[20px]" nzErrorTip="The Nationality is Required!">
  <nz-form-label
    class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
    nzFor="ddlNatinality" nzRequired>
    Nationality 
  </nz-form-label>
<!--   <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="ddlNatinality" id="ddlNatinality" placeholder="Natinality" /> -->
 <nz-select formControlName="ddlNatinality"
    class="w-full capitalize [&>nz-select-top-control]:border-normal dark:[&>nz-select-top-control]:border-white/10 [&>nz-select-top-control]:bg-white [&>nz-select-top-control]:dark:bg-white/10 [&>nz-select-top-control]:shadow-none [&>nz-select-top-control]:text-dark [&>nz-select-top-control]:dark:text-white/60 [&>nz-select-top-control]:h-[50px] [&>nz-select-top-control]:flex [&>nz-select-top-control]:items-center [&>nz-select-top-control]:rounded-[6px] [&>nz-select-top-control]:px-[20px] [&>.ant-select-arrow]:text-theme-gray dark:[&>.ant-select-arrow]:text-white/60"
    name="ddlNatinality"  [nzShowSearch]="true">

    <nz-option
    *ngFor="let country of CountryList"
    [nzValue]="country.countryID"
    [nzLabel]="country.countryName"
  ></nz-option>

  </nz-select> 
</nz-form-control>
<nz-form-control class="mb-[20px]" nzErrorTip="The Marital Status is Required!">
  <nz-form-label
    class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
    nzFor="ddlMeritialStatus" nzRequired>
    Marital Status
  </nz-form-label>
  <nz-select formControlName="ddlMeritialStatus"
    class="w-full capitalize [&>nz-select-top-control]:border-normal dark:[&>nz-select-top-control]:border-white/10 [&>nz-select-top-control]:bg-white [&>nz-select-top-control]:dark:bg-white/10 [&>nz-select-top-control]:shadow-none [&>nz-select-top-control]:text-dark [&>nz-select-top-control]:dark:text-white/60 [&>nz-select-top-control]:h-[50px] [&>nz-select-top-control]:flex [&>nz-select-top-control]:items-center [&>nz-select-top-control]:rounded-[6px] [&>nz-select-top-control]:px-[20px] [&>.ant-select-arrow]:text-theme-gray dark:[&>.ant-select-arrow]:text-white/60"
    name="ddlMeritialStatus">
    <nz-option [nzValue]="'Single'" [nzLabel]="'Single'"></nz-option>
    <nz-option [nzValue]="'Married'" [nzLabel]="'married'"></nz-option>
  </nz-select>
</nz-form-control>
<nz-form-control class="mb-[20px]" nzErrorTip="The  Education Level is Required!">
  <nz-form-label
    class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
    nzFor="txtEducation" nzRequired>
    Education Level
  </nz-form-label>
  <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="txtEducation" id="txtEducation" placeholder="Education" />
</nz-form-control>

<nz-form-control class="mb-[20px]" nzErrorTip="The  Occupation is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
        nzFor="txtOccupation" nzRequired >Occupation</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="txtOccupation" id="txtOccupation" placeholder="Occupation" />
    </nz-form-control>

<nz-form-control class="mb-[20px]" nzErrorTip="The National ID Or Passport No is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
       nzRequired nzFor="txtNationalIDOrPassport">National ID Or Passport No</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="txtNationalIDOrPassport" id="txtNationalIDOrPassport" placeholder="National ID or Passport" />
    </nz-form-control>

<nz-form-control class="mb-[20px]" nzErrorTip="The Driving License is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
      nzFor="txtDrivLncNo">Driving License No</nz-form-label>
      <input class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="txtDrivLncNo" id="txtDrivLncNo" placeholder="Driving License No" />
    </nz-form-control>

<nz-form-control class="mb-[20px]" nzErrorTip="The Tax Identification is Required!">
      <nz-form-label
        class="flex items-center [&>label]:text-dark [&>label]:dark:text-white/60 p-0 [&>label]:text-[16px] capitalize"
        nzFor="txtTaxIdNo">Tax Identification No</nz-form-label>
      <input
        class="w-full rounded-6 border-regular border-1 text-[15px] dark:bg-white/10 dark:border-white/10 px-[20px] py-[12px] min-h-[50px] outline-none placeholder:text-[#A0A0A0] text-theme-gray dark:text-white/60"
        nz-input formControlName="txtTaxIdNo" id="txtTaxIdNo" placeholder="Tax Identification No" />
    </nz-form-control>

  </form>

</div>
<!-- <div class="mt-[25px] flex justify-between items-center">
                
                <button class="bg-primary hover:bg-primary-hbr inline-flex items-center outline-none shadow-none w-fit duration-300 text-white capitalize px-[20px] text-[15px] border-primary hover:border-primary-hbr rounded-[5px] gap-[8px] h-[46px]" nz-button nzType="primary" routerLink="personnel-info">
                  <span>Save & Next</span>
                  <span nz-icon nzType="arrow-right" nzTheme="outline"></span>
                </button>
              </div> -->
`,
})
export class UpdatePersonnelInfoComponent {
  
  @Output() formDataSubmitted = new EventEmitter<any>(); // Emit data to parent
  personnelData: ICustommer | null = null;
  validateForm!: UntypedFormGroup;
  avatarUrl: string = '';

  personnelDetailes: ICustomerDetailes | null = null;
  constructor(private fb: UntypedFormBuilder, private Custommer: CustommerService,private route: ActivatedRoute,private accessControl: accessControlService) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      let customerId = params.get('id'); // Get from URL
      if (customerId) {
        console.log("Editing Customer ID:", customerId);
        this.getPersonnelInfo(customerId);
      } else {
        console.log("Adding New Customer");
      }

      
    });
    this.getCountry();
    this.getUserInfo();
 

    this.validateForm = this.fb.group({
      txtFullName: [null, [Validators.required]],
      ddlGender: [null, [Validators.required]],
      txtDateOfBirth: [null, [Validators.required]],
      ddlNatinality: [null, [Validators.required]],
      ddlMeritialStatus: [null, [Validators.required]],
      txtEducation: [null, [Validators.required]],
      txtOccupation: [null, [Validators.required]],
      txtNationalIDOrPassport: [null, [Validators.required]],
      txtDrivLncNo: [null],
      txtTaxIdNo: [null],
      ddlUser: [{ value: '', disabled: true }, [Validators.required]],
      avatar: [''], 
    });
  }
  getPersonnelInfo(CustomerID: any): void {

    console.log("Editing Customer ID:", CustomerID);

    this.Custommer.getCustommerInfo(CustomerID).subscribe(
      (customerList) => {
        if (customerList && customerList.length > 0) {
          this.personnelDetailes = customerList[0];
          this.populateForm(this.personnelDetailes);
        } else {
          console.warn('No customer data found for the provided ID.');
        }
      },
      (error) => {
        console.error('Error fetching contact info:', error);
      }
    );

  }


  // Method to populate the form with retrieved data
  populateForm(data: ICustomerDetailes): void {
    if (data.custommerImage) {
      this.avatarUrl = data.custommerImage;
      this.validateForm.patchValue({ avatar: this.avatarUrl }); // ✅ Update form control
    } else {
      this.avatarUrl = "assets/images/avatars/thumbs.png"; // fallback
      this.validateForm.patchValue({ avatar: null }); // ✅ Clear avatar if not found
    }
  
    this.validateForm.patchValue({
      ddlUser: Number( data.userid),
      txtFullName: data.fullName,
      ddlGender: data.gender,
      txtDateOfBirth: data.dateOfBirth,
      ddlNatinality: Number( data.nationlityId),
      ddlMeritialStatus: data.maritalStatus,
      txtEducation: data.educationLevel,
      txtOccupation: data.occupation,
      txtNationalIDOrPassport: data.nationalIDOrPassport,
      txtDrivLncNo: data.drivingLicenseNumber,
      txtTaxIdNo: data.taxIdentificationNumber,
    });
     
  }
  

  userList: any[] = [];

  getUserInfo(): void {
    this.accessControl.getUserNameId().subscribe(
      (response) => {
        if (response && response.data) {
          // Filter by customerId if provided
         // this.userList =  response.data;
          this.userList = [{ userId: "", userName: '---select---' }, ...response.data];
        }
      },
      (error) => {
        console.error('Error fetching personnel info', error);
      }
    );
  }
  // Method to populate the form with retrieved data
  private getBase64(img: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      callback(base64Data);
    });
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    const file = info.file.originFileObj!;
    this.getBase64(file, (base64String: string) => {
      this.avatarUrl = `data:${info.file.type};base64,${base64String}`;
      this.validateForm.patchValue({ avatar: this.avatarUrl });
      this.validateForm.get('avatar')?.markAsDirty();
      this.validateForm.get('avatar')?.updateValueAndValidity();
    });
  }
  
/*   submitForm(): boolean {
    if (this.validateForm.valid) {
      return true;
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return false;
    }
  } */

    private convertImageUrlToBase64(url: string): Promise<string> {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
}

/*   submitForm(): boolean {
    if (this.validateForm.valid) {
      const formData = { ...this.validateForm.value };
      if (formData.avatar?.startsWith('data:')) {
        formData.avatar = formData.avatar.split(',')[1]; // send only base64
      }

      // ✅ Pass formData to your separate API service
      console.log('Submitting:', formData);
      return true;
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return false;
    }
  }  */


async submitForm(): Promise<boolean> {
  if (this.validateForm.valid) {
    const formData = { ...this.validateForm.value };

    if (formData.avatar && !formData.avatar.startsWith('data:')) {
      formData.avatar = await this.convertImageUrlToBase64(formData.avatar);
    } else if (formData.avatar?.startsWith('data:')) {
      formData.avatar = formData.avatar.split(',')[1];
    }

    this.validateForm.patchValue({ avatar: `data:image/png;base64,${formData.avatar}` });

    // Log or send formData
    return true;
  } else {
    Object.values(this.validateForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
    return false;
  }
}


async handleSubmit(): Promise<void> {
  const isValid = this.submitForm();
  if (!isValid) return;

  const formData = { ...this.validateForm.value };

  if (formData.avatar && !formData.avatar.startsWith('data:')) {
    formData.avatar = await this.convertImageUrlToBase64(formData.avatar);
  } else if (formData.avatar?.startsWith('data:')) {
    formData.avatar = formData.avatar.split(',')[1];
  }

  // ✅ Now formData.avatar is base64 ready to send
  console.log('Submitting customer:', formData);
  // await this.apiService.updateCustomer(formData).toPromise();
}


  CountryList: any[] = [];

  getCountry(): void {
    this.Custommer.getCountry().subscribe(
      (response) => {
        if (response && response.data) {
          // Filter by customerId if provided
          // this.userList =  response.data;
          this.CountryList = [{ countryID: "", countryName: '---select---' }, ...response.data];
        }
      },
      (error) => {
        console.error('Error fetching personnel info', error);
      }
    );
  }

}
