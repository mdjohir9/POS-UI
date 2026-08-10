import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzDemoModalBasicComponent } from './basic';
import { CompanyService } from 'src/app/core/services/companyService';
import Swal from 'sweetalert2';
import { commonTaskService } from 'src/app/core/services/commonTaskService';
import { EmployeeService } from 'src/app/core/services/EmployeeService';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl:'./add-employee.component.css',
  standalone: false,
})
export class AddEmployeeComponent implements OnInit{
  isLoading = true;
  showContent = false;
  constructor(private fb: UntypedFormBuilder, private common: commonTaskService , private Employee: EmployeeService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadData();
    this.validateForm = this.fb.group({
      ddlCompany: new FormControl('', Validators.required),
      employeeType: new FormControl('', Validators.required),
      salaryType: new FormControl('', Validators.required),
      txtFullName: new FormControl('', Validators.required),
      txtNickName: new FormControl('', Validators.required),
      txtNameBng: new FormControl('', Validators.required),
      ddlDepartment: new FormControl('', Validators.required),
      ddlDesigation: new FormControl('', Validators.required),
      ddlGroup: new FormControl('', Validators.required),
      ddlShift: new FormControl('', Validators.required),
      ddlCardNo: new FormControl('', Validators.required),
      txtAlternetCard: new FormControl('', Validators.required),
      txtRegID: new FormControl('', Validators.required),
      txtProximityNo: new FormControl('', Validators.required),
      ddlEmpStatus: new FormControl('', Validators.required),
      ddlEmpType: new FormControl('', Validators.required),
      txtJoininfDate: new FormControl('', Validators.required),
      txtExpireDate: new FormControl('', Validators.required),
      txtOrdering: new FormControl('', Validators.required),
      WeekendType: new FormControl(),
      DutyType:new FormControl (),
    });
    
    this.getComapnys();
    this.getDepartments();
    this.getEmpCardNo('0');
    const storedCompanyId = sessionStorage.getItem('__companyId__') || '';

    this.selectedCompany = storedCompanyId;
  }

  loadData() {
    // Simulate an asynchronous data loading operation
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }

  OnshowModel(){
    console.log('Show Model Data Success')
  }


