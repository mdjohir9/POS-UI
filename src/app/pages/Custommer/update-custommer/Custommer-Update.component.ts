import { Component, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UpdatePersonnelInfoComponent } from './Update-Personnel-info';
import { CustommerService } from 'src/app/core/services/custommerService';
import { ICustommer } from 'src/app/core/models/interfaces/ICustommer';
import { ICustomerDetailes } from 'src/app/core/models/interfaces/ICustommerDetailes';
import { IContact } from 'src/app/core/models/interfaces/IContact';
import { UpdateCustommerContactComponent } from './Update-Custommer-Contact';
import { UpdateCustommerEmploymentComponent } from './Update-Custommer-Employment';
import { UpdateCustommerFinancialInfoComponent } from './update-Custommer-FinancialInfo';
import { ActivatedRoute } from '@angular/router';
import { ICustomerUpdate } from 'src/app/core/models/interfaces/ICustommerUpdate';
@Component({
  selector: 'app-custommer-add',
  templateUrl: './Custommer-Update-component.html',
  styleUrls: ['./Custommer-Update.component.scss'],
})

export class CustommerUpdateComponent {
  isLoading = true;
  showContent = false;
  customerSaveDTO: ICustomerUpdate = {
    CustomerID : 0,
    custCardNo: '',
    companyId: 1,
    custommerImage: [],
    custommerSignature: []
  };
  @ViewChild(UpdatePersonnelInfoComponent) personnelInfoComponent!: UpdatePersonnelInfoComponent;
  @ViewChild (UpdateCustommerContactComponent) custommerContact ! : UpdateCustommerContactComponent;
  @ViewChild (UpdateCustommerEmploymentComponent) custommerEmployment ! : UpdateCustommerEmploymentComponent;
  @ViewChild (UpdateCustommerFinancialInfoComponent) custommerFinancial ! : UpdateCustommerFinancialInfoComponent;
  current = 0;
  showConfirmation = false;
  isReviewOrderFinished = false;
  customerId: string | null = null; 

  
  constructor(private modalService: NzModalService, private Custommer: CustommerService,private route: ActivatedRoute) {}

  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const urlCustomerId = params.get('id'); // Get from URL
      if (urlCustomerId) {
        this.customerId = urlCustomerId; // Use URL ID
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

/*   next(): void {
    if (this.current === 0) {
      if(this.customerId=='' || null){
        this.submitPersonnelInfo(); 
      }
      else{
        this.updatePersonnelInfo(this.customerId)
      }
  

    } else if (this.current === 1) {
      this.submitContactInfo();
    } else if (this.current === 2) {
      this.saveEmploymentInfo(); 
    }
    else {
      this.saveFinancialInfo();
    } 
  } */
/*     next(): void {
      if (this.current === 0) {
        const formData = this.personnelInfoComponent.validateForm.value;
        this.customerSaveDTO = {
          ...this.customerSaveDTO,
          ...this.formatCustomerData(formData)
        };
      } else if (this.current === 1) {
        const formData = this.custommerContact.validateForm.value;
        this.customerSaveDTO = {
          ...this.customerSaveDTO,
          ...this.formatContactData(formData)
        };
      } else if (this.current === 2) {
        const formData = this.custommerEmployment.validateForm.value;
        this.customerSaveDTO = {
          ...this.customerSaveDTO,
          ...this.formatEmploymentData(formData)
        };
      } else {
        const formData = this.custommerFinancial.validateForm.value;
        this.customerSaveDTO = {
          ...this.customerSaveDTO,
          ...this.formatFinancialData(formData)
        };
  
        this.Custommer.updateCustommerAllnfo(this.customerSaveDTO).subscribe(
          response => {
            console.log('All customer data saved successfully:', response);
            this.current++;
          },
          error => {
            console.error('Error saving full customer data:', error);
          }
        );
        return;
      }
  
      this.current++;
    }

    
    confirm(): void {
      this.modalService.confirm({
        nzTitle: '<span class="text-dark dark:text-white/[.87]">Confirmation</span>',
        nzContent: `
          <div class="text-light dark:text-white/60 text-[15px]">
            Are you sure you want to submit all data? Once submitted, you will not be able to change it. 
            Please review your information carefully before proceeding.
          </div>
        `,
        nzClassName: 'confirm-modal',
        nzOnOk: () => {
          const formData = this.custommerFinancial.validateForm.value;
    
          // Include CustomerID from URL or session before sending
          this.customerSaveDTO = {
            ...this.customerSaveDTO,
            customerID: Number(this.customerId), // <-- Assign here
            ...this.formatFinancialData(formData)
          };
    
          this.Custommer.updateCustommerAllnfo(this.customerSaveDTO).subscribe(
            response => {
              console.log('All customer data saved successfully:', response);
              this.current++;
            },
            error => {
              console.error('Error saving full customer data:', error);
            }
          );
    
          this.isReviewOrderFinished = true;
          this.showConfirmation = true;
          return;
        }
      });
    }
     */

  
    async next(): Promise<void> {
      let isValid = false;
      let formData: any = {};
    
      switch (this.current) {
        case 0:
         isValid = await this.personnelInfoComponent.submitForm(); 
          if (isValid) {
            formData = this.personnelInfoComponent.validateForm.value;
            this.customerSaveDTO = {
              ...this.customerSaveDTO,
              ...this.formatCustomerData(formData)
            };
          }
          break;
    
        case 1:
          isValid = this.custommerContact.submitContactForm();
          if (isValid) {
            formData = this.custommerContact.validateForm.value;
            this.customerSaveDTO = {
              ...this.customerSaveDTO,
              ...this.formatContactData(formData)
            };
          }
          break;
    
        case 2:
          isValid = this.custommerEmployment.submitEmploymentForm();
          if (isValid) {
            formData = this.custommerEmployment.validateForm.value;
            this.customerSaveDTO = {
              ...this.customerSaveDTO,
              ...this.formatEmploymentData(formData)
            };
          }
          break;
      }
    
      if (isValid) {
        this.current++; // Go to next step
      }
    }
    
  confirm(): void {
    const existingCustomerID = sessionStorage.getItem('__customerID__');
    if (existingCustomerID) {
      this.modalService.warning({
        nzTitle: '<span class="text-dark dark:text-white/[.87]">Already Submitted</span>',
        nzContent: `
        <div class="text-light dark:text-white/60 text-[15px]">
          You have already submitted your personnel information. To maintain data integrity, additional submissions or updates are not allowed.
          If you believe any information was entered incorrectly, please contact our support team for assistance.
        </div>
      `
      });
      return;
    }

    this.modalService.confirm({
      nzTitle: '<span class="text-dark dark:text-white/[.87]">Confirmation</span>',
      nzContent: `
      <div class="text-light dark:text-white/60 text-[15px]">
        Are you sure you want to submit all data? Once submitted, you will not be able to change it.
        Please review your information carefully before proceeding.
      </div>
    `,
      nzClassName: 'confirm-modal',
      nzOnOk: () => {
        const isValid = this.custommerFinancial.submitFinancialForm();
        if (!isValid) {
          return false;
        }

        const formData = this.custommerFinancial.validateForm.value;
        this.customerSaveDTO = {
          ...this.customerSaveDTO,
          customerID: Number(this.customerId),
          ...this.formatFinancialData(formData)
        };

        return new Promise((resolve, reject) => {
          this.Custommer.updateCustommerAllnfo(this.customerSaveDTO).subscribe({
            next: (response) => {
              console.log('All customer data saved successfully:', response);
              this.isReviewOrderFinished = true;
              this.showConfirmation = true;
              resolve(true);
            },
            error: (error) => {
              console.error('Error saving full customer data:', error);
              reject(false);
            }
          });
        });
      }
    });
  }

    
/*     confirm(): void {
      const existingCustomerID = sessionStorage.getItem('__customerID__');
      if (existingCustomerID) {
        this.modalService.warning({
          nzTitle: '<span class="text-dark dark:text-white/[.87]">Already Submitted</span>',
          nzContent: `
            <div class="text-light dark:text-white/60 text-[15px]">
              You have already submitted your personnel information. To maintain data integrity, additional submissions or updates are not allowed.
              If you believe any information was entered incorrectly, please contact our support team for assistance.
            </div>
          `
        });
        return;
      }
    
      this.modalService.confirm({
        nzTitle: '<span class="text-dark dark:text-white/[.87]">Confirmation</span>',
        nzContent: `
          <div class="text-light dark:text-white/60 text-[15px]">
            Are you sure you want to submit all data? Once submitted, you will not be able to change it.
            Please review your information carefully before proceeding.
          </div>
        `,
        nzClassName: 'confirm-modal',
        nzOnOk: () => {
          // ✅ Validate and collect final step data here
          const isValid = this.custommerFinancial.submitFinancialForm();
          if (!isValid) {
            return false; // Stop submission if financial form is invalid
          }
    
          const formData = this.custommerFinancial.validateForm.value;
          this.customerSaveDTO = {
            ...this.customerSaveDTO,
            customerID: Number(this.customerId), // <-- Assign here
            ...this.formatFinancialData(formData)
          };
    
          // ✅ Save all data
          this.Custommer.updateCustommerAllnfo(this.customerSaveDTO).subscribe(
            response => {
              console.log('All customer data saved successfully:', response);
             // this.current++;
               this.showConfirmation = true;
            },
            error => {
              console.error('Error saving full customer data:', error);
            }
          );
    
          this.isReviewOrderFinished = true;
          this.showConfirmation = true;
        }

        
      });
    }
 */
  
  // Method to format the customer data
  formatCustomerData(formData: any): any {
    const formattedDateOfBirth = this.formatDate(formData.txtDateOfBirth);
    const userId = sessionStorage.getItem('__useId__'); 
    return {
      custCardNo: 'ot2222', 
      companyId: 1111,
      custommerImage: [formData.avatar],
      fullName: formData.txtFullName,
      gender: formData.ddlGender,
      dateOfBirth: formattedDateOfBirth,  
      nationality: formData.ddlNatinality.toString(),
      maritalStatus: formData.ddlMeritialStatus,
      educationLevel: formData.txtEducation,
      occupation: formData.txtOccupation,
      nationalIDOrPassport: formData.txtNationalIDOrPassport,
      taxIdentificationNumber: formData.txtTaxIdNo,
      drivingLicenseNumber: formData.txtDrivLncNo,
      userId: formData.ddlUser, 
    };
  }
  

  formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); 
    const day = d.getDate().toString().padStart(2, '0'); 
    return `${year}-${month}-${day}`;
  }
  

  getCustommerDetailes(): void {
    const customerIdStr = sessionStorage.getItem('+');
    const customerId = customerIdStr ? parseInt(customerIdStr, 10) : null;
  
    if (customerId === null) {
      console.error('Invalid customer ID');
      return;
    }
    this.Custommer.getCustommerInfo(customerId).subscribe(
      (customerList) => {
        if (customerList && customerList.length > 0) {
         return customerList[0];
       
        }
      },
      (error) => {
        console.error('Error fetching contact info', error);
      }
    );
  }
  




  formatGuarantorData(formData: any): any {
  
    return {

      guarantorFullName: formData.txtGuarantorName || '',
      relationshipWithApplicant: formData.txtRelWithApplicant || '',
      guarantorContactNumber: formData.txtGuarantorContact || '',
      guarantorAddress: formData.txtGuarantorAddress || '',
      guarantorNationalIDOrPassport: formData.txtGurNatIDOrPassport || ''
    };
  }
  
  formatFinancialData(formData: any): any {
  
    return {

      bankName: formData.txtBankName || null,
      accountNumber: formData.txtAccountNo || null,
      monthlyIncomeSources: formData.txtMonthlyInc || 0,
      monthlyExpenses: formData.txtMonthlyExpenses || 0,
      assetsOwned: formData.txtAssetsOwned || null,
      liabilities: formData.txtLiabilities || null
    };
  }
  
  formatEmploymentData(formData: any): any {
    const customerIdStr = sessionStorage.getItem('__customerID__');
    const customerId = customerIdStr ? parseInt(customerIdStr, 10) : null;

    return {
      employmentType: formData.ddlEmploymentType || null,
      employerOrBusnName: formData.txtEmployerOrBusnName || null,
      jobTitleOrBusnType: formData.txtJobTitleOrBusnType || null,
      monthlyIncOrBusnRev: formData.txtMonthlyIncOrBusnRev ? parseFloat(formData.txtMonthlyIncOrBusnRev) : 0,
      yearsOfExpOrBusnAge: formData.txtYearsOfExp ? parseInt(formData.txtYearsOfExp, 10) : 0,
      workOrBusnAddress: formData.txtWorkOrBusnAddress || null,
      employerOrBusnContact: formData.txtEmployerOrBusnContact || null,
    
    };
}

  
  formatContactData(formData: any): any {

    return {

      phoneNumber: formData.txtPhone,
      alternativePhoneNumber: formData.txtAltPhoneNumber,
      emailAddress: formData.txtEmail,
      preStreet: formData.txtPreStreet,
      perStreet: formData.txtPerStreet,
      preZIP: formData.txtPreZip,
      perZIP: formData.txtPerZip,
      preCity: formData.txtPreCity,
      perCity: formData.txtPerCity,
      preState: formData.txtPreState,
      perState: formData.txtPerState,
    };
  }
  
  saveContactInfo() {
    console.log('Save contact info');
    // Add logic to save contact info here
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
