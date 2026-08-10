import { Component } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';

import { NzFormatEmitEvent, NzTreeModule } from 'ng-zorro-antd/tree';
import { accessControlService } from 'src/app/core/services/accessControlService';
import Swal from 'sweetalert2';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { error } from 'console';
@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  isLoading = true;
   showContent = false;
   value = '';
   statusFilter = 'All'; 
   searchAny = '';
   dataType: string = 'allDatas';
  
   allDatas: any[] = []; // Store original data
   datas: any[] = [];
  
    CompanyID="1111";
    constructor(private fb: UntypedFormBuilder, private accessControlService: accessControlService,  private modal: NzModalService,
     private message: NzMessageService,) {}
    validateForm!: UntypedFormGroup;
   captchaTooltipIcon: NzFormTooltipIcon = {
     type: 'info-circle',
     theme: 'twotone'
   };
 
    ngOnInit(): void {
      this.validateForm = this.fb.group({
        txtFirstName: new FormControl('', Validators.required),
        txtLastName: new FormControl('', Validators.required),
        txtUserName: new FormControl('', Validators.required),
        txtUserPassward: new FormControl('', Validators.required),
        ddlUserRole: new FormControl('', Validators.required),
        ddlDataAccessLevel: new FormControl('', Validators.required),
        switchValue : new FormControl (true ,Validators.required )

      });
      
     
     // this.getComapnys();
      //this.getSetupPackages();
      this.getUsers();
      this.getRolesNameId();
    }
    
 
   
    getUsers(): void {
     this.accessControlService.getUsers().subscribe({
       next: (response) => {
         if (response.statusCode === 200) {
           this.allDatas = response.data;
           this.showContent = true;
         }
       },
       error: (err) => {
         console.error('Failed to load recharge data:', err);
         this.showContent = true;
       }
     });
   }
   
  rolesList: any[] = [];

  getRolesNameId(): void {
    this.accessControlService.getRolesNameId().subscribe((res) => {
      if (res.statusCode === 200) {
        this.rolesList = res.data;
      }
    });
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      const formValues = this.validateForm.value;
  
      const requestData = {
        firstName: formValues.txtFirstName,
        lastName: formValues.txtLastName,
        userName: formValues.txtUserName.trim(),
        userPassword: formValues.txtUserPassward.trim(),
        userRoleID: formValues.ddlUserRole,
        isGuestUser: false, // Update based on actual input if required
        isApprovingAuthority: false, // Update based on actual input if required
        referenceID: '', // Update with actual reference if needed
        additionalPermissions: '', // Add selected permissions
        removedPermissions: '', // Add removed permissions
        dataAccessLevel: formValues.ddlDataAccessLevel,
        dataAccessPermission: '', // Add if you're managing permissions per module/user
        isActive: formValues.switchValue,
        companyId: this.CompanyID
      };
  
      console.log('User Submit Payload:', requestData);
  
      this.accessControlService.SaveUser(requestData).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: response.message,
              confirmButtonText: 'Ok'
            })
            this.validateForm.reset();
            this.getUsers();
          } else {
             Swal.fire({ icon: 'warning',  title: 'Registration Failed',  text: response.message, confirmButtonText: 'Try Again' });

           // this.message.error(response.message);
          }
        },
        error: (err) => {
          console.error(err);
          this.message.error(err.message);
        }
      });
  
    } else {
      this.message.warning('Please fill out all required fields.');
      this.validateForm.markAllAsTouched();
    }
  }
  
 deletecustommer(Id: any): void {
   this.modal.confirm({
     nzTitle: 'Are you sure you want to delete this user?',
     nzContent: 'This action cannot be undone.',
     nzOkText: 'Yes',
     nzCancelText: 'No',
     nzOkDanger: true,
     nzOnOk: () =>
       this.accessControlService.deleteUser(Id).subscribe({
         next: (response) => {
           if (response.statusCode === 200) {
             this.message.success('User deleted successfully.');
             this.getUsers();
           } else {
             this.message.error(response.message || 'Failed to delete user role.');
           }
         },
         error: (error) => {
           this.message.error('Something went wrong during deletion.');
           console.error(error);
         }
       }),
   });
 }
 
 nzEvent(event: NzFormatEmitEvent): void {
   console.log(event);
 }

 filterByAnyMetchingData() {
  const searchTerm = this.searchAny.toLowerCase().trim();

  if (!searchTerm) {
    this.datas = [...this.allDatas]; // Reset
    this.dataType = 'allDatas'; // Show full list
    return;
  }

  this.datas = this.allDatas.filter(custommer =>
    Object.values(custommer).some(value =>
      value?.toString().toLowerCase().includes(searchTerm)
    )
  );

  this.dataType = 'datas'; // Show filtered result
}

}
