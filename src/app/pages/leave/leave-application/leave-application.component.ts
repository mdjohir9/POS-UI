import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { EmployeeService } from 'src/app/core/services/EmployeeService';
import { LeaveService } from 'src/app/core/services/leave.service';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { IEmployee } from 'src/app/core/models/interfaces/IEmployee';
import { ILeaveData } from 'src/app/core/models/interfaces/ILeave-data';
import { ILeaveType } from 'src/app/core/models/interfaces/ILeaveTyp';
import moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-application',
  standalone: false,
  templateUrl: './leave-application.component.html',
  styleUrl: './leave-application.component.css'
})
export class LeaveApplicationComponent implements OnInit{
  isLoading = true;
  showContent = false;
  employees: { empId: string, fullName: string }[] = [];
  leaveTypes: { leaveId: number, leaveName: string }[] = [];
  CompanyID="0001";
  constructor(private fb: UntypedFormBuilder,private leaveService: LeaveService, private employeeServce:EmployeeService) {}

  ngOnInit(): void {
 
    this.loadData();
    this.validateForm = this.fb.group({
      ddlCompany: new FormControl({ value: this.CompanyID, disabled: true }),
      ddlEmployee: new FormControl('', Validators.required),
      ddlLeaveType: new FormControl('', Validators.required),
      txtApplyDate: new FormControl('', Validators.required),
      txtStartDate: new FormControl('', Validators.required),
      txtEndDate: new FormControl('', Validators.required),
      txtTotalDays: new FormControl({ value: '', disabled: true }),
      txtPregnentDate: new FormControl(),
      txtExpectedDelivarydate: new FormControl(),
      ddlChardHendEmp: new FormControl(),
      txtLeaveAddress: new FormControl(),
      txtPurposeOfLeave: new FormControl(),
      txtEmergencyContact: new FormControl(),
      attachments: new FormControl(null)
    });


    this.getEmployees(); 
    this.getLeaveType();

    this.validateForm.get('txtStartDate')?.valueChanges.subscribe(() => this.calculateTotalDays());
    this.validateForm.get('txtEndDate')?.valueChanges.subscribe(() => this.calculateTotalDays());

    ['txtApplyDate', 'txtStartDate', 'txtEndDate', 'txtPregnentDate', 'txtExpectedDelivarydate'].forEach(field => {
      this.validateForm.get(field)?.valueChanges.subscribe(value => {
        if (value) {
          this.validateForm.patchValue({
            [field]: this.formatDate(value)
          }, { emitEvent: false });
        }
      });
    });
  }
formatDate(date: Date): string {
  if (!(date instanceof Date)) date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
  validateForm!: UntypedFormGroup;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };


  async onSubmit(): Promise<void> {
    if (this.validateForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill out all required fields before submitting.',
      });
      return;
    }
  
    try {
      const base64Files = await this.handleFileUpload();
  
      const formData = {
        applicationId: '',
        leaveTypeId: this.validateForm.get('ddlLeaveType')?.value,
        isHalfDayLeave: false,
        applyDate: this.formatDate(this.validateForm.get('txtApplyDate')?.value),
        leaveStartDate: this.formatDate(this.validateForm.get('txtStartDate')?.value),
        leaveEndDate: this.formatDate(this.validateForm.get('txtEndDate')?.value),
        totalLeaveDays: this.validateForm.get('txtTotalDays')?.value || 0,
        pregnantDate: this.formatDate(this.validateForm.get('txtPregnentDate')?.value) || null,
        expectedDeliveryDate: this.formatDate(this.validateForm.get('txtExpectedDelivarydate')?.value) || null,
        remarks: this.validateForm.get('txtPurposeOfLeave')?.value,
        handedOverEmpId: this.validateForm.get('ddlChardHendEmp')?.value || '',
        lvAddress: this.validateForm.get('txtLeaveAddress')?.value,
        lvContact: this.validateForm.get('txtEmergencyContact')?.value,
        companyId: this.validateForm.get('ddlCompany')?.value,
        empTypeId: 0,
        sftId: 0,
        dptId: '',
        dsgId: '',
        gId: 0,
        empId: this.validateForm.get('ddlEmployee')?.value,
        documentsBase64: base64Files,
        documment: ''
      };
      console.log(formData);
  
      this.leaveService.saveLeaveApplication(formData).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Your leave application has been submitted successfully!'
          });
          this.loadData();
        },
        () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error submitting your leave application. Please try again.'
          });
        }
      );
    } catch (error) {
      console.error('Error handling file upload:', error);
      Swal.fire({
        icon: 'error',
        title: 'File Processing Error',
        text: 'There was an issue processing your files. Please try again.'
      });
    }
  }
  

  

  calculateTotalDays() {
    const startDate = this.validateForm.get('txtStartDate')?.value;
    const endDate = this.validateForm.get('txtEndDate')?.value;

    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);

      if (end.isSameOrAfter(start)) {
        const totalDays = end.diff(start, 'days') + 1; // Include the end date
        this.validateForm.patchValue({ txtTotalDays: totalDays }, { emitEvent: false });
      } else {
        this.validateForm.patchValue({ txtTotalDays: '' }, { emitEvent: false });
      }
    }
  }

  allFiles: File[] = [];
  allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
  maxFileSize = 2 * 1024 * 1024; // 2 MB

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    const validFiles: File[] = [];

    files.forEach(file => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      if (file.size <= this.maxFileSize && this.allowedExtensions.includes(fileExtension)) {
        validFiles.push(file);
      } else {
      Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: `File "${file.name}" is not allowed. Please ensure it is under 2MB and has a valid file type. Allowed types: ${this.allowedExtensions.join(', ')}`,
          confirmButtonText: 'OK'
        }); 
      }
    });

    this.allFiles = [...this.allFiles, ...validFiles];
    this.validateForm.get('attachments')?.setValue(this.allFiles); // Bind files to the form control
    input.value = ''; // Reset input value to allow re-selection of the same file
  }



  removeFile(index: number): void {
    this.allFiles.splice(index, 1);
    this.validateForm.get('attachments')?.setValue(this.allFiles); // Update form control
  }

  async handleFileUpload(): Promise<string[]> {
    const base64Files: string[] = [];
    for (const file of this.allFiles) {
      const base64File = await this.getBase64(file);
      base64Files.push(base64File);
    }
    return base64Files;
  }
  
  private getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
  
  loadData() {
    // Simulate an asynchronous data loading operation
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }






  selectedEmployee:string="0";
  getEmployees() {
    this.employeeServce.getEmployeesApiCall().subscribe(
      (response: IApiResponse<IEmployee[]>) => {
        if (response.statusCode === 200) {
          this.employees = [{ empId: "0", fullName: '-----Select----' }, ...response.data];
          this.selectedEmployee="0";
        } else {
          console.error('Error fetching employees:', response.message);
        }
      },
      error => {
        console.error('API Error:', error);
      }
    );
}

selectLvType: number = 0;
getLeaveType() {
  this.leaveService.getLeaveTypeApiCall().subscribe(
    (response: IApiResponse<ILeaveType[]>) => {
      if (response.statusCode === 200) {
        this.leaveTypes = [{ leaveId: 0, leaveName: '----Select----' }, ...response.data];
        this.selectLvType = 0; 
      } else {
        console.error('Error fetching employees:', response.message);
      }
    },
    error => {
      console.error('API Error:', error);
    }
  );
}





}
