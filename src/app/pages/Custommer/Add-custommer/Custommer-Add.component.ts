import { Component, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PersonnelInfoComponent } from './Personnel-info';
import { CustommerService } from 'src/app/core/services/custommerService';
import { ICustommer } from 'src/app/core/models/interfaces/ICustommer';
import { ICustomerDetailes } from 'src/app/core/models/interfaces/ICustommerDetailes';
import { IContact } from 'src/app/core/models/interfaces/IContact';
import { CustommerContactComponent } from './Custommer-Contact';
import { CustommerEmploymentComponent } from './Custommer-Employment';
import { CustommerFinancialInfoComponent } from './Custommer-FinancialInfo';
import { CustommerGuarantorComponent } from './Custommer-Guarantor';
import { ActivatedRoute, Router } from '@angular/router';
import { ICustomerSave } from 'src/app/core/models/interfaces/ICustomerSave';
@Component({
  selector: 'app-custommer-add',
  templateUrl: './Custommer-Add.component.html',
  styleUrls: ['./Custommer-Add.component.scss'],
})

export class CustommerAddComponent {
  isLoading = true;
  showContent = false;
  customerSaveDTO: ICustomerSave = {
    custCardNo: '',
    companyId: 1,
    custommerImage: [],
    custommerSignature: []
  };
  @ViewChild(PersonnelInfoComponent) personnelInfoComponent!: PersonnelInfoComponent;
  @ViewChild (CustommerContactComponent) custommerContact ! : CustommerContactComponent;
  @ViewChild (CustommerEmploymentComponent) custommerEmployment ! : CustommerEmploymentComponent;
  @ViewChild (CustommerFinancialInfoComponent) custommerFinancial ! : CustommerFinancialInfoComponent;
  @ViewChild (CustommerGuarantorComponent) custommerGuarantor ! : CustommerFinancialInfoComponent;
  current = 0;
  showConfirmation = false;
  isReviewOrderFinished = false;
  customerId: string | null = null; 

  
  constructor(
    private modalService: NzModalService,
    private Custommer: CustommerService,
    private router: Router,               // ✅ use this
    private route: ActivatedRoute         // (optional) only if you still need it
  ) {}
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const urlCustomerId = params.get('id'); // Get from URL
  
      if (urlCustomerId) {
        this.customerId = urlCustomerId; // Use URL ID
      } else {
        this.customerId = sessionStorage.getItem('__customerID__'); // Use session ID if URL ID is missing
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
  
        this.Custommer.saveCustommerAllnfo(this.customerSaveDTO).subscribe(
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
    } */
      next(): void {
        let isValid = false;
        let formData: any = {};
      
        switch (this.current) {
          case 0:
            isValid = this.personnelInfoComponent.submitForm();
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
        if (!existingCustomerID) {
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
              ...this.formatFinancialData(formData)
            };
      
            // ✅ Save all data
            this.Custommer.saveCustommerAllnfo(this.customerSaveDTO).subscribe(
              response => {
                console.log('All customer data saved successfully:', response);
                sessionStorage.setItem('__customerID__', response.customerID);
                this.router.navigate(['/custommer/profile']);
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
      

  updatePersonnelInfo(customerId:string): void {
    const formData = this.personnelInfoComponent.validateForm.value; // Get form data
    const formattedData = this.formatCustomerData(formData);
  
    this.Custommer.updatePersonnelInfo(formattedData, this.customerId).subscribe(
      (response) => {
        console.log('Personnel info updated successfully', response);
        this.current += 1;
      },
      (error) => {
        console.error('Error updating personnel info', error);
      }
    );
  }
  

  // Submit personnel information (form data from child component)
  submitPersonnelInfo(): void {
    if (this.personnelInfoComponent) {
      const formData = this.personnelInfoComponent.validateForm.value; // Get form data from child component
      
      // Format the data before passing it to the service
      const formattedData = this.formatCustomerData(formData);
  
      // Now pass the formatted data to the savePersonnelInfo method
      this.Custommer.savePersonnelInfo(formattedData).subscribe(
        (response) => {
         
          console.log('Data saved successfully', response);
          this.current++;
        },
        (error) => {
          console.error('Error saving data', error);
        }
      );
    }
  }
  
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
  
  submitContactInfo(): void {
    if (this.custommerContact) {
      const formData = this.custommerContact.validateForm.value; // Get form data from child component
      
      // Format the data before passing it to the service
      const formattedData = this.formatContactData(formData);

      this.Custommer.saveContactInfo(formattedData).subscribe(
        (response) => {
         
          console.log('Data saved successfully', response);
          this.current++;
        },
        (error) => {
          console.error('Error saving data', error);
        }
      );
    }
  }

  saveEmploymentInfo() {
    if (this.custommerEmployment) {
      const formData = this.custommerEmployment.validateForm.value; // Get form data from child component
      
      // Format the data before passing it to the service
      const formattedData = this.formatEmploymentData(formData);

      this.Custommer.saveEmploymentInfo(formattedData).subscribe(
        (response) => {
         
          console.log('Data saved successfully', response);
          this.current++;
        },
        (error) => {
          console.error('Error saving data', error);
        }
      );
    }
  }

  saveFinancialInfo() {
    if (this.custommerFinancial) {
      const formData = this.custommerFinancial.validateForm.value;
      const formattedData = this.formatFinancialData(formData);
      this.Custommer.saveFinancialInfo(formattedData).subscribe(
        (response) => {
         
          console.log('Data saved successfully', response);
          this.current++;
        },
        (error) => {
          console.error('Error saving data', error);
        }
      );
    }
  }

  saveGuarantorInfo() {
    if (this.custommerFinancial) {
      const formData = this.custommerGuarantor.validateForm.value;
      const formattedData = this.formatGuarantorData(formData);
      this.Custommer.saveGuarantorInfo(formattedData).subscribe(
        (response) => {
         
          console.log('Data saved successfully', response);
          this.current++;
        },
        (error) => {
          console.error('Error saving data', error);
        }
      );
    }
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
      customerID: customerId,
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



 

/*   confirm(): void {
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
      //  this.saveFinancialInfo();


        const formData = this.custommerFinancial.validateForm.value;
        this.customerSaveDTO = {
          ...this.customerSaveDTO,
          ...this.formatFinancialData(formData)
        };
  
        this.Custommer.saveCustommerAllnfo(this.customerSaveDTO).subscribe(
          response => {
            console.log('All customer data saved successfully:', response);
            //this.current++;

            sessionStorage.setItem('__customerID__', response.customerID);

            this.router.navigate(['/custommer/profile']);
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
