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
import { ICustommer } from 'src/app/core/models/interfaces/ICustommer';
import { CustommerService } from 'src/app/core/services/custommerService';
import { accessControlService } from 'src/app/core/services/accessControlService';
import { ICustomerDetailes } from 'src/app/core/models/interfaces/ICustommerDetailes';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'personnel-info',
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
  [nzPlaceHolder]="'Select User'" [nzShowSearch]="true"
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
    name="ddlNatinality" [nzShowSearch]="true">
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
        nzFor="txtTaxIdNo" >Tax Identification No</nz-form-label>
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
export class PersonnelInfoComponent {

  @Output() formDataSubmitted = new EventEmitter<any>(); // Emit data to parent
  personnelData: ICustommer | null = null;
  validateForm!: UntypedFormGroup;
  personnelDetailes: ICustomerDetailes | null = null;
  avatarUrl: string = "assets/images/avatars/thumbs.png";
  constructor(private fb: UntypedFormBuilder, private Custommer: CustommerService, private route: ActivatedRoute, private accessControl: accessControlService) { }
  dataAccessLevel: number = 0;
  ngOnInit(): void {

    const customerId = sessionStorage.getItem('__customerID__');
    this.getUserInfo();
    this.getCountry();

    if (customerId) {
      console.log("Editing Customer ID from session:", customerId);
      this.getPersonnelInfo(customerId);

    } else {
      console.log("Adding New Customer");
    }


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
      ddlUser: ['', [Validators.required]],
      avatar: ['' , [Validators.required]], 
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


  /*   getPersonnelInfo(customerId:any): void {
      this.Custommer.getPersonnelInfoByeId( customerId).subscribe(
        (data) => {
          if (data) {
            this.personnelData = data;
            this.populateForm(data); // Populate the form with fetched data
          }
        },
        (error) => {
          console.error('Error fetching personnel info', error);
        }
      );
    } */
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
    const access = sessionStorage.getItem('__DataAccessLevel__');
    this.dataAccessLevel = access ? parseInt(access, 10) : 0;

    const sessionUserId = sessionStorage.getItem('__useId__');
    if (data.custommerImage) {
      this.avatarUrl = data.custommerImage;
    } else {
      this.avatarUrl = "assets/images/avatars/thumbs.png"; // fallback
    }
    this.validateForm.patchValue({
      ddlUser: Number( data.userid),
      txtFullName: data.fullName,
      ddlGender: data.gender,
      txtDateOfBirth: data.dateOfBirth,
      ddlNatinality:   Number(data.nationlityId),
      ddlMeritialStatus: data.maritalStatus,
      txtEducation: data.educationLevel,
      txtOccupation: data.occupation,
      txtNationalIDOrPassport: data.nationalIDOrPassport,
      txtDrivLncNo: data.drivingLicenseNumber,
      txtTaxIdNo: data.taxIdentificationNumber,
    });
  }

  private getBase64(img: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1]; // remove "data:image/png;base64,"
      callback(base64Data);
    });
    reader.readAsDataURL(img);
  }
  
 
  handleChange(info: { file: NzUploadFile }): void {
    this.getBase64(info.file.originFileObj!, (base64String: string) => {
      this.avatarUrl = `data:${info.file.type};base64,${base64String}`; // Display image
      this.validateForm.patchValue({ avatar: this.avatarUrl }); 
      this.validateForm.get('avatar')?.markAsDirty();                    // Mark as dirty
      this.validateForm.get('avatar')?.updateValueAndValidity(); 
      localStorage.setItem('avatar', base64String);                    // Optional storage
    });
  }
  

  submitForm(): boolean {
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
