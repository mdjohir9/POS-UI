import { Component } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';

import { NzFormatEmitEvent, NzTreeModule } from 'ng-zorro-antd/tree';
import { accessControlService } from 'src/app/core/services/accessControlService';
import Swal from 'sweetalert2';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-roles',
  standalone: false,
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.css',

})
export class UserRolesComponent {
  isLoading = true;
  showContent = false;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';
 
  allDatas: any[] = []; // Store original data
  //datas: ILoanApplication[] = []; // Store filtered data
  datas: any[] = [];
 
   CompanyID="0001";
   constructor(private fb: UntypedFormBuilder, private accessControlService: accessControlService,  private modal: NzModalService,
    private message: NzMessageService,) {}
   validateForm!: UntypedFormGroup;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

   ngOnInit(): void {
        this.validateForm = this.fb.group({
          txtRolesName: new FormControl('', Validators.required),
          ddlDataAccessLevel: new FormControl('', Validators.required),
          txtordering: new FormControl('', Validators.required),
          switchValue : new FormControl (true ,Validators.required )
        });
    
    // this.getComapnys();
     //this.getSetupPackages();
     this.getUserRoles();
   }
   

  
   getUserRoles(): void {
    this.accessControlService.getUserRoles().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.datas = response.data;
          this.showContent = true;
        }
      },
      error: (err) => {
        console.error('Failed to load recharge data:', err);
        this.showContent = true;
      }
    });
  }
  
  
submitForm(): void {
  if (this.validateForm.valid) {
    const formValues = this.validateForm.value;

    // Prepare API request payload
    const requestData = {
      userRole: formValues.txtRolesName,
      companyId: this.CompanyID,
      permissions: '1', // Pass selected IDs here
      ordering: Number(formValues.txtordering),
      dataAccessLevel: Number(formValues.ddlDataAccessLevel),
      isActive: formValues.switchValue
    };

    console.log('saveRolesApplication:', requestData);

    // API call
    this.accessControlService.saveRolesApplication(requestData).subscribe(
      (response) => {
        console.log('Success:', response);
        this.message.success('User role Save successfully.');
        this.getUserRoles();
        this.validateForm.reset();
      },
      (error) => {
        console.error('Error:', error);
        alert('Failed to submit form.');
      }
    );
  } else {
    alert('Please fill out all required fields.');
  }
}
deletecustommer(RoleId: any): void {
  this.modal.confirm({
    nzTitle: 'Are you sure you want to delete this user role?',
    nzContent: 'This action cannot be undone.',
    nzOkText: 'Yes',
    nzCancelText: 'No',
    nzOkDanger: true,
    nzOnOk: () =>
      this.accessControlService.deleteUserRole(RoleId).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.message.success('User role deleted successfully.');
            this.getUserRoles();
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
}