  validateForm!: UntypedFormGroup;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };
  submitForm(): void {
    if (this.validateForm.valid) {
      const formValues = this.validateForm.value;
      
      // Format dates to match the API format 'yyyy-MM-dd'
      const formattedJoiningDate = this.datePipe.transform(formValues.txtJoininfDate, 'yyyy-MM-dd');
      const formattedExpireDate = this.datePipe.transform(formValues.txtExpireDate, 'yyyy-MM-dd');
      
      const formData = {
        companyId: formValues.ddlCompany,
        empTypeId: parseInt(formValues.employeeType, 10),
        empName: formValues.txtFullName,
        nickName: formValues.txtNickName,
        empNameBn: formValues.txtNameBng,
        empCardNo: formValues.ddlCardNo,
        empProximityNo: formValues.txtProximityNo,
        empStatus: formValues.ddlEmpStatus,
        empAccountNo: "", // You might need to get this from another source
        sftId: formValues.ddlShift,
        empShiftStartDate: formattedJoiningDate, // Use the correct format here
        empJoiningDate: formattedJoiningDate,
        empJoinigSalary: 0, // Set default or input salary
        pfMember: true, // Set based on logic
        pfDate: formattedJoiningDate,
        pfamount: 0, // Set proper amount
        earnedLeave: 0,
        earnedLeaveEffectedFrom: formattedJoiningDate,
        bonusType: "", // Get from additional input
        empPicture: "", // Handle image uploads separately
        signatureImage: "", // Handle signature uploads separately
        salaryCount: "", // Define salary count logic
        bankName: "", // Add bank name input if needed
        type: "", // Define if applicable
        wagesType: "", // Define wages type logic
        expireDate: formattedExpireDate, // Use the formattedExpireDate
        realProximityNo: formValues.txtAlternetCard,
        punchType: true, // Adjust based on logic
        authorizedPerson: true, // Adjust based on logic
        pfOpeningBalance: 0,
        pfEmpContribution: 0,
        tiffinStatus: true, // Adjust based on logic
        nightBillStatus: true, // Adjust based on logic
        lunchBillStatus: true, // Adjust based on logic
        breakfastStatus: true, // Adjust based on logic
        isTransferredToCompliance: true, // Adjust based on logic
        weekendType: formValues.WeekendType,
        dptId: formValues.ddlDepartment,
        dsgId: formValues.ddlDesigation,
        gid: formValues.ddlGroup,
        salaryType: formValues.salaryType,
        empDutyType: formValues.DutyType,
        tin: "", // Add a TIN input if needed
        ordering: formValues.txtOrdering
      };
  
      console.log('Employee Data For Saving', formData);
  
      this.Employee.saveEmployee(formData).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Save successfully!'
          });
        },
        () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error submitting your Employee application. Please try again.'
          });
        }
      );
    }
  }
  

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }


  @ViewChild(NzDemoModalBasicComponent) childComponent!: NzDemoModalBasicComponent;

  onShowModal(): void {
    this.childComponent.showModal();
  }

  showForm = false;

  toggleForm(): void {
    this.showForm = !this.showForm; // Toggle visibility
  }


    selectedCompany: string = '';
    companys: { companyId: string, companyName: string }[] = [];
    
    getComapnys(): void {
      this.isLoading = true;
      this.common.getCompaniesApiCall().subscribe(
        (response: any) => {
          this.isLoading = false;
    
          if (response?.statusCode === 200 && Array.isArray(response.data)) {
            console.log('API Response:', response.data);
            this.companys = [...response.data];
  
          } else {
            console.error('Error fetching data:', response.message);
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Failed to fetch data from API.',
            });
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('API Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'An unexpected error occurred.',
          });
        }
      );
    }



    selectDepartments: string = '';
    departments: { dptId: string, dptName: string }[] = [];
    
    getDepartments(): void {
      this.isLoading = true;
      this.common.getDepartmentApiCall().subscribe(
        (response: any) => {
          this.isLoading = false;
    
          if (response?.statusCode === 200 && Array.isArray(response.data)) {
            console.log('API Response:', response.data);
            this.departments = [{ dptId: "", dptName: "----Select----" }, ...response.data];
  
          } else {
            console.error('Error fetching data:', response.message);
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Failed to fetch data from API.',
            });
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('API Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'An unexpected error occurred.',
          });
        }
      );
    }
    onDepartmentChange(departmentId: string) {
      console.log('Selected Department ID:', departmentId);
      this.getDesignations(departmentId);
      this.getGroups(departmentId);
      this.getShifts(departmentId);
    }

    selectShift: string = '';
    shifts: { id: string, name: string }[] = [];
    
    getShifts(departmentId : string): void {
      this.isLoading = true;
      const deptId = departmentId?.trim() ? departmentId : '0'; 
      this.common.getShiftApiCall(deptId).subscribe(
        (response: any) => {
          this.isLoading = false;
    
          if (response?.statusCode === 200 && Array.isArray(response.data)) {
            console.log('API Response:', response.data);
            this.shifts = [{ id: "", name: "----Select----" }, ...response.data];
  
          } else {
            console.error('Error fetching data:', response.message);
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Failed to fetch data from API.',
            });
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('API Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'An unexpected error occurred.',
          });
        }
      );
    }


    selecteDesgnations: string = '';
    designations: { id: string, name: string }[] = [];
    
    getDesignations(departmentId: string): void {
      this.isLoading = true;
      const deptId = departmentId?.trim() ? departmentId : '0'; 
      this.common.getDesignationsApiCall(deptId).subscribe(
        (response: any) => {
          this.isLoading = false;
    
          if (response?.statusCode === 200 && Array.isArray(response.data)) {
            console.log('API Response:', response.data);
            this.designations = [{ id: "", name: "----Select----" }, ...response.data];
  
          } else {
            console.error('Error fetching data:', response.message);
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Failed to fetch data from API.',
            });
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('API Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'An unexpected error occurred.',
          });
        }
      );
    }


    selecteGroups: string = '';
    groups: { id: string, name: string }[] = [];
    
    getGroups( departmentId: string): void {
      this.isLoading = true;
      const deptId = departmentId?.trim() ? departmentId : '0'; 
      this.common.getGroupsApiCall(deptId).subscribe(
        (response: any) => {
          this.isLoading = false;
    
          if (response?.statusCode === 200 && Array.isArray(response.data)) {
            console.log('API Response:', response.data);
            this.groups = [{ id: "", name: "----Select----" }, ...response.data];
  
          } else {
            console.error('Error fetching data:', response.message);
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Failed to fetch data from API.',
            });
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('API Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'An unexpected error occurred.',
          });
        }
      );
    }

    selecteEmpCardNo: string = '';
    empCardNos: { id: string, name: string }[] = [];
    
    getEmpCardNo( departmentId: string): void {
      this.isLoading = true;
      this.common.getEmpCardNoApiCall(departmentId).subscribe(
        (response: any) => {
          this.isLoading = false;
    
          if (response?.statusCode === 200 && Array.isArray(response.data)) {
            console.log('API Response:', response.data);
            this.empCardNos = [{ id: "", name: "----Select----" }, ...response.data];
  
          } else {
            console.error('Error fetching data:', response.message);
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Failed to fetch data from API.',
            });
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('API Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'An unexpected error occurred.',
          });
        }
      );
    }



    selecteEmpType: string = 'Permanent';
    EmpTypes: { id: string, name: string }[] = [
      { id: "Permanent", name: "Permanent" },
      { id: "Temporary", name: "Temporary" }
     
    ];


    selecteEmpStatus: string = '1';
    empStatus: { id: string, name: string }[] = [
      { id: "1", name: "Regular" },
      { id: "2", name: "Probationary" },
      { id: "3", name: "Dismissed" },
      { id: "4", name: "Resigned" },
      { id: "5", name: "Terminate" },
      { id: "6", name: "Discharged" },
      { id: "7", name: "Unauthorized" },
      { id: "8", name: "On ML Leave" },
     
    ];
}
