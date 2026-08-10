import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaveService } from 'src/app/core/services/leave.service';
import { ILoanApplication } from 'src/app/core/models/interfaces/ILoanApplication';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import Swal from 'sweetalert2';
import { LoanService } from 'src/app/core/services/LoanService';
import { ILeaveData } from 'src/app/core/models/interfaces/ILeave-data';
import { Router } from '@angular/router';
import { RechargeService } from 'src/app/core/services/recharge.service';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-recharge-requests',
  standalone: false,
  templateUrl: './recharge-requests.component.html',
  styleUrl: './recharge-requests.component.css'
})
export class RechargeRequestsComponent {
isLoading = true;
  showContent = false;
  dataAccessLevel: string | null = null;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';

  allDatas: any[] = []; 
  datas: any[] = [];
   listOfCurrentPageData: readonly ILoanApplication[] = [];

  constructor(private router: Router , private rechagreService: RechargeService,private modal: NzModalService,) {}

  ngOnInit(): void {
    this.dataAccessLevel = sessionStorage.getItem('__DataAccessLevel__');
    this.getRechargeRequests();
  }




getRechargeRequests(): void {
  this.rechagreService.getRechargeList().subscribe({
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
    


  edit(ApplicationID: any) {
    console.log("Edit Leave clicked", ApplicationID);

    this.router.navigate([`/loan/approve`, ApplicationID]); 
  }
  
  onEditClick(reachrageId: any) {
   
    this.router.navigate([`/wallet/recharge-update`, reachrageId]);  // Adjusted to match lazy-loaded route
  }


  onRechargeApproveClick(isApproved: boolean, rechargeID: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to approve this recharge?',
      nzContent: 'Once approved, this action cannot be undone.',
      nzOkText: 'Yes, Approve',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        const formData = {
          approval_status: isApproved,
          rechargeID: rechargeID,
        };
  
        console.log('Data for recharge approval:', formData);
  
        this.rechagreService.approveRechargeApplication(formData).subscribe({
          next: (response) => {
            console.log('Recharge approved successfully:', response);
            this.getRechargeRequests(); // Refresh the data view
          },
          error: (error) => {
            console.error('Error approving recharge:', error);
          }
        });
      }
    });
  }
  
}